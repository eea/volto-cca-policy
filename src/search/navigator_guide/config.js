import { mergeConfig } from '@eeacms/search';

import { getClientProxyAddress } from './../utils';
import { vocab } from './../vocabulary';
import facets from './facets';

const previewResultsLimit = 3;

const navigatorGuideConfig = {
  title: 'Navigator Guide',
  landingPageURL: '/en/navigator',
  alwaysSearchOnInitialLoad: true,
  resultsPerPage: previewResultsLimit,
  previewResultsLimit,
  trackUrlState: false,
  showLandingPage: false,
  layoutComponent: 'NavigatorGuideLayout',
  contentBodyComponent: 'NavigatorGuideContentView',
  resultsPageURL: '/en/navigator',
};

export default function installNavigatorGuideSearch(config) {
  const pjson = require('@eeacms/volto-cca-policy/../package.json');
  const appConfig = {
    ...navigatorGuideConfig,
    app_name: pjson.name,
    app_version: pjson.version,
  };

  config.searchui.navigatorGuideSearch = {
    ...mergeConfig(appConfig, config.searchui.globalsearchbase),
    elastic_index: '_es/globalsearch',
    index_name: 'data_searchui',
    host: process.env.RAZZLE_ES_PROXY_ADDR || 'http://localhost:3000',
    vocab,
    facets,
  };

  const { navigatorGuideSearch } = config.searchui;

  navigatorGuideSearch.contentSectionsParams = {
    ...navigatorGuideSearch.contentSectionsParams,
    enable: false,
  };

  navigatorGuideSearch.permanentFilters.push({
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

  navigatorGuideSearch.permanentFilters.push({
    terms: {
      objectProvides: ['Tool'],
    },
  });

  if (typeof window !== 'undefined') {
    navigatorGuideSearch.host =
      process.env.RAZZLE_ES_PROXY_ADDR || getClientProxyAddress();
  }

  return config;
}
