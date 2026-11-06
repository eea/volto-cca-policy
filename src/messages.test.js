import {
  formatToolVocabularyValue,
  formatClimateImpact,
  toolVocabularyMessages,
} from './messages';

describe('tool vocabulary messages', () => {
  it('defines all requested vocabulary labels', () => {
    expect(Object.values(toolVocabularyMessages)).toHaveLength(35);
  });

  it('formats known values and preserves unknown values', () => {
    const intl = {
      formatMessage: jest.fn(({ id }) => `translated: ${id}`),
    };

    expect(formatToolVocabularyValue(intl, 'Coastal areas')).toBe(
      'translated: Coastal areas',
    );
    expect(
      formatToolVocabularyValue(
        intl,
        'Step 1: Preparing the Ground for Adaptation',
      ),
    ).toBe('translated: Step 1: Preparing the Ground for Adaptation');
    expect(formatClimateImpact(intl, 'Heat')).toBe('translated: Heat');
    expect(formatClimateImpact(intl, 'Other value')).toBe('Other value');
    expect(formatToolVocabularyValue(intl, 'Other value')).toBe('Other value');
    expect(intl.formatMessage).toHaveBeenCalledTimes(3);
  });
});
