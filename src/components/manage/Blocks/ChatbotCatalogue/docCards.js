/**
 * Remark plugin: converts a paragraph consisting of a
 * `![[doc: Document Title]]` marker into a custom `cca-doc-card` element.
 *
 * react-markdown maps the custom element (via `data.hName`) to a component
 * supplied by the caller through `extraMarkdownComponents`
 * (see MessageTextRenderer pass-through in @eeacms/volto-eea-chatbot).
 *
 * The assistant is prompted (Onyx side) to list relevant documents with one
 * marker per line, e.g.:
 *
 *   ![[doc: Europe 2020: The EU's platform for climate action]]
 *   ![[doc: France: National Adaptation Strategy]]
 */

const DOC_MARKER = /^!\[\[\s*doc:\s*(.+?)\s*\]\]$/;

function walk(nodes, visit) {
  for (let i = 0; i < nodes.length; i += 1) {
    const result = visit(nodes[i], i, nodes);
    if (result === 'skip') continue;
    if (nodes[i].children) {
      walk(nodes[i].children, visit);
    }
  }
}

export const remarkCcaDocCards = () => (tree) => {
  walk(tree.children || [], (node, index, parent) => {
    if (node.type !== 'paragraph' || !Array.isArray(node.children)) {
      return undefined;
    }
    // Only transform paragraphs made of plain text (avoid partial matches
    // when the line contains other inline content).
    if (!node.children.every((child) => child.type === 'text')) {
      return undefined;
    }
    const text = node.children
      .map((child) => child.value)
      .join('')
      .trim();
    const match = text.match(DOC_MARKER);
    if (!match) {
      return undefined;
    }
    parent[index] = {
      type: 'ccaDocCard',
      value: match[1],
      data: { hName: 'cca-doc-card', hProperties: { title: match[1] } },
    };
    return 'skip';
  });
  return tree;
};
