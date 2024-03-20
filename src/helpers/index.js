import config from '@plone/volto/registry';
import { isArray } from 'lodash';
import { serializeNodes } from '@plone/volto-slate/editor/render';
import { OBSERVATORY_PARTNERS } from './Constants';
export {
  HTMLField,
  ExternalLink,
  PublishedModifiedInfo,
  LinksList,
  DocumentsList,
  ReferenceInfo,
  BannerTitle,
  LogoWrapper,
  ContentRelatedItems,
  ItemLogo,
} from './Utils';
export { default as ContentMetadata } from './ContentMetadata';
export {
  ACE_COUNTRIES,
  BIOREGIONS,
  OTHER_REGIONS,
  SUBNATIONAL_REGIONS,
  EU_COUNTRIES,
} from './Constants';
export clientOnly from './clientOnly';

export const createSlateParagraph = (text) => {
  return isArray(text) ? text : config.settings.slate.defaultValue();
};

export const serializeText = (text) => {
  return isArray(text) ? serializeNodes(text) : text;
};

export const makeContributionsSearchQuery = (props) => {
  const { id } = props;
  const organisation = OBSERVATORY_PARTNERS[id];
  const base = '/en/observatory/advanced-search';
  const field = 'cca_partner_contributors.keyword';
  const filter = `filters[0][field]=${field}&filters[0][type]=any&filters[0][values][0]=${organisation}`;
  const rest =
    'filters[1][field]=issued.date' +
    '&filters[1][values][0]=All time' +
    '&filters[1][type]=any' +
    '&filters[2][field]=language' +
    '&filters[2][values][0]=en' +
    '&filters[2][type]=any' +
    '&sort-field=issued.date' +
    '&sort-direction=desc';

  const query = `${base}?size=n_10_n&${filter}&${rest}`;
  const url = query.replaceAll('[', '%5B').replaceAll(']', '%5D');

  return url;
};

export const isObservatoryMetadataURL = (url) => {
  return url.indexOf('/observatory/++aq++metadata') > -1;
};

export const makeObservatoryMetadataURL = (url) => {
  return url.replace('/metadata/', '/observatory/++aq++metadata/');
};
