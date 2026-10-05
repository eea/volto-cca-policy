import { renderHook, waitFor } from '@testing-library/react';
import superagent from 'superagent';
import { useCountriesMetadata } from './hooks';

jest.mock('superagent', () => ({ get: jest.fn() }));

describe('useCountriesMetadata', () => {
  it('loads and parses the metadata response', async () => {
    const request = {
      set: jest
        .fn()
        .mockResolvedValue({ text: '[{"France":{"flag":"fr.svg"}}]' }),
    };
    superagent.get.mockReturnValue(request);

    const { result } = renderHook(() => useCountriesMetadata('/metadata'));

    await waitFor(() =>
      expect(result.current).toEqual([{ France: { flag: 'fr.svg' } }]),
    );
    expect(superagent.get).toHaveBeenCalledWith('/metadata');
    expect(request.set).toHaveBeenCalledWith('accept', 'json');
  });
});
