import {
  remarkCcaNextSteps,
  isNextStepsHeading,
  getNodeText,
} from './nextSteps';

const applyPlugin = (tree) => remarkCcaNextSteps()(tree);

describe('nextSteps utilities', () => {
  it('extracts nested text recursively', () => {
    const node = {
      type: 'heading',
      children: [
        { type: 'text', value: 'Suggested ' },
        {
          type: 'strong',
          children: [{ type: 'text', value: 'next steps' }],
        },
      ],
    };
    expect(getNodeText(node)).toBe('Suggested next steps');
  });

  it('recognises next steps heading patterns', () => {
    const makeHeading = (text) => ({
      type: 'heading',
      depth: 3,
      children: [{ type: 'text', value: text }],
    });

    expect(isNextStepsHeading(makeHeading('Suggested next steps'))).toBe(true);
    expect(isNextStepsHeading(makeHeading('Suggested next steps:'))).toBe(true);
    expect(isNextStepsHeading(makeHeading('### Suggested Next Steps'))).toBe(
      false, // mdast value does not have ### prefixes
    );
    expect(isNextStepsHeading(makeHeading('Next steps'))).toBe(true);
    expect(isNextStepsHeading(makeHeading('How to use them'))).toBe(true);
    expect(isNextStepsHeading(makeHeading('How to use these tools'))).toBe(
      true,
    );
    expect(isNextStepsHeading(makeHeading('Overview'))).toBe(false);
    expect(isNextStepsHeading(makeHeading('Documents consulted'))).toBe(false);
  });
});

describe('remarkCcaNextSteps plugin', () => {
  it('leaves trees without matching headings untouched', () => {
    const tree = {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'Regular paragraph' }],
        },
      ],
    };
    const result = applyPlugin(tree);
    expect(result).toBe(tree);
    expect(result.children).toHaveLength(1);
    expect(result.children[0].type).toBe('paragraph');
  });

  it('transforms heading and following ordered list into ccaNextSteps container', () => {
    const tree = {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'Here is an introduction.' }],
        },
        {
          type: 'heading',
          depth: 3,
          children: [{ type: 'text', value: 'Suggested next steps' }],
        },
        {
          type: 'list',
          ordered: true,
          children: [
            {
              type: 'listItem',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    { type: 'text', value: 'Run a hazard screening.' },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          depth: 2,
          children: [{ type: 'text', value: 'Limitations' }],
        },
      ],
    };

    const result = applyPlugin(tree);
    expect(result.children).toHaveLength(3);
    expect(result.children[0].type).toBe('paragraph');

    const nextStepsNode = result.children[1];
    expect(nextStepsNode.type).toBe('ccaNextSteps');
    expect(nextStepsNode.data).toEqual({
      hName: 'cca-suggested-next-steps',
      hProperties: { title: 'Suggested next steps' },
    });
    expect(nextStepsNode.children).toHaveLength(1);
    expect(nextStepsNode.children[0].type).toBe('list');

    expect(result.children[2].type).toBe('heading');
    expect(getNodeText(result.children[2])).toBe('Limitations');
  });

  it('stops collecting siblings at thematicBreak or ccaDocCard', () => {
    const tree = {
      type: 'root',
      children: [
        {
          type: 'heading',
          depth: 2,
          children: [{ type: 'text', value: 'How to use them:' }],
        },
        {
          type: 'list',
          ordered: true,
          children: [],
        },
        {
          type: 'thematicBreak',
        },
        {
          type: 'ccaDocCard',
          value: 'Some Card',
        },
      ],
    };

    const result = applyPlugin(tree);
    expect(result.children).toHaveLength(3);
    expect(result.children[0].type).toBe('ccaNextSteps');
    expect(result.children[0].data.hProperties.title).toBe('How to use them');
    expect(result.children[0].children).toHaveLength(1); // list only
    expect(result.children[1].type).toBe('thematicBreak');
    expect(result.children[2].type).toBe('ccaDocCard');
  });

  it('handles heading with no following siblings gracefully', () => {
    const tree = {
      type: 'root',
      children: [
        {
          type: 'heading',
          depth: 3,
          children: [{ type: 'text', value: 'Suggested next steps' }],
        },
      ],
    };

    const result = applyPlugin(tree);
    expect(result.children).toHaveLength(1);
    expect(result.children[0].type).toBe('ccaNextSteps');
    expect(result.children[0].children).toHaveLength(0);
  });
});
