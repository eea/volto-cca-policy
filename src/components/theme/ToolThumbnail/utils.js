import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';

export function getToolThumbnailUrl(result) {
  if (!result) return null;

  if (result.image === null || result.image === false) {
    return null;
  }

  if (typeof result.image === 'string' && result.image) {
    return flattenToAppURL(result.image);
  }
  if (result.image && typeof result.image === 'object') {
    const scaleUrl =
      result.image.scales?.thumb?.download ||
      result.image.scales?.tile?.download ||
      result.image.scales?.preview?.download ||
      result.image.scales?.mini?.download ||
      result.image.download;
    if (scaleUrl) {
      return flattenToAppURL(scaleUrl);
    }
  }

  if (
    typeof result.thumbUrl === 'string' &&
    result.thumbUrl &&
    !result.thumbUrl.includes('portal_depiction')
  ) {
    return flattenToAppURL(result.thumbUrl);
  }

  if (
    result.image_preview &&
    typeof result.image_preview.raw === 'string' &&
    result.image_preview.raw
  ) {
    return flattenToAppURL(result.image_preview.raw);
  }

  const href =
    result.href || result['@id'] || result.about?.raw || result.about;
  if (href && typeof href === 'string') {
    const cleanHref = flattenToAppURL(href).replace(/\/+$/, '');
    return `${cleanHref}/@@images/image/thumb`;
  }

  return null;
}
