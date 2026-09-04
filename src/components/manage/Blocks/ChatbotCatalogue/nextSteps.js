/**
 * Remark plugin: transforms "Suggested next steps" (or "How to use them")
 * headings and their following lists/content into a custom
 * `cca-suggested-next-steps` container element.
 *
 * react-markdown maps the custom element (via `data.hName`) to a component
 * supplied by the caller through `extraMarkdownComponents`
 * (see CatalogueChatView and MessageTextRenderer).
 */

export const NEXT_STEPS_HEADING_RE =
  /^(suggested\s+next\s+steps|next\s+steps|how\s+to\s+use(\s+(them|these|this|the\s+tools))?)\b/i;

export function getNodeText(node) {
  if (!node) return '';
  if (typeof node.value === 'string') return node.value;
  if (Array.isArray(node.children)) {
    return node.children.map(getNodeText).join('');
  }
  return '';
}

export function isNextStepsHeading(node) {
  if (!node || node.type !== 'heading') return false;
  const text = getNodeText(node).trim();
  return NEXT_STEPS_HEADING_RE.test(text);
}

function transformContainer(children) {
  for (let i = 0; i < children.length; i += 1) {
    const node = children[i];
    if (isNextStepsHeading(node)) {
      const rawTitle = getNodeText(node).trim().replace(/:$/, '').trim();
      const title = rawTitle || 'Suggested next steps';

      const collected = [];
      let j = i + 1;
      while (j < children.length) {
        const sibling = children[j];
        if (
          sibling.type === 'heading' ||
          sibling.type === 'thematicBreak' ||
          sibling.type === 'ccaDocCard'
        ) {
          break;
        }
        collected.push(sibling);
        j += 1;
      }

      const containerNode = {
        type: 'ccaNextSteps',
        data: {
          hName: 'cca-suggested-next-steps',
          hProperties: {
            title,
          },
        },
        children: collected,
      };

      // Replace heading and all collected siblings with the container node
      children.splice(i, 1 + collected.length, containerNode);
    } else if (
      node.children &&
      Array.isArray(node.children) &&
      node.type !== 'ccaNextSteps'
    ) {
      transformContainer(node.children);
    }
  }
}

export const remarkCcaNextSteps = () => (tree) => {
  if (tree && Array.isArray(tree.children)) {
    transformContainer(tree.children);
  }
  return tree;
};
