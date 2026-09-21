import {
  DOC_MARKER_RE,
  cleanStrayLeadingAsterisks,
  deduplicateAdjacentHeadings,
  isCitationText,
  isNextStepsHeading,
  normalizeCitationParagraphsToLists,
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

describe('cleanStrayLeadingAsterisks', () => {
  it('strips unmatched leading ** from paragraphs and list items preceding strong elements', () => {
    const node = {
      type: 'listItem',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: '**Run a rapid, multi-hazard screening with the ',
            },
            {
              type: 'strong',
              children: [
                {
                  type: 'text',
                  value: 'Pathways2Resilience Climate Toolbox',
                },
              ],
            },
            {
              type: 'text',
              value: ' to identify climate threats.',
            },
          ],
        },
      ],
    };

    cleanStrayLeadingAsterisks(node);
    const textNode = node.children[0].children[0];
    expect(textNode.value).toBe(
      'Run a rapid, multi-hazard screening with the ',
    );
  });

  it('leaves paragraphs without leading ** untouched', () => {
    const node = {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          value: 'Normal text without asterisks',
        },
      ],
    };

    cleanStrayLeadingAsterisks(node);
    expect(node.children[0].value).toBe('Normal text without asterisks');
  });
});

describe('isCitationText', () => {
  it('identifies citation markers', () => {
    expect(isCitationText('[2] Pathways2Resilience Climate Toolbox')).toBe(
      true,
    );
    expect(isCitationText('  [15] Multi-digit citation')).toBe(true);
    expect(isCitationText('Normal paragraph text')).toBe(false);
    expect(isCitationText('1. Numbered list item')).toBe(false);
    expect(isCitationText(null)).toBe(false);
  });
});

describe('normalizeCitationParagraphsToLists', () => {
  it('appends newline-separated citation lines following a list as list items', () => {
    const children = [
      {
        type: 'list',
        ordered: false,
        children: [
          {
            type: 'listItem',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    value: 'The Greek Climate Change Adaptation Hub limitation',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value:
              '[2] Pathways2Resilience meta-tool\n[3] NATURE DEMO DST analysis\n[4] Greek Hub resilience audit',
          },
        ],
      },
    ];

    normalizeCitationParagraphsToLists(children);
    // Paragraph should be merged into list
    expect(children).toHaveLength(1);
    const list = children[0];
    expect(list.type).toBe('list');
    expect(list.children).toHaveLength(4);
    expect(list.children[0].children[0].children[0].value).toBe(
      'The Greek Climate Change Adaptation Hub limitation',
    );
    expect(list.children[1].children[0].children[0].value).toBe(
      '[2] Pathways2Resilience meta-tool',
    );
    expect(list.children[2].children[0].children[0].value).toBe(
      '[3] NATURE DEMO DST analysis',
    );
    expect(list.children[3].children[0].children[0].value).toBe(
      '[4] Greek Hub resilience audit',
    );
  });

  it('appends consecutive citation paragraphs to a preceding list', () => {
    const children = [
      {
        type: 'list',
        ordered: false,
        children: [
          {
            type: 'listItem',
            children: [
              {
                type: 'paragraph',
                children: [{ type: 'text', value: 'Initial bullet' }],
              },
            ],
          },
        ],
      },
      {
        type: 'paragraph',
        children: [{ type: 'text', value: '[2] Second item' }],
      },
      {
        type: 'paragraph',
        children: [{ type: 'text', value: '[3] Third item' }],
      },
    ];

    normalizeCitationParagraphsToLists(children);
    expect(children).toHaveLength(1);
    expect(children[0].children).toHaveLength(3);
  });

  it('converts standalone citation paragraphs into a list', () => {
    const children = [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: '[2] Item A\n[3] Item B',
          },
        ],
      },
    ];

    normalizeCitationParagraphsToLists(children);
    expect(children).toHaveLength(1);
    expect(children[0].type).toBe('list');
    expect(children[0].children).toHaveLength(2);
  });

  it('leaves non-citation paragraphs untouched', () => {
    const children = [
      {
        type: 'paragraph',
        children: [{ type: 'text', value: 'Regular paragraph' }],
      },
    ];

    normalizeCitationParagraphsToLists(children);
    expect(children).toHaveLength(1);
    expect(children[0].type).toBe('paragraph');
  });
});

describe('parseMarkdownLines enhancements', () => {
  it('parses [2] marker lines as list items and cleans stray leading asterisks', () => {
    const markdown =
      '1. **Run a screening with the **Pathways2Resilience Toolbox** for risks\n[2] Citation line description';
    const nodes = parseMarkdownLines(markdown);
    expect(nodes).toHaveLength(2);
    expect(nodes[0].type).toBe('list');
    expect(nodes[0].ordered).toBe(true);
    // Unmatched leading ** was cleaned, leaving the properly matched **Toolbox**
    expect(nodes[0].children[0].children[0].children[0].value).toBe(
      'Run a screening with the **Pathways2Resilience Toolbox** for risks',
    );
    expect(nodes[1].type).toBe('list');
    expect(nodes[1].children[0].children[0].children[0].value).toBe(
      'Citation line description',
    );
  });
});
