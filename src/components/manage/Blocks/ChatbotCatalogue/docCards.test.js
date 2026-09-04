import { remarkCcaDocCards } from './docCards';

const applyPlugin = (tree) => remarkCcaDocCards()(tree);

const cards = (tree) =>
  tree.children.filter((n) => n.type === 'ccaDocCard').map((n) => n.value);

const cardHNames = (tree) =>
  tree.children.filter((n) => n.type === 'ccaDocCard').map((n) => n.data.hName);

describe('remarkCcaDocCards', () => {
  it('leaves text without markers untouched', () => {
    const tree = {
      type: 'root',
      children: [{ type: 'text', value: 'No documents here.' }],
    };
    const result = applyPlugin(tree);
    expect(result).toBe(tree);
    expect(cards(result)).toHaveLength(0);
  });

  it('converts a marker on its own line into a cca-doc-card element', () => {
    const tree = {
      type: 'root',
      children: [{ type: 'text', value: '![[doc: France NAS]]' }],
    };
    const result = applyPlugin(tree);
    expect(result.children).toHaveLength(1);
    expect(result.children[0]).toEqual({
      type: 'ccaDocCard',
      value: 'France NAS',
      data: { hName: 'cca-doc-card', hProperties: { title: 'France NAS' } },
    });
    expect(cardHNames(result)).toEqual(['cca-doc-card']);
  });

  it('trims whitespace around the title', () => {
    const tree = {
      type: 'root',
      children: [
        { type: 'text', value: '![[   doc:    Climate Action Plan   ]]' },
      ],
    };
    const result = applyPlugin(tree);
    expect(cards(result)).toEqual(['Climate Action Plan']);
  });

  it('keeps text before and after a mid-sentence marker', () => {
    const tree = {
      type: 'root',
      children: [
        {
          type: 'text',
          value: 'See ![[doc: EU Adaptation Strategy]] for details, and more.',
        },
      ],
    };
    const result = applyPlugin(tree);
    expect(result.children).toHaveLength(3);
    expect(result.children[0]).toEqual({
      type: 'text',
      value: 'See ',
    });
    expect(result.children[1]).toEqual({
      type: 'ccaDocCard',
      value: 'EU Adaptation Strategy',
      data: {
        hName: 'cca-doc-card',
        hProperties: { title: 'EU Adaptation Strategy' },
      },
    });
    expect(result.children[2]).toEqual({
      type: 'text',
      value: ' for details, and more.',
    });
  });

  it('converts several markers in the same text node', () => {
    const tree = {
      type: 'root',
      children: [
        {
          type: 'text',
          value: '![[doc: One]]\n![[doc: Two]]',
        },
      ],
    };
    const result = applyPlugin(tree);
    expect(cards(result)).toEqual(['One', 'Two']);
  });

  it('matches markers with a colon in the title', () => {
    const tree = {
      type: 'root',
      children: [
        { type: 'text', value: '![[doc: Europe 2020: The EU platform]]' },
      ],
    };
    const result = applyPlugin(tree);
    expect(cards(result)).toEqual(['Europe 2020: The EU platform']);
  });

  it('converts markers nested inside list items', () => {
    const tree = {
      type: 'root',
      children: [
        {
          type: 'list',
          children: [
            {
              type: 'listItem',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    { type: 'text', value: 'See ![[doc: France NAS]] too' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
    const result = applyPlugin(tree);
    const paragraph = result.children[0].children[0].children[0];
    expect(paragraph.children).toHaveLength(3);
    expect(paragraph.children[1].type).toBe('ccaDocCard');
    expect(paragraph.children[1].value).toBe('France NAS');
    expect(paragraph.children[2]).toEqual({ type: 'text', value: ' too' });
  });

  it('ignores non-text nodes', () => {
    const tree = {
      type: 'root',
      children: [
        { type: 'html', value: '![[doc: not a text node]]' },
        { type: 'text', value: '![[doc: real]]' },
      ],
    };
    const result = applyPlugin(tree);
    expect(cards(result)).toEqual(['real']);
    expect(result.children[0].value).toBe('![[doc: not a text node]]');
  });
});
