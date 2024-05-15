import { mergeConfig } from '@eeacms/search';
import { getClientProxyAddress } from '../utils';

import facets from './facets-tools';

const missionToolsConfig = {
  title: 'Mission Tools Search',
  ...facets,
};

export default function installMissionToolsSearch(config) {
  const envConfig = process.env.RAZZLE_ENV_CONFIG
    ? JSON.parse(process.env.RAZZLE_ENV_CONFIG)
    : missionToolsConfig;

  const pjson = require('@eeacms/volto-cca-policy/../package.json');
  envConfig.app_name = pjson.name;
  envConfig.app_version = pjson.version;

  config.searchui.missionToolsSearch = {
    ...mergeConfig(envConfig, config.searchui.globalsearchbase),
    elastic_index: '_es/globalsearch',
    index_name: 'data_searchui',
    host: process.env.RAZZLE_ES_PROXY_ADDR || 'http://localhost:3000',
    vocab: {
      cluster_name: {
        cca: 'Mission Portal',
      },
    },
  };

  const { missionToolsSearch } = config.searchui;

  missionToolsSearch.facets = facets;

  if (typeof window !== 'undefined') {
    config.searchui.missionToolsSearch.host =
      process.env.RAZZLE_ES_PROXY_ADDR || getClientProxyAddress();
  }

  return config;
}
