import { getToolThumbnailUrl } from './utils';

describe('getToolThumbnailUrl', () => {
  it.each([null, false])(
    'does not resolve other URLs when image is %s',
    (image) => {
      expect(
        getToolThumbnailUrl({
          image,
          thumbUrl: '/thumb.jpg',
          image_preview: { raw: '/preview.jpg' },
          href: '/tools/tool',
        }),
      ).toBeNull();
    },
  );

  it.each(['thumb', 'tile', 'preview', 'mini'])(
    'prefers the %s scale to the original download',
    (scale) => {
      expect(
        getToolThumbnailUrl({
          image: {
            scales: { [scale]: { download: '/scaled.jpg' } },
            download: '/original.jpg',
          },
          thumbUrl: '/thumb.jpg',
        }),
      ).toBe('/scaled.jpg');
    },
  );

  it('uses the raw image preview before constructing a traversal URL', () => {
    expect(
      getToolThumbnailUrl({
        thumbUrl: '/portal_depiction/tool/image_preview',
        image_preview: { raw: '/preview.jpg' },
        href: '/tools/tool',
      }),
    ).toBe('/preview.jpg');
  });

  it('returns null for empty or invalid results', () => {
    expect(getToolThumbnailUrl(null)).toBeNull();
    expect(getToolThumbnailUrl(undefined)).toBeNull();
    expect(getToolThumbnailUrl({})).toBeNull();
    expect(getToolThumbnailUrl({ image: null })).toBeNull();
    expect(getToolThumbnailUrl({ image: false })).toBeNull();
  });

  it('resolves direct image string URL', () => {
    expect(
      getToolThumbnailUrl({ image: '/metadata/tools/tool/image.png' }),
    ).toBe('/metadata/tools/tool/image.png');
  });

  it('resolves image scales from Dexterity image field', () => {
    expect(
      getToolThumbnailUrl({
        image: {
          scales: {
            thumb: { download: '/image-128.jpeg' },
            tile: { download: '/image-64.jpeg' },
          },
        },
      }),
    ).toBe('/image-128.jpeg');

    expect(
      getToolThumbnailUrl({
        image: {
          scales: {
            tile: { download: '/image-64.jpeg' },
          },
        },
      }),
    ).toBe('/image-64.jpeg');

    expect(
      getToolThumbnailUrl({
        image: {
          download: '/image-original.jpeg',
        },
      }),
    ).toBe('/image-original.jpeg');
  });

  it('resolves thumbUrl when not portal_depiction fallback', () => {
    expect(
      getToolThumbnailUrl({
        thumbUrl: '/custom-thumb.jpg',
      }),
    ).toBe('/custom-thumb.jpg');

    // portal_depiction is ignored, falls back to href scale
    expect(
      getToolThumbnailUrl({
        thumbUrl:
          'https://www.eea.europa.eu/portal_depiction/tool/image_preview',
        href: '/tools/sample-tool',
      }),
    ).toBe('/tools/sample-tool/@@images/image/thumb');
  });

  it('constructs scale traversal URL from href, @id, or about', () => {
    expect(
      getToolThumbnailUrl({
        href: '/tools/sample-tool/',
      }),
    ).toBe('/tools/sample-tool/@@images/image/thumb');

    expect(
      getToolThumbnailUrl({
        '@id': '/tools/sample-tool',
      }),
    ).toBe('/tools/sample-tool/@@images/image/thumb');

    expect(
      getToolThumbnailUrl({
        about: { raw: '/tools/sample-tool' },
      }),
    ).toBe('/tools/sample-tool/@@images/image/thumb');
  });
});
