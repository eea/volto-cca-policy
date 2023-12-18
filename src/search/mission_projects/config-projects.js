import { mergeConfig } from '@eeacms/search';
import { build_runtime_mappings } from '@eeacms/volto-globalsearch/utils';

import facets from './facets-projects';

const getClientProxyAddress = () => {
  const url = new URL(window.location);
  url.pathname = '';
  url.search = '';
  return url.toString();
};

const ccaConfig = {
  title: 'ClimateAdapt Health',
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
    : ccaConfig;

  const pjson = require('@eeacms/volto-cca-policy/../package.json');

  envConfig.app_name = pjson.name;
  envConfig.app_version = pjson.version;

  config.searchui.missionProjects = {
    ...mergeConfig(envConfig, config.searchui.globalsearchbase),
    elastic_index: '_es/globalsearch',
    index_name: 'data_searchui',
    host: process.env.RAZZLE_ES_PROXY_ADDR || 'http://localhost:3000',
    vocab: {
      cluster_name: {
        cca: 'Climate-ADAPT',
      },
    },
    runtime_mappings: build_runtime_mappings(clusters),
  };

  const { missionProjects } = config.searchui;

  missionProjects.permanentFilters.push({
    term: {
      cca_include_in_mission: 'true',
    },
  });

  missionProjects.permanentFilters.push({
    terms: {
      objectProvides: ['Research and knowledge project'],
    },
  });

  missionProjects.facets = facets;

  if (typeof window !== 'undefined') {
    config.searchui.missionProjects.host =
      process.env.RAZZLE_ES_PROXY_ADDR || getClientProxyAddress();
  }

  return config;
}
