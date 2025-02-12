import { mergeConfig } from '@eeacms/search';
import { getClientProxyAddress } from '../utils';

import facets from './facets-funding';

const missionFundingSearchConfig = {
  title: 'Mission Funding Search',
  facets,
};

export default function installMissionFundingSearch(config) {
  const envConfig = process.env.RAZZLE_ENV_CONFIG
    ? JSON.parse(process.env.RAZZLE_ENV_CONFIG)
    : missionFundingSearchConfig;

  const pjson = require('@eeacms/volto-cca-policy/../package.json');
  envConfig.app_name = pjson.name;
  envConfig.app_version = pjson.version;

  config.searchui.missionFundingSearch = {
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

  const { missionFundingSearch } = config.searchui;
  missionFundingSearch.permanentFilters.push({
    bool: {
      must_not: [
        {
          term: {
            'seo_noindex.keyword': 'true',
          },
        },
      ],
    },
  });
  missionFundingSearch.facets = facets;

  if (typeof window !== 'undefined') {
    config.searchui.missionFundingSearch.host =
      process.env.RAZZLE_ES_PROXY_ADDR || getClientProxyAddress();
  }

  return config;
}
