# Understanding Link Integrity in Plone and Volto

## Use Case
A user is editing a content item and decides to change its workflow state to "Private". Before this action is finalized, the system should check if other content items on the website are linking to this item. If such links exist, the user should be informed that these links will effectively "break" for public users (leading to an unauthorized screen).

## Goal
Identify a programmatic way (ideally a REST API endpoint) to retrieve a list of content items that link to a specific object.

## Research Findings

### 1. `plone.app.linkintegrity`
- **Mechanism**: Tracks internal links using the `zc.relation` catalog with the relationship name `isReferencing`.
- **Logic**: Extracts links from Dexterity `RichText` fields and Volto blocks (via `plone.volto`).
- **Querying**: Provides utility functions in `plone.app.linkintegrity.utils`, notably `getIncomingLinks(obj)`.

### 2. `plone.restapi`
- **Existing Endpoints**:
    - **`/@linkintegrity?uids=<UID>`**: Returns "breaches" (items linking to the specified UIDs). This is the same logic used by Plone's delete confirmation screen.
    - **`/@relations?target=<UID>&relation=isReferencing`**: A more generic endpoint to query the relation catalog. Omitting the `relation` parameter returns all types of incoming relations (including `relatedItems`).
- **Recommendation**: For the "warn before private" use case, `/@linkintegrity` is highly suitable because it returns structured data specifically designed for notifying users about broken links. However, `/@relations` is better if a simple list of *any* linking item is needed.

### 3. `plone.volto` / Volto Frontend
- **Backend**: Ensures that internal links within Volto blocks (columns, teasers, etc.) are correctly indexed by `plone.app.linkintegrity`.
- **Frontend Logic**: 
    - Volto has a `linkIntegrityCheck` action in `@plone/volto/actions` that calls the `/@linkintegrity` endpoint.
    - The results are stored in the `linkIntegrity` reducer.
    - The `ContentsDeleteModal` component in Volto core is the canonical example of how to display these breaches.
- **Workflow Integration**: The state transition dropdown is managed by the `Workflow` component (`@plone/volto/components/manage/Workflow/Workflow`).

## Recommended Solution

To implement the "warn before private" feature:

1. **Backend Endpoint**: Use `GET /@linkintegrity?uids=<UID>`.
2. **Frontend Integration (Shadowing)**: 
    - Shadow the core `Workflow` component by copying it to `frontend/src/addons/volto-cca-policy/src/customizations/volto/components/manage/Workflow/Workflow.jsx`.
    - Intercept the `onChange` handler in the shadowed component.
    - If the target state is "Private" (or similar), trigger the `linkIntegrityCheck`.
    - Show a confirmation modal (similar to `ContentsDeleteModal`) if breaches are found.

## Volto Implementation Details

### Shadowing Path
```
frontend/src/addons/volto-cca-policy/src/customizations/volto/components/manage/Workflow/Workflow.jsx
```

### Logic Hook
In the shadowed `Workflow.jsx`, modify the `transition` function:

```javascript
const transition = (selectedOption) => {
  const isPrivateTransition = ['private', 'reject', 'retract'].includes(selectedOption.value) || 
                               selectedOption.url.endsWith('/reject') || 
                               selectedOption.url.endsWith('/retract');

  if (isPrivateTransition) {
    setPendingOption(selectedOption);
    dispatch(linkIntegrityCheck([content.UID]));
    setShowWarningModal(true);
  } else {
    executeTransition(selectedOption);
  }
};
```

### Components to reuse
- `Confirm` from `semantic-ui-react` for the modal wrapper.
*   **Existing Actions**: `linkIntegrityCheck` from `@plone/volto/actions`.
*   **Existing Reducers**: `state.linkIntegrity.result` to access the breaches.
*   **UI Reference**: `ContentsDeleteModal.jsx` in Volto core for the table rendering logic of broken links.

## Final Implementation

The feature was implemented in the `volto-cca-policy` add-on on a dedicated branch.

