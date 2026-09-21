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

export const sortAdaptationSteps = (options) =>
  [...options].sort((a, b) => {
    const aStep = /^Step\s+(\d+)\b/i.exec(a.value);
    const bStep = /^Step\s+(\d+)\b/i.exec(b.value);

    if (aStep && bStep) {
      return (
        Number(aStep[1]) - Number(bStep[1]) || a.value.localeCompare(b.value)
      );
    }
    if (aStep) return -1;
    if (bStep) return 1;
    return a.value.localeCompare(b.value);
  });
