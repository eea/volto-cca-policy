# Link Integrity & Workflow Documentation Index

This directory houses the research, analysis, and specifications for Plone/Volto Link Integrity tracking and the "Warn Before Private" workflow state transition verification feature.

Below is an overview of the role and purpose of each document in this directory:

---

## 📖 Document Catalog

### 1. [README.md](file:///home/tibi/work/eea.docker.plone-climateadapt/cca/frontend/src/addons/volto-cca-policy/artifacts/link-integrity-workflow/README.md)
*   **Role**: **Feature Specification & Technical Implementation Guide**
*   **Description**: High-level specification outlining the "Warn before private" workflow transition warning system. It explains how workflow transitions to private or retracted states are intercepted to check for breaches, contains a Mermaid sequence diagram of the operational flow, and details pointers to the exact implementation files (`Workflow.jsx`, `WorkflowLinkIntegrityModal.jsx`, and the unit test suite).

### 2. [understanding-link-integrity.md](file:///home/tibi/work/eea.docker.plone-climateadapt/cca/frontend/src/addons/volto-cca-policy/artifacts/link-integrity-workflow/understanding-link-integrity.md)
*   **Role**: **Initial Research & Mechanics Overview**
*   **Description**: Explains the underlying mechanics of Plone's `plone.app.linkintegrity` package, the `@linkintegrity` and `@relations` REST API endpoints, how internal references are stored in the `zc.relation` catalog using `isReferencing`, and proposes the initial architectural solution for shadowing the Volto toolbar component.

### 3. [volto-block-link-discovery.md](file:///home/tibi/work/eea.docker.plone-climateadapt/cca/frontend/src/addons/volto-cca-policy/artifacts/link-integrity-workflow/volto-block-link-discovery.md)
*   **Role**: **Block Parser Link Extraction Specs**
*   **Description**: Detailed specifications on how the Plone backend's block-to-HTML parser (via `plone.volto`) parses internal links and retrieves referencing UIDs from complex Volto blocks (e.g. Columns, Teasers, Maps) to keep the relation catalog accurately indexed.

### 4. [volto-block-link-analysis.md](file:///home/tibi/work/eea.docker.plone-climateadapt/cca/frontend/src/addons/volto-cca-policy/artifacts/link-integrity-workflow/volto-block-link-analysis.md)
*   **Role**: **Technical Analysis of Internal Linking**
*   **Description**: Analyzes how internal links are serialized, stored, and resolved within customized layouts. Explains matching strategies for Dexterity schemas and Choice relation fields.

### 5. [link-integrity-blocks-report.md](file:///home/tibi/work/eea.docker.plone-climateadapt/cca/frontend/src/addons/volto-cca-policy/artifacts/link-integrity-workflow/link-integrity-blocks-report.md)
*   **Role**: **Volto Blocks Reference Index**
*   **Description**: A quick-reference status report listing the Volto blocks whose internal link fields are covered by link integrity tracking and validation rules.

### 6. [link-integrity-block-fields-report.md](file:///home/tibi/work/eea.docker.plone-climateadapt/cca/frontend/src/addons/volto-cca-policy/artifacts/link-integrity-workflow/link-integrity-block-fields-report.md)
*   **Role**: **Field Mapping Specification**
*   **Description**: A comprehensive deep-dive report mapping exactly which fields and properties within the custom blocks schemas are indexed and tracked by the link integrity processor.
