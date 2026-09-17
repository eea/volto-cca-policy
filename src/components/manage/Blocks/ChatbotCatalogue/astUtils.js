/**
 * AST utilities for parsing and transforming Markdown AST (mdast)
 * in the CCA Chatbot Catalogue variation.
 */

export const DOC_MARKER_RE =
  /!?\[\[?\s*(?:doc|document|tool|tools)\s*[:-]\s*([^\]\r\n]+)\]?\]/gi;

export const NEXT_STEPS_HEADING_RE =
  /^(suggested\s+next\s+steps|next\s+steps|recommended\s+next\s+steps|recommended\s+workflow|suggested\s+workflow|action\s+plan|how\s+to\s+use(\s+(them|these|this|the\s+tools))?|how\s+to\s+apply(\s+(them|these|this|the\s+tools))?|how\s+to\s+get\s+started|step-by-step\s+guidance)\b/i;

export function getNodeText(node) {
  if (!node) return '';
  if (typeof node.value === 'string') return node.value;
  if (Array.isArray(node.children)) {
    return node.children.map(getNodeText).join('');
  }
  return '';
}

export function isNextStepsHeading(node) {
  if (!node) return false;
  if (node.type === 'heading') {
    const text = getNodeText(node)
      .trim()
      .replace(/[:\s]+$/g, '');
    return NEXT_STEPS_HEADING_RE.test(text);
  }
  // Support bold paragraph headings, e.g. `**Suggested next steps:**`
  if (
    node.type === 'paragraph' &&
    Array.isArray(node.children) &&
    node.children.length === 1 &&
    node.children[0].type === 'strong'
  ) {
    const text = getNodeText(node.children[0])
      .trim()
      .replace(/[:\s]+$/g, '');
    return NEXT_STEPS_HEADING_RE.test(text);
  }
  return false;
}

export function unwrapCardParagraphs(children) {
  for (let i = 0; i < children.length; i += 1) {
    const node = children[i];
    if (node.type === 'paragraph' && Array.isArray(node.children)) {
      const allCards =
        node.children.length > 0 &&
        node.children.every(
          (c) =>
            c.type === 'ccaDocCard' || (c.type === 'text' && !c.value.trim()),
        );
      if (allCards) {
        const cards = node.children.filter((c) => c.type === 'ccaDocCard');
        children.splice(i, 1, ...cards);
        i += cards.length - 1;
      }
    }
  }
}

export function shouldUnwrapCodeNode(node) {
  if (!node || node.type !== 'code' || typeof node.value !== 'string') {
    return false;
  }
  const val = node.value;
  DOC_MARKER_RE.lastIndex = 0;
  if (DOC_MARKER_RE.test(val)) {
    return true;
  }
  if (
    /(?:recommended\s+tools|suggested\s+next\s+steps|next\s+steps|how\s+to\s+use|action\s+plan)/i.test(
      val,
    )
  ) {
    return true;
  }
  const lang = (node.lang || '').toLowerCase();
  if (
    (lang === 'markdown' || lang === 'md' || lang === 'text' || !lang) &&
    /^(?:#{1,6}\s+|(?:\d+\.|[*+-])\s+)/m.test(val)
  ) {
    return true;
  }
  return false;
}

export function parseMarkdownLines(content) {
  if (!content || typeof content !== 'string') return [];
  const lines = content.split(/\r?\n/);
  const nodes = [];
  let currentList = null;
  let currentParagraphLines = [];

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      const text = currentParagraphLines.join('\n').trim();
      if (text) {
        nodes.push({
          type: 'paragraph',
          children: [{ type: 'text', value: text }],
        });
      }
      currentParagraphLines = [];
    }
  };

  const flushList = () => {
    if (currentList) {
      nodes.push(currentList);
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i += 1) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    // Heading: #, ##, ###, etc.
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      nodes.push({
        type: 'heading',
        depth: headingMatch[1].length,
        children: [{ type: 'text', value: headingMatch[2].trim() }],
      });
      continue;
    }

    // List item: 1. Item or * Item or - Item
    const listMatch = trimmed.match(/^(\d+\.|[*+-])\s+(.*)$/);
    if (listMatch) {
      flushParagraph();
      const isOrdered = /^\d+\./.test(listMatch[1]);
      const itemText = listMatch[2].trim();

      const listItemNode = {
        type: 'listItem',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', value: itemText }],
          },
        ],
      };

      if (currentList && currentList.ordered === isOrdered) {
        currentList.children.push(listItemNode);
      } else {
        flushList();
        currentList = {
          type: 'list',
          ordered: isOrdered,
          children: [listItemNode],
        };
      }
      continue;
    }

    // Continuing an existing list item with an indented line
    if (currentList && /^\s{2,}/.test(rawLine)) {
      const lastItem = currentList.children[currentList.children.length - 1];
      if (
        lastItem &&
        lastItem.children[0] &&
        lastItem.children[0].children[0]
      ) {
        lastItem.children[0].children[0].value += ` ${trimmed}`;
        continue;
      }
    }

    flushList();
    currentParagraphLines.push(trimmed);
  }

  flushParagraph();
  flushList();
  return nodes;
}

export function deduplicateAdjacentHeadings(children) {
  for (let i = children.length - 1; i > 0; i -= 1) {
    const curr = children[i];
    const prev = children[i - 1];
    if (curr?.type === 'heading' && prev?.type === 'heading') {
      const currText = getNodeText(curr).trim().toLowerCase();
      const prevText = getNodeText(prev).trim().toLowerCase();
      if (currText && currText === prevText) {
        children.splice(i, 1);
      }
    }
  }
}

export function unwrapCardLists(children) {
  for (let i = 0; i < children.length; i += 1) {
    const node = children[i];
    if (node.type === 'list' && Array.isArray(node.children)) {
      const allItemsAreCards =
        node.children.length > 0 &&
        node.children.every((item) => {
          if (item.type !== 'listItem' || !Array.isArray(item.children)) {
            return false;
          }
          return item.children.every((child) => {
            if (child.type === 'ccaDocCard') return true;
            if (child.type === 'paragraph' && Array.isArray(child.children)) {
              return child.children.every(
                (c) =>
                  c.type === 'ccaDocCard' ||
                  (c.type === 'text' && !c.value.trim()),
              );
            }
            return false;
          });
        });

      if (allItemsAreCards) {
        const extractedCards = [];
        node.children.forEach((item) => {
          item.children.forEach((child) => {
            if (child.type === 'ccaDocCard') {
              extractedCards.push(child);
            } else if (
              child.type === 'paragraph' &&
              Array.isArray(child.children)
            ) {
              child.children.forEach((c) => {
                if (c.type === 'ccaDocCard') extractedCards.push(c);
              });
            }
          });
        });
        children.splice(i, 1, ...extractedCards);
        i += extractedCards.length - 1;
      }
    }
  }
}
