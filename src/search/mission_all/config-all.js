import { mergeConfig } from '@eeacms/search';
import { build_runtime_mappings } from '@eeacms/volto-globalsearch/utils';
import { getClientProxyAddress } from '../utils';

import facets from './facets-all';

const missionAllConfig = {
  title: 'Mission All',
};

export const clusters = {
  name: 'op_cluster',
  field: 'objectProvides',
  clusters: [
    // {
    //   name: 'Type1',
    //   icon: { name: 'bullhorn' },
    //   values: ['Video', 'Guidance'],
    //   defaultResultView: 'horizontalCard',
    // },
  ],
};

export default function installMainSearch(config) {
  const envConfig = process.env.RAZZLE_ENV_CONFIG
    ? JSON.parse(process.env.RAZZLE_ENV_CONFIG)
    : missionAllConfig;

  const pjson = require('@eeacms/volto-cca-policy/../package.json');

  envConfig.app_name = pjson.name;
  envConfig.app_version = pjson.version;

  config.searchui.missionAll = {
    ...mergeConfig(envConfig, config.searchui.globalsearchbase),
    elastic_index: '_es/globalsearch',
    index_name: 'data_searchui',
    host: process.env.RAZZLE_ES_PROXY_ADDR || 'http://localhost:3000',
    vocab: {
      cluster_name: {
        cca: 'Mission Portal',
      },
      objectProvides: {
        'Funding oportunity': 'Funding opportunity',
      },
    },
    runtime_mappings: build_runtime_mappings(clusters),
  };

  const { missionAll } = config.searchui;

  missionAll.permanentFilters.push({
    term: {
      cluster_name: 'cca',
    },
  });
  // missionAll.permanentFilters.push({
  //   bool: {
  //     must_not: [
  //       {
  //         prefix: {
  //           'id.keyword': 'https://climate-adapt.eea.europa.eu/en/more-events',
  //         },
  //       },
  //     ],
  //   },
  // });

  missionAll.permanentFilters.push({
    bool: {
      should: [
        {
          term: {
            cca_include_in_mission: 'true',
          },
        },
        {
          prefix: {
            'id.keyword': 'https://climate-adapt.eea.europa.eu/en/mission',
          },
        },
      ],
      minimum_should_match: 1,
    },
  });

  missionAll.facets = facets;

  if (typeof window !== 'undefined') {
    config.searchui.missionAll.host =
      process.env.RAZZLE_ES_PROXY_ADDR || getClientProxyAddress();
  }

  return config;
}
