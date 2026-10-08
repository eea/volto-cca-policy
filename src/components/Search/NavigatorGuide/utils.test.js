import {
  mergeGuideOptions,
  sortAdaptationSteps,
  sortGuideOptions,
} from './utils';

describe('Navigator Guide utilities', () => {
  it('keeps unavailable values and marks them as disabled', () => {
    expect(
      mergeGuideOptions(
        ['Step 1', 'Step 2', 'Step 6'],
        [
          { value: 'Step 1', count: 4 },
          { value: 'Step 2', count: 2 },
        ],
        [],
        true,
      ),
    ).toEqual([
      { value: 'Step 1', count: 4, disabled: false },
      { value: 'Step 2', count: 2, disabled: false },
      { value: 'Step 6', count: 0, disabled: true },
    ]);
  });

  it('keeps a selected zero-count value enabled so it can be removed', () => {
    expect(mergeGuideOptions([], [], ['Step 6'], true)).toEqual([
      { value: 'Step 6', count: 0, disabled: false },
    ]);
  });

  it('keeps every value enabled before the guide has been refined', () => {
    expect(mergeGuideOptions(['Step 1', 'Step 6'], [], [])).toEqual([
      { value: 'Step 1', count: 0, disabled: false },
      { value: 'Step 6', count: 0, disabled: false },
    ]);
  });

  it('falls back to live facet options while the full list is loading', () => {
    expect(mergeGuideOptions([], [{ value: 'Energy', count: 3 }], [])).toEqual([
      { value: 'Energy', count: 3, disabled: false },
    ]);
  });

  it('keeps adaptation steps in numeric order regardless of match counts', () => {
    const options = [
      { value: 'Step 10: Review', count: 9 },
      { value: 'Step 3: Plan', count: 20 },
      { value: 'Step 1: Prepare', count: 1 },
      { value: 'Step 2: Assess', count: 5 },
    ];

    expect(sortAdaptationSteps(options).map(({ value }) => value)).toEqual([
      'Step 1: Prepare',
      'Step 2: Assess',
      'Step 3: Plan',
      'Step 10: Review',
    ]);
    expect(options[0].value).toBe('Step 10: Review');
  });

  it('sorts regular guide options alphabetically without mutating them', () => {
    const options = [
      { value: 'Water', count: 3 },
      { value: 'Agriculture', count: 8 },
      { value: 'Biodiversity', count: 5 },
    ];

    expect(
      sortGuideOptions(options, 'adaptationSectors').map(({ value }) => value),
    ).toEqual(['Agriculture', 'Biodiversity', 'Water']);
    expect(options[0].value).toBe('Water');
  });

  it('uses numeric cycle-step order for the adaptation stage', () => {
    const options = [
      { value: 'Step 10: Review', count: 3 },
      { value: 'Step 2: Assess', count: 8 },
      { value: 'Step 1: Prepare', count: 5 },
    ];

    expect(
      sortGuideOptions(options, 'adaptationStage').map(({ value }) => value),
    ).toEqual(['Step 1: Prepare', 'Step 2: Assess', 'Step 10: Review']);
  });
});
