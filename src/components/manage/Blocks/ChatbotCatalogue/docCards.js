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

import {
  DOC_MARKER_RE,
  cleanStrayLeadingAsterisks,
  deduplicateAdjacentHeadings,
  normalizeCitationParagraphsToLists,
  parseMarkdownLines,
  shouldUnwrapCodeNode,
  unwrapCardLists,
  unwrapCardParagraphs,
} from './astUtils';

export { DOC_MARKER_RE };

function makeCardNode(title) {
  return {
    type: 'ccaDocCard',
    value: title,
    data: { hName: 'cca-doc-card', hProperties: { title } },
  };
}

function unwrapCodeNode(node, parseFn) {
  if (typeof parseFn === 'function') {
    try {
      const parsed = parseFn(node.value);
      if (
        parsed &&
        Array.isArray(parsed.children) &&
        parsed.children.length > 0
      ) {
        return parsed.children;
      }
    } catch {
      // Fall through to parseMarkdownLines
    }
  }
  return parseMarkdownLines(node.value);
}

function walkNodes(children, visit) {
  for (let i = 0; i < children.length; i += 1) {
    const node = children[i];
    const replaced = visit(node, i, children);
    if (Array.isArray(replaced)) {
      // Splice the replacement nodes in place of the visited one. The
      // replacement nodes (text / ccaDocCard) have no children to walk.
      children.splice(i, 1, ...replaced);
      i += replaced.length - 1;
    } else if (children[i]?.children) {
      walkNodes(children[i].children, visit);
    }
  }
}

export const remarkCcaDocCards = function () {
  const parseFn =
    typeof this?.parse === 'function' ? (str) => this.parse(str) : null;

  return (tree) => {
    if (!tree || !Array.isArray(tree.children)) {
      return tree;
    }

    // 1. Pre-pass: unwrap code blocks that contain markdown sections or doc markers
    for (let i = 0; i < tree.children.length; i += 1) {
      const node = tree.children[i];
      if (shouldUnwrapCodeNode(node)) {
        const unwrapped = unwrapCodeNode(node, parseFn);
        if (unwrapped.length > 0) {
          tree.children.splice(i, 1, ...unwrapped);
          i += unwrapped.length - 1;
        }
      }
    }

    // 2. Deduplicate adjacent duplicate headings (e.g. ### Recommended tools repeated)
    deduplicateAdjacentHeadings(tree.children);

    // 3. Walk all text and inlineCode nodes to convert markers into ccaDocCard
    walkNodes(tree.children, (node) => {
      if (
        (node.type !== 'text' && node.type !== 'inlineCode') ||
        typeof node.value !== 'string'
      ) {
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

    // 4. Unwrap list items that only contain ccaDocCard nodes
    unwrapCardLists(tree.children);

    // 5. Unwrap paragraphs that only contain ccaDocCard nodes
    unwrapCardParagraphs(tree.children);

    // 6. Normalize citation paragraphs following lists into list items
    normalizeCitationParagraphsToLists(tree.children);

    // 7. Clean stray unclosed leading asterisks in list items and paragraphs
    cleanStrayLeadingAsterisks(tree);

    return tree;
  };
};
