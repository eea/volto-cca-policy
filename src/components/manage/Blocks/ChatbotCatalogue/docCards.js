/**
 * Remark plugin: converts `![[doc: Document Title]]` markers in the answer
 * text into custom `cca-doc-card` elements.
 *
 * react-markdown maps the custom element (via `data.hName`) to a component
 * supplied by the caller through `extraMarkdownComponents`
 * (see MessageTextRenderer pass-through in @eeacms/volto-eea-chatbot).
 *
 * Markers are matched in ANY text node (own line, inside list items,
 * mid-sentence), not only whole paragraphs — the LLM does not always put
 * them on a line of their own.
 *
 * The assistant is prompted (Onyx side) to list relevant documents with
 * markers, e.g.:
 *
 *   ![[doc: Europe 2020: The EU's platform for climate action]]
 *   ![[doc: France: National Adaptation Strategy]]
 */

const DOC_MARKER_RE = /!\[\[\s*doc:\s*([^\]\r\n]+)\]\]/g;

function makeCardNode(title) {
  return {
    type: 'ccaDocCard',
    value: title,
    data: { hName: 'cca-doc-card', hProperties: { title } },
  };
}

function walkNodes(children, visit) {
  for (let i = 0; i < children.length; i += 1) {
    const replaced = visit(children[i], i, children);
    if (Array.isArray(replaced)) {
      // Splice the replacement nodes in place of the visited one. The
      // replacement nodes (text / ccaDocCard) have no children to walk.
      children.splice(i, 1, ...replaced);
      i += replaced.length - 1;
    } else if (children[i].children) {
      walkNodes(children[i].children, visit);
    }
  }
}

export const remarkCcaDocCards = () => (tree) => {
  walkNodes(tree.children || [], (node) => {
    if (node.type !== 'text' || typeof node.value !== 'string') {
      return undefined;
    }
    DOC_MARKER_RE.lastIndex = 0;
    if (!DOC_MARKER_RE.test(node.value)) {
      return undefined;
    }

    const parts = [];
    let last = 0;
    let match;
    DOC_MARKER_RE.lastIndex = 0;
    while ((match = DOC_MARKER_RE.exec(node.value)) !== null) {
      if (match.index > last) {
        parts.push({
          type: 'text',
          value: node.value.slice(last, match.index),
        });
      }
      parts.push(makeCardNode(match[1].trim()));
      last = match.index + match[0].length;
    }
    if (last < node.value.length) {
      parts.push({ type: 'text', value: node.value.slice(last) });
    }
    return parts;
  });
  return tree;
};
