export const fixEmbedURL = (url, is_cmshare_video) => {
  const suffix = '/download';

  if (!is_cmshare_video) return url;

  const base = url.split('?')[0];

  if (base.endsWith(suffix)) return base;

  return base + suffix;
};
