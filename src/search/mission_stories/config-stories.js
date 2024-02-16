import { mergeConfig } from '@eeacms/search';
import { getClientProxyAddress, getSearchThumbUrl } from './../utils';
import facets from './facets-stories';

const missionStoriesConfig = {
  title: 'Mission stories',
  ...facets,
};

export default function installMissionStoriesSearch(config) {
  const envConfig = process.env.RAZZLE_ENV_CONFIG
    ? JSON.parse(process.env.RAZZLE_ENV_CONFIG)
    : missionStoriesConfig;

  const pjson = require('@eeacms/volto-cca-policy/../package.json');
  envConfig.app_name = pjson.name;
  envConfig.app_version = pjson.version;

  config.searchui.missionStoriesSearch = {
    ...mergeConfig(envConfig, config.searchui.globalsearchbase),
    elastic_index: '_es/missionStoriesSearch',
    index_name: 'ccatest_searchui',
    host: process.env.RAZZLE_ES_PROXY_ADDR || 'http://localhost:3000',
    vocab: {
      cluster_name: {
        cca: 'Mission Portal',
      },
    },
  };

  const { missionStoriesSearch } = config.searchui;

  missionStoriesSearch.facets = facets;

  if (typeof window !== 'undefined') {
    config.searchui.missionStoriesSearch.host =
      process.env.RAZZLE_ES_PROXY_ADDR || getClientProxyAddress();
  }

  missionStoriesSearch.resultItemModel = {
    factory: 'ResultModel',
    urlField: 'about',
    titleField: 'title',
    metatypeField: 'objectProvides',
    descriptionField: 'description',
    tagsField: 'topic',
    issuedField: 'issued',
    getThumbnailUrl: 'getSearchThumbUrl',
    getIconUrl: 'getGlobalsearchIconUrl',
    fallbackThumbUrl:
      'https://react.semantic-ui.com/images/wireframe/white-image.png',
  };

  config.resolve.getSearchThumbUrl = getSearchThumbUrl();

  return config;
}
