# Workflow Component Customization

This component shadows the core Volto `Workflow` component located at `@plone/volto/components/manage/Workflow/Workflow.jsx`.

## Why this is needed

In Climate-ADAPT, we want to prevent users from unintentionally breaking internal links when making content private. Volto's core workflow transition dropdown does not perform any link integrity checks before executing a state change.

By shadowing this component, we can intercept transitions that might hide content from public users and warn the editor if other pages are linking to the current item.

## Modifications

1.  **Interception Logic**: The `transition` function was modified to check for "private-like" transitions (`private`, `reject`, `retract`).
2.  **Link Integrity Check**: When a sensitive transition is selected, the `linkIntegrityCheck` action is dispatched to the backend.
3.  **State Management**: Added local state (`showWarningModal`, `pendingOption`) to handle the asynchronous check and the confirmation flow.
4.  **Confirmation Modal**: Integrated `WorkflowLinkIntegrityModal` which displays the list of pages that would have broken links.
5.  **Auto-proceed**: Added an `useEffect` that automatically executes the transition if the link integrity check returns zero breaches.
6.  **Activity Indicators**: Added `Dimmer` and `Loader` components from `semantic-ui-react` to provide visual feedback while the link integrity check is loading and during the workflow transition execution.

## Reference

See implementation details in:
`artifacts/link-integrity-workflow/understanding-link-integrity.md`
