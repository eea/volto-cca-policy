import { getTodayWithTime } from './utils';
import '@testing-library/jest-dom/extend-expect';

describe('getTodayWithTime', () => {
  it('should return the current date in UTC format', () => {
    const output = getTodayWithTime();

    expect(typeof output).toBe('string');
    expect(output).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  });
});
