import { mergeConfig } from '@eeacms/search';
import { build_runtime_mappings } from '@eeacms/volto-globalsearch/utils';
import { getClientProxyAddress } from './../utils';
import { vocab } from './../vocabulary';

import facets from './facets';
import views from './views';

const navigatorCatalogueConfig = {
  title: 'Navigator Catalogue',
  landingPageURL: '/en/navigator',
  ...views,
};

export const clusters = {
  name: 'op_cluster',
  field: 'objectProvides',
  clusters: [
    {
      name: 'Tools',
      icon: { name: 'wrench' },
      values: ['Tool'],
    },
  ].map((cluster) => ({
    ...cluster,
    defaultResultView: 'horizontalCard',
  })),
};

export default function installNavigatorCatalogueSearch(config) {
  const envConfig = {
    ...navigatorCatalogueConfig,
    ...(process.env.RAZZLE_ENV_CONFIG
      ? JSON.parse(process.env.RAZZLE_ENV_CONFIG)
      : {}),
  };

  const pjson = require('@eeacms/volto-cca-policy/../package.json');

  envConfig.app_name = pjson.name;
  envConfig.app_version = pjson.version;

  config.searchui.navigatorCatalogueSearch = {
    ...mergeConfig(envConfig, config.searchui.globalsearchbase),
    elastic_index: '_es/globalsearch',
    index_name: 'data_searchui',
    host: process.env.RAZZLE_ES_PROXY_ADDR || 'http://localhost:3000',
    vocab,
    runtime_mappings: build_runtime_mappings(clusters),
  };

  const { navigatorCatalogueSearch } = config.searchui;

  navigatorCatalogueSearch.showClusters = false;

  navigatorCatalogueSearch.contentSectionsParams = {
    ...navigatorCatalogueSearch.contentSectionsParams,
    enable: false,
  };

  navigatorCatalogueSearch.permanentFilters.push({
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

  navigatorCatalogueSearch.permanentFilters.push({
    terms: {
      objectProvides: ['Tool'],
    },
  });

  navigatorCatalogueSearch.facets = facets;
  navigatorCatalogueSearch.views = views;
  navigatorCatalogueSearch.contentBodyComponent =
    'NavigatorCatalogueContentView';

  if (typeof window !== 'undefined') {
    config.searchui.navigatorCatalogueSearch.host =
      process.env.RAZZLE_ES_PROXY_ADDR || getClientProxyAddress();
  }

  return config;
}
