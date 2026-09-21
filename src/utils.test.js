import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import {
  blockAvailableInMission,
  extractPlanNameAndURL,
  filterBlocks,
  formatTextToHTML,
  getBaseUrl,
  getFilteredBlocks,
  hasTypeOfBlock,
  isEmpty,
  normalizeImageFileName,
} from './utils';

jest.mock('@plone/volto/helpers/Url/Url', () => ({
  flattenToAppURL: jest.fn((url) => url.replace('https://example.com', '')),
}));

describe('general utilities', () => {
  it('checks whether blocks are available inside and outside Mission', () => {
    expect(blockAvailableInMission({}, { id: 'text' })).toBe(false);
    expect(
      blockAvailableInMission(
        { '@id': 'https://example.com/en/mission/page' },
        { id: 'mkh_map' },
      ),
    ).toBe(false);
    expect(
      blockAvailableInMission(
        { '@id': 'https://example.com/en/mission/page' },
        { id: 'text' },
      ),
    ).toBe(true);
    expect(
      blockAvailableInMission(
        { '@id': 'https://example.com/en/page' },
        { id: 'rastBlock' },
      ),
    ).toBe(true);
  });

  it('resolves a block base URL from the supported properties', () => {
    expect(
      getBaseUrl({ data: { href: [{ '@id': 'https://example.com/page' }] } }),
    ).toBe('/page');
    expect(getBaseUrl({ path: '/from-path' })).toBe('/from-path');
    expect(getBaseUrl({ location: { pathname: '/from-location' } })).toBe(
      '/from-location',
    );
    expect(getBaseUrl({})).toBe('');
    expect(flattenToAppURL).toHaveBeenCalledTimes(3);
  });

  it('finds nested block types and removes selected block types', () => {
    expect(
      hasTypeOfBlock({ blocks: { child: { '@type': 'listing' } } }, 'listing'),
    ).toBe(true);
    expect(hasTypeOfBlock({ child: null }, 'listing')).toBe(false);

    expect(
      filterBlocks(
        {
          blocks: {
            one: { '@type': 'text' },
            two: { '@type': 'listing' },
          },
          blocks_layout: { items: ['one', 'two'] },
        },
        ['listing'],
      ),
    ).toEqual({
      blocks: { one: { '@type': 'text' } },
      blocks_layout: { items: ['one'] },
      hasBlockTypes: true,
    });
  });

  it('formats escaped text, paragraphs, bullets, and links as HTML', () => {
    expect(formatTextToHTML()).toBe('');
    expect(formatTextToHTML('Simple text')).toBe('<p>Simple text</p>');
    expect(formatTextToHTML('First\\n\\nSecond')).toBe('First</p><p>Second');
    expect(formatTextToHTML('Item\\no next')).toBe('<p>Item<br />• next</p>');
    expect(formatTextToHTML('See https://example.com')).toContain(
      '<a href="https://example.com"',
    );
  });

  it('keeps only parent blocks without the excluded nested type', () => {
    const result = getFilteredBlocks(
      {
        blocks: {
          keep: { '@type': 'group', blocks: { child: { '@type': 'text' } } },
          exclude: {
            '@type': 'group',
            data: { blocks: { child: { '@type': 'map' } } },
          },
          other: { '@type': 'text' },
        },
        blocks_layout: { items: ['keep', 'exclude', 'other'] },
      },
      'group',
      'map',
    );

    expect(result.keptKeys).toEqual(['keep']);
    expect(result.blocks_layout.items).toEqual(['keep']);
    expect(result.hasMatches).toBe(true);
  });

  it('extracts plan links and normalizes common values', () => {
    expect(extractPlanNameAndURL()).toEqual({ name: '', url: '' });
    expect(
      extractPlanNameAndURL('Adaptation plan (https://example.com/plan)'),
    ).toEqual({ name: 'Adaptation plan', url: 'https://example.com/plan' });
    expect(
      extractPlanNameAndURL(
        'Plan https://example.com/source https://example.com/document',
      ),
    ).toEqual({ name: 'Plan', url: 'https://example.com/document' });

    expect(isEmpty()).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty(['value'])).toBe(false);
    expect(normalizeImageFileName()).toBe('');
    expect(normalizeImageFileName('map(final).png')).toBe('map-final.png');
    expect(normalizeImageFileName('map(final)')).toBe('map-final-');
  });
});
