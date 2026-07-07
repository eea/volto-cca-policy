# Link Integrity Workflow warning Specification

## Overview

To prevent breaking the browsing experience of public (anonymous) website visitors, Climate-ADAPT intercepts workflow transitions that limit content visibility (such as changing a state to **Private**, **Reject**, or **Retract**). 

Before finalizing these transitions, the system performs an asynchronous backend check using the Plone link integrity relation catalog (`@linkintegrity`) to discover if any other published pages link to the target item. If referencing items are found, the user is presented with a warning modal detailing the pages that link to the item, allowing them to either cancel or proceed anyway.

---

## Architectural Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Editor
    participant WorkflowDropdown as Workflow Dropdown (Workflow.jsx)
    participant API as Plone REST API (/@linkintegrity)
    participant WarningModal as Warning Modal (WorkflowLinkIntegrityModal.jsx)

    Editor->>WorkflowDropdown: Select "Make Private" / "Reject" / "Retract"
    WorkflowDropdown->>API: Dispatch linkIntegrityCheck([UID])
    WorkflowDropdown->>WarningModal: Open Warning Modal (with Loader active)
    Note over WarningModal: Action buttons are disabled during check

    alt No breaches exist
        API-->>WorkflowDropdown: Return 0 breaches
        WorkflowDropdown->>WorkflowDropdown: Auto-execute workflow transition
        WorkflowDropdown->>WarningModal: Close Modal automatically
        WorkflowDropdown-->>Editor: Show success toast
    else Breaches exist
        API-->>WorkflowDropdown: Return breach details
        WorkflowDropdown->>WarningModal: Deactivate Loader & enable confirm
        WarningModal-->>Editor: Render list of linking pages & warning copy
        
        alt Editor clicks "Cancel"
            Editor->>WarningModal: Click "Cancel"
            WarningModal->>WorkflowDropdown: Reset pending transition & close modal
        else Editor clicks "Change state anyway"
            Editor->>WarningModal: Click "Change state anyway"
            WarningModal->>WorkflowDropdown: Trigger onOk() -> executeTransition()
            WorkflowDropdown->>WorkflowDropdown: Execute workflow transition
            WorkflowDropdown->>WarningModal: Close Modal
            WorkflowDropdown-->>Editor: Show success toast
        end
    end
```

---

## Implementation Details

### 1. Workflow Interception (Customization)
*   **Path**: [Workflow.jsx](file:///home/tibi/work/eea.docker.plone-climateadapt/cca/frontend/src/addons/volto-cca-policy/src/customizations/volto/components/manage/Workflow/Workflow.jsx)
*   **Role**: Shadows Volto core's workflow select component. Intercepts transitions containing state keys (`private`, `reject`, `retract`) or URL suffixes (`/reject`, `/retract`). Dispatches `linkIntegrityCheck` and manages `pendingOption` state. Executes transition automatically if 0 breaches are found.

### 2. Warning Modal Component
*   **Path**: [WorkflowLinkIntegrityModal.jsx](file:///home/tibi/work/eea.docker.plone-climateadapt/cca/frontend/src/addons/volto-cca-policy/src/components/manage/Workflow/WorkflowLinkIntegrityModal.jsx)
*   **Role**: A plain HTML overlay dialog rendered via `ReactDOM.createPortal` into a `<div>` appended to `document.body`. Zero `semantic-ui-react` dependencies — no `Confirm`, `Modal`, or `Portal`.
*   **Why not `semantic-ui-react`?** The `Confirm` and `Modal` components use internal Portals, auto-controlled state, and shorthand factory systems that made click handlers unreliable in the toolbar dropdown context. The Toolbar's global `document mousedown` handler (`handleClickOutside`) would intercept clicks, close the menu, and unmount the modal before `onConfirm` could fire.
*   **Key implementation details**:
    *   **Portal rendering** — renders at `document.body` level with `z-index: 10000`, placing it outside the toolbar dropdown's DOM subtree and CSS stacking context so it appears as a proper full-page overlay.
    *   **Capture-phase `mousedown` guard** — a `capture=true` listener on the portal root calls `e.stopPropagation()`, preventing the Toolbar's `handleClickOutside` from firing while the modal is open.
    *   **Synchronous breach derivation** — `computeBreaches()` computes `brokenReferences` and `breaches` during render (no `useEffect` + `useState`), so the data is always in sync with `loading` in the same render cycle. This prevents a race condition where `loading` becomes `false` but `brokenReferences` is still `0`, causing premature modal closure.
    *   **Inline styles** — all CSS is embedded via a `<style>` tag, no external stylesheet dependency.
*   **Key UX Features**:
    *   Maintains button state `disabled: loading` during ongoing checks to prevent premature actions.
    *   Renders a CSS spinner and loading text during the check.
    *   Displays the exact list of referencing (source) items and target sub-items.
    *   Displays the warning copy:
        > *"By changing the state, we're not breaking references, but may break user experience for final Anonymous users. There are {brokenReferences} {variation} to this item:"*
    *   Closes on backdrop click, button click, or `Escape` key.

### 3. Unit Verification Suite
*   **Path**: [WorkflowLinkIntegrityModal.test.jsx](file:///home/tibi/work/eea.docker.plone-climateadapt/cca/frontend/src/addons/volto-cca-policy/src/components/manage/Workflow/WorkflowLinkIntegrityModal.test.jsx)
*   **Role**: Houses Jest/React Testing Library assertions verifying loading indicator visibility, auto-proceed behavior with 0 breaches, warnings list aggregation for multiple breaches, and confirm button presence.
