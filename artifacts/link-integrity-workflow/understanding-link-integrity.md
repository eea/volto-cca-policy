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
- **Interaction**:
    - If no incoming links exist, the transition proceeds immediately.
    - If incoming links are found, a modal appears showing the list of referencing pages.
    - The user can either "Cancel" the transition or select "Change state anyway" to proceed.

## Example API Call
```http
GET /path/to/object/@linkintegrity?uids=<UID>
```
Response:
```json
[
  {
    "@id": "http://localhost:3000/page-to-be-private",
    "title": "Target Page",
    "breaches": [
      {
        "@id": "http://localhost:3000/source-page",
        "title": "Source Page",
        "uid": "..."
      }
    ],
    "items_total": 0
  }
]
```
