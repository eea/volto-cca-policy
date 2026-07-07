# Workflow Component Customization

This component shadows the core Volto `Workflow` component located at `@plone/volto/components/manage/Workflow/Workflow.jsx`.

## Why this is needed

In Climate-ADAPT, we want to prevent users from unintentionally breaking internal links when making content private. Volto's core workflow transition dropdown does not perform any link integrity checks before executing a state change.

By shadowing this component, we can intercept transitions that might hide content from public users and warn the editor if other pages are linking to the current item.

## Modifications

1.  **Interception Logic**: The `transition` function was modified to check for "private-like" transitions (`private`, `reject`, `retract`).
2.  **Link Integrity Check**: When a sensitive transition is selected, the `linkIntegrityCheck` action is dispatched to the backend.
3.  **State Management**: Added local state (`showWarningModal`, `pendingOption`, `transitionTriggered`) to handle the asynchronous check and the confirmation flow.
4.  **Confirmation Modal**: Integrated `WorkflowLinkIntegrityModal` which displays the list of pages that would have broken links.
5.  **Auto-proceed**: Added an `useEffect` that automatically executes the transition if the link integrity check returns zero breaches. It is guarded by `transitionTriggered` to prevent double-execution if the user clicks "Change state anyway" at the same time.
6.  **Activity Indicators**: Added `Dimmer` and `Loader` components from `semantic-ui-react` to provide visual feedback while the link integrity check is loading and during the workflow transition execution.

## Design Decisions

### Plain HTML dialog via React Portal — no semantic-ui-react

The `WorkflowLinkIntegrityModal` renders via `ReactDOM.createPortal` into a `<div>` appended to `document.body`. This places it outside the toolbar dropdown's DOM subtree and CSS stacking context, so it appears as a proper full-page overlay at `z-index: 10000`.

No `semantic-ui-react` `Confirm`, `Modal`, or `Portal` is used. Those components rely on Portals, auto-controlled state, and shorthand factory systems that make click handlers unreliable in our use case. The plain HTML approach gives us full, predictable control: `onClick` on a `<button>` always fires.

### Toolbar `handleClickOutside` interference

Volto's `Toolbar` component registers a global `document.addEventListener('mousedown', ...)` handler that closes the toolbar menu when clicking outside it. Since our modal renders on top of the toolbar menu, any `mousedown` would bubble up to `document` and trigger the menu close — which unmounts the `Workflow` component and our modal before the button `onClick` can fire.

The fix: a **capture-phase** `mousedown` listener on the portal root calls `e.stopPropagation()`, preventing the event from ever reaching `document`. This keeps the toolbar menu open while our modal is visible, without interfering with normal `click` event handling on the buttons.

### Synchronous breach derivation (no useEffect + local state)

The breach data (`brokenReferences`, `breaches`) is computed synchronously inside a `computeBreaches()` helper function rather than via `useEffect` + `useState`. This is critical: the `linkIntegrity` reducer sets `loading: false` and `result: data` in the same action (`_SUCCESS`). If breach data were derived via `useEffect` + local state, there would be a render cycle where `loading` is already `false` but `brokenReferences` is still `0` (stale local state), causing the modal to close prematurely before the breach data is processed.

### `transitionTriggered` guard

A `transitionTriggered` state flag prevents the auto-proceed `useEffect` from firing after the user has already clicked "Change state anyway", avoiding duplicate workflow transition API calls.

## Reference

See implementation details in:
`artifacts/link-integrity-workflow/understanding-link-integrity.md`
