import { mergeGuideOptions } from './utils';

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
});
