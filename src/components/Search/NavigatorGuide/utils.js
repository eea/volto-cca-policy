export const mergeGuideOptions = (
  availableValues = [],
  facetOptions = [],
  selectedValues = [],
  hasGuideSelections = false,
) => {
  const optionsByValue = new Map(
    facetOptions.map(({ value, count }) => [value, { value, count }]),
  );

  availableValues.forEach((value) => {
    if (!optionsByValue.has(value)) {
      optionsByValue.set(value, { value, count: 0 });
    }
  });

  selectedValues.forEach((value) => {
    if (!optionsByValue.has(value)) {
      optionsByValue.set(value, { value, count: 0 });
    }
  });

  return Array.from(optionsByValue.values()).map((option) => ({
    ...option,
    disabled:
      hasGuideSelections &&
      option.count === 0 &&
      !selectedValues.includes(option.value),
  }));
};

export const sortGuideOptions = (options, locale = 'en') =>
  [...options].sort((a, b) =>
    (a.label || a.value).localeCompare(b.label || b.value, locale, {
      sensitivity: 'base',
    }),
  );
