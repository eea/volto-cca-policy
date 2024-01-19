export function getTodayWithTime() {
  const d = new Date();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const second = d.getSeconds();

  const output = [
    d.getFullYear(),
    '-',
    month < 10 ? '0' : '',
    month,
    '-',
    day < 10 ? '0' : '',
    day,
    'T',
    hour < 10 ? '0' : '',
    hour,
    ':',
    minute < 10 ? '0' : '',
    minute,
    ':',
    second < 10 ? '0' : '',
    second,
    'Z',
  ].join('');
  return output;
}

export function getClientProxyAddress() {
  const url = new URL(window.location);
  url.pathname = '';
  url.search = '';
  return url.toString();
}

export const getSearchThumbUrl = () => (result, config, fallback) => {
  let image = fallback;

  if (
    result.about?.raw?.indexOf('://cca-p6.devel5cph.eionet.europa.eu') !== -1 ||
    result.about?.raw?.indexOf('://cca.devel5cph.eionet.europa.eu') !== -1 ||
    result.about?.raw?.indexOf('://climate-adapt.eea.europa.eu') !== -1
  ) {
    image = result?.about?.raw + '/@@images/preview_image/preview';
  }
  return image;
};
