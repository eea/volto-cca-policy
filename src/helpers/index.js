export { default as clientOnly } from './clientOnly';

export const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
export {
  addFilterParams,
  makeAdvancedSearchQuery,
  makeContributionsSearchQuery,
} from './search';

export const fixEmbedURL = (url, is_cmshare_video) => {
  const suffix = '/download';

  if (!is_cmshare_video) return url;

  const base = url.split('?')[0];

  if (base.endsWith(suffix)) return base;

  return base + suffix;
};

export * from './countryMap';
