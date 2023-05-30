import { mergeConfig } from '@eeacms/search';

import facets from './facets';

// import views from './views';
// import filters from './filters';
// import vocabs from './vocabulary';

const getClientProxyAddress = () => {
  const url = new URL(window.location);
  url.pathname = '';
  url.search = '';
  return url.toString();
};

const ccaConfig = {
  title: 'ClimateAdapt Main',
};

export default function installMainSearch(config) {
  const envConfig = process.env.RAZZLE_ENV_CONFIG
    ? JSON.parse(process.env.RAZZLE_ENV_CONFIG)
    : ccaConfig;

  const pjson = require('@eeacms/volto-cca-policy/../package.json');

  envConfig.app_name = pjson.name;
  envConfig.app_version = pjson.version;

  config.searchui.ccaSearch = {
    ...mergeConfig(envConfig, config.searchui.globalsearchbase),
    elastic_index: '_es/globalsearch',
    index_name: 'data_searchui',
    host: process.env.RAZZLE_ES_PROXY_ADDR || 'http://localhost:3000',
  };

  const { ccaSearch } = config.searchui;

  ccaSearch.permanentFilters.push({
    term: {
      cluster_name: 'cca',
    },
  });
  ccaSearch.permanentFilters.push({
    term: {
      cca_include_in_mission: 'true',
    },
  });

  ccaSearch.facets = facets;

  ccaSearch.initialView.tilesLandingPageParams.sections = [
    {
      id: 'types',
      title: 'Types',
      facetField: 'objectProvides',
      sortOn: 'alpha',
      icon: {
        family: 'Content types',
      },
    },
    // {
    //   id: 'topics',
    //   title: 'Topics',
    //   facetField: 'topic',
    //   sortOn: 'alpha',
    //   whitelist: [
    //     'Agriculture and food',
    //     'Air pollution',
    //     'Bathing water quality',
    //     'Biodiversity',
    //     'Bioeconomy',
    //     'Buildings and construction',
    //     'Chemicals',
    //     'Circular economy',
    //     'Climate change adaptation',
    //     'Climate change mitigation',
    //     'Electric vehicles',
    //     'Energy',
    //     'Energy efficiency',
    //     'Environmental health impacts',
    //     'Environmental inequalities',
    //     'Extreme weather',
    //     'Fisheries and aquaculture',
    //     'Forests and forestry',
    //     'Industry',
    //     'Land use',
    //     'Nature protection and restoration',
    //     'Nature-based solutions',
    //     'Noise',
    //     'Plastics',
    //     'Pollution',
    //     'Production and consumption',
    //     'Renewable energy',
    //     'Resource use and materials',
    //     'Road transport',
    //     'Seas and coasts',
    //     'Soil',
    //     'Sustainability challenges',
    //     'Sustainability solutions',
    //     'Sustainable finance',
    //     'Textiles',
    //     'Transport and mobility',
    //     'Urban sustainability',
    //     'Waste and recycling',
    //     'Water',
    //   ],
    // },
    // {
    //   id: 'countries',
    //   title: 'Countries',
    //   facetField: 'spatial',
    //   filterType: 'any:exact',
    //   sortOn: 'alpha',
    //   maxPerSection: 100,
    //   whitelist: [
    //     'Austria',
    //     'Belgium',
    //     'Bulgaria',
    //     'Croatia',
    //     'Cyprus',
    //     'Czechia',
    //     'Denmark',
    //     'Estonia',
    //     'Finland',
    //     'France',
    //     'Germany',
    //     'Greece',
    //     'Hungary',
    //     'Iceland',
    //     'Ireland',
    //     'Italy',
    //     'Latvia',
    //     'Liechtenstein',
    //     'Lithuania',
    //     'Luxembourg',
    //     'Malta',
    //     'Netherlands',
    //     'Norway',
    //     'Poland',
    //     'Portugal',
    //     'Romania',
    //     'Slovakia',
    //     'Slovenia',
    //     'Spain',
    //     'Sweden',
    //     'Switzerland',
    //     'Türkiye',
    //     'Albania',
    //     'Bosnia and Herzegovina',
    //     'Kosovo',
    //     'Montenegro',
    //     'North Macedonia',
    //     'Serbia',
    //   ],
    //   icon: {
    //     family: 'CountryFlags',
    //     className: 'facet-option-icon',
    //   },
    // },
    // {
    //   id: 'language',
    //   title: 'Languages',
    //   facetField: 'language',
    //   sortOn: 'custom',
    //   sortOrder: 'asc',
    // },
    // {
    //   id: 'website',
    //   title: 'Websites',
    //   facetField: 'cluster_name',
    //   sortOn: 'count',
    //   sortOrder: 'desc',
    //   icon: {
    //     family: 'Sources',
    //     className: 'facet-option-icon',
    //   },
    // },
  ];

  if (typeof window !== 'undefined') {
    config.searchui.ccaSearch.host =
      process.env.RAZZLE_ES_PROXY_ADDR || getClientProxyAddress();
  }
  // console.log(config.searchui.ccaSearch);

  return config;
}
