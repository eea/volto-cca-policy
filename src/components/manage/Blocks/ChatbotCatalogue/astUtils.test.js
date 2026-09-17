import {
  DOC_MARKER_RE,
  deduplicateAdjacentHeadings,
  isNextStepsHeading,
  parseMarkdownLines,
  shouldUnwrapCodeNode,
  unwrapCardLists,
} from './astUtils';

describe('DOC_MARKER_RE', () => {
  it('matches various marker syntaxes and keywords', () => {
    const testCases = [
      ['![[doc: Nature DEMO]]', 'Nature DEMO'],
      ['![[document: Nature DEMO]]', 'Nature DEMO'],
      ['![[tool: Nature DEMO]]', 'Nature DEMO'],
      ['![[tools: Nature DEMO]]', 'Nature DEMO'],
      ['[[doc: Nature DEMO]]', 'Nature DEMO'],
      ['![doc: Nature DEMO]', 'Nature DEMO'],
      ['![tool: Nature DEMO]', 'Nature DEMO'],
      ['![[doc - Nature DEMO]]', 'Nature DEMO'],
      ['![[doc:   Spaced Title   ]]', 'Spaced Title'],
    ];

    for (const [input, expected] of testCases) {
      DOC_MARKER_RE.lastIndex = 0;
      const match = DOC_MARKER_RE.exec(input);
      expect(match).not.toBeNull();
      expect(match[1].trim()).toBe(expected);
    }
  });
});

describe('NEXT_STEPS_HEADING_RE and isNextStepsHeading', () => {
  it('matches headings with varied phrasing, colons, and formatting', () => {
    const makeHeading = (text) => ({
      type: 'heading',
      depth: 3,
      children: [{ type: 'text', value: text }],
    });

    expect(isNextStepsHeading(makeHeading('Suggested next steps'))).toBe(true);
    expect(isNextStepsHeading(makeHeading('Suggested next steps:'))).toBe(true);
    expect(isNextStepsHeading(makeHeading('Next steps'))).toBe(true);
    expect(isNextStepsHeading(makeHeading('Recommended next steps'))).toBe(
      true,
    );
    expect(isNextStepsHeading(makeHeading('Recommended workflow'))).toBe(true);
    expect(isNextStepsHeading(makeHeading('Action plan'))).toBe(true);
    expect(isNextStepsHeading(makeHeading('How to use them'))).toBe(true);
    expect(isNextStepsHeading(makeHeading('How to apply these tools'))).toBe(
      true,
    );
    expect(isNextStepsHeading(makeHeading('Step-by-step guidance'))).toBe(true);
    expect(isNextStepsHeading(makeHeading('Overview'))).toBe(false);
  });

  it('matches bold paragraph headings', () => {
    const makeBoldParagraph = (text) => ({
      type: 'paragraph',
      children: [
        {
          type: 'strong',
          children: [{ type: 'text', value: text }],
        },
      ],
    });

    expect(isNextStepsHeading(makeBoldParagraph('Suggested next steps:'))).toBe(
      true,
    );
    expect(isNextStepsHeading(makeBoldParagraph('Action plan'))).toBe(true);
    expect(isNextStepsHeading(makeBoldParagraph('Overview'))).toBe(false);
  });
});

describe('shouldUnwrapCodeNode', () => {
  it('returns true for code nodes containing doc markers', () => {
    const node = {
      type: 'code',
      value: '### Recommended tools\n![[doc: Urban AST]]',
    };
    expect(shouldUnwrapCodeNode(node)).toBe(true);
  });

  it('returns true for code nodes containing next steps or recommended tools headings', () => {
    const node1 = {
      type: 'code',
      value: '### Suggested next steps\n1. Run hazard screening',
    };
    expect(shouldUnwrapCodeNode(node1)).toBe(true);

    const node2 = {
      type: 'code',
      value: '### Recommended tools\nSome text',
    };
    expect(shouldUnwrapCodeNode(node2)).toBe(true);
  });

  it('returns false for actual programming code', () => {
    const node = {
      type: 'code',
      lang: 'python',
      value: 'def calculate_emissions(val):\n    return val * 1.5',
    };
    expect(shouldUnwrapCodeNode(node)).toBe(false);
  });
});

describe('parseMarkdownLines', () => {
  it('parses headings, lists, and paragraphs from raw text', () => {
    const text = `### Recommended tools
![[doc: Compendium]]
![[doc: OPPLA]]

### Suggested next steps
1. First step
2. Second step`;

    const nodes = parseMarkdownLines(text);
    expect(nodes).toHaveLength(4);

    expect(nodes[0]).toEqual({
      type: 'heading',
      depth: 3,
      children: [{ type: 'text', value: 'Recommended tools' }],
    });

    expect(nodes[1].type).toBe('paragraph');
    expect(nodes[1].children[0].value).toContain('![[doc: Compendium]]');

    expect(nodes[2]).toEqual({
      type: 'heading',
      depth: 3,
      children: [{ type: 'text', value: 'Suggested next steps' }],
    });

    expect(nodes[3].type).toBe('list');
    expect(nodes[3].ordered).toBe(true);
    expect(nodes[3].children).toHaveLength(2);
    expect(nodes[3].children[0].children[0].children[0].value).toBe(
      'First step',
    );
  });
});

describe('deduplicateAdjacentHeadings', () => {
  it('removes immediately adjacent duplicate headings', () => {
    const children = [
      {
        type: 'heading',
        depth: 3,
        children: [{ type: 'text', value: 'Recommended tools' }],
      },
      {
        type: 'heading',
        depth: 3,
        children: [{ type: 'text', value: 'Recommended tools' }],
      },
      {
        type: 'paragraph',
        children: [{ type: 'text', value: 'Content' }],
      },
    ];

    deduplicateAdjacentHeadings(children);
    expect(children).toHaveLength(2);
    expect(children[0].type).toBe('heading');
    expect(children[1].type).toBe('paragraph');
  });
});

describe('unwrapCardLists', () => {
  it('unwraps list items that only contain ccaDocCard nodes into standalone cards', () => {
    const children = [
      {
        type: 'list',
        children: [
          {
            type: 'listItem',
            children: [
              {
                type: 'ccaDocCard',
                value: 'Tool 1',
              },
            ],
          },
          {
            type: 'listItem',
            children: [
              {
                type: 'ccaDocCard',
                value: 'Tool 2',
              },
            ],
          },
        ],
      },
    ];

    unwrapCardLists(children);
    expect(children).toHaveLength(2);
    expect(children[0].type).toBe('ccaDocCard');
    expect(children[0].value).toBe('Tool 1');
    expect(children[1].type).toBe('ccaDocCard');
    expect(children[1].value).toBe('Tool 2');
  });
});