### Git Branch
- **Branch Name**: `link-integrity-workflow`

### Files Created/Modified
1.  **Shadowed Component**: `src/customizations/volto/components/manage/Workflow/Workflow.jsx`
    - Shadowed from `@plone/volto/components/manage/Workflow/Workflow.jsx`.
    - Modified to intercept state changes to `private`, `reject`, and `retract`.
    - Integrated with `linkIntegrityCheck` action and `WorkflowLinkIntegrityModal`.
2.  **New Component**: `src/components/manage/Workflow/WorkflowLinkIntegrityModal.jsx`
    - A custom confirmation modal that displays link integrity breaches.
    - Uses `semantic-ui-react` for the UI (Confirm, Table, Loader).
    - Accesses `state.linkIntegrity.result` to render the list of affected content.
3.  **Components Index**: `src/components/index.js`
    - Exported `WorkflowLinkIntegrityModal` for use in the shadowed `Workflow` component.

### Logic Summary
- **Trigger**: When the user selects a "Private" transition in the workflow dropdown.
- **Verification**: The `linkIntegrityCheck` action is dispatched for the current object's UID.
- **Race Condition Prevention**: The system explicitly waits for the `linkIntegrity.loaded` state to be true before deciding whether to auto-proceed or show the modal. This prevents transitions from executing prematurely due to stale or initial empty state.
- **Activity Indicators (UX)**: 
    - During the link integrity check, a `Dimmer` and `Loader` are shown within the `WorkflowLinkIntegrityModal` with the message "Checking references...".
    - During the actual workflow transition execution, a `Dimmer` and `Loader` are shown over the state selection dropdown to indicate that the transition is in progress.
- **Interaction**:
    - If no incoming links exist (`breaches.length === 0`), the transition proceeds automatically once the check is loaded.
    - If incoming links are found, the `WorkflowLinkIntegrityModal` displays the list of referencing pages.
    - The user can either "Cancel" the transition or select "Change state anyway" to proceed.

## User Story: Testing the Link Integrity Warning

### Description
As a Content Editor, I want to be warned when I am about to make a page private if other pages are linking to it, so that I can avoid creating broken links for visitors.

### Acceptance Criteria
1.  **Positive Case (Breaches Found)**: 
    - Given a "Target Page" that is published.
    - Given a "Source Page" that contains a link to "Target Page".
    - When I go to "Target Page" and select "Make Private" (or "Reject" / "Retract") from the state dropdown.
    - Then I should see a "Checking references..." loading indicator.
    - Then I should see a warning modal titled "Warning: Potential broken links".
    - Then the modal should list "Source Page" as an item that will have a broken link.
    - When I click "Cancel", the modal should close and the page should remain "Published".
    - When I click "Change state anyway", the modal should close and the page should transition to "Private".

2.  **Negative Case (No Breaches)**:
    - Given a "Target Page" that is published and has NO incoming links.
    - When I select "Make Private" from the state dropdown.
    - Then I should see a brief "Checking references..." indicator.
    - Then the page should transition to "Private" immediately without showing a warning modal.

### Test Procedure
1.  **Setup Content**:
    - Create a page named "Linked Page" and Publish it.
    - Create another page named "Referencing Page". 
    - In "Referencing Page", add a Text block and insert an internal link to "Linked Page". Publish "Referencing Page".
2.  **Verify Warning**:
    - Navigate to "Linked Page".
    - Open the state dropdown in the toolbar.
    - Select "Make Private".
    - **Observe**: The "Checking references..." dimmer should appear briefly.
    - **Verify**: The warning modal should appear listing "Referencing Page".
3.  **Test Cancellation**:
    - Click "Cancel" in the modal.
    - **Verify**: The page is still in "Published" state.
4.  **Test Confirmation**:
    - Select "Make Private" again.
    - Click "Change state anyway" in the modal.
    - **Verify**: The page state changes to "Private" and a success toast appears.
