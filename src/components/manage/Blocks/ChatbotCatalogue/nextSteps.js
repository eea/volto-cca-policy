/**
 * Remark plugin: transforms "Suggested next steps" (or "How to use them")
 * headings and their following lists/content into a custom
 * `cca-suggested-next-steps` container element.
 *
 * react-markdown maps the custom element (via `data.hName`) to a component
 * supplied by the caller through `extraMarkdownComponents`
 * (see CatalogueChatView and MessageTextRenderer).
 */

import {
  NEXT_STEPS_HEADING_RE,
  cleanStrayLeadingAsterisks,
  getNodeText,
  isNextStepsHeading,
  parseMarkdownLines,
} from './astUtils';

export { NEXT_STEPS_HEADING_RE, getNodeText, isNextStepsHeading };

function transformContainer(children) {
  for (let i = 0; i < children.length; i += 1) {
    const node = children[i];
    if (isNextStepsHeading(node)) {
      const rawTitle = getNodeText(node)
        .trim()
        .replace(/^[:\s#*]+|[:\s*]+$/g, '')
        .trim();
      const title = rawTitle || 'Suggested next steps';

      const collected = [];
      let j = i + 1;
      while (j < children.length) {
        const sibling = children[j];
        if (
          sibling.type === 'heading' ||
          sibling.type === 'thematicBreak' ||
          sibling.type === 'ccaDocCard' ||
          (sibling.type !== 'code' && isNextStepsHeading(sibling))
        ) {
          break;
        }
        if (sibling.type === 'code') {
          // If sibling is an accidental code block, unwrap its lines into mdast nodes
          const unwrapped = parseMarkdownLines(sibling.value);
          const filtered = unwrapped.filter((n) => !isNextStepsHeading(n));
          collected.push(...filtered);
        } else {
          collected.push(sibling);
        }
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

      // Clean unclosed leading asterisks on list items inside container
      cleanStrayLeadingAsterisks(containerNode);

      // Replace heading and all collected siblings with the container node
      children.splice(i, 1 + (j - (i + 1)), containerNode);
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
