import { mergeConfig } from '@eeacms/search';

import facets from './facets-stories';

const getClientProxyAddress = () => {
  const url = new URL(window.location);
  url.pathname = '';
  url.search = '';
  return url.toString();
};

const missionStoriesConfig = {
  title: 'Mission stories',
  ...facets,
  //   ...views,
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
  };

  const { missionStoriesSearch } = config.searchui;

  missionStoriesSearch.permanentFilters.push({
    terms: {
      objectProvides: ['mission_storyy'],
    },
  });

  missionStoriesSearch.facets = facets;

  if (typeof window !== 'undefined') {
    config.searchui.missionStoriesSearch.host =
      process.env.RAZZLE_ES_PROXY_ADDR || getClientProxyAddress();
  }

  return config;
}
