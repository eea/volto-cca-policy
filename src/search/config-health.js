import { mergeConfig } from '@eeacms/search';
import { build_runtime_mappings } from '@eeacms/volto-globalsearch/utils';

import facets from './facets-health';

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

  config.searchui.ccaHealthSearch = {
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

  const { ccaHealthSearch } = config.searchui;

  // ccaHealthSearch.permanentFilters.push({
  //   term: {
  //     cluster_name: 'cca',
  //   },
  // });

  ccaHealthSearch.permanentFilters.push({
    term: {
      cca_include_in_search_observatory: 'true',
    },
  });

  ccaHealthSearch.permanentFilters.push({
    terms: {
      objectProvides: [
        'Adaptation option',
        'Case study',
        'Guidance',
        'Video',
        'Indicator',
        'Information portal',
        'Organisation',
        'Publication reference',
        'Research and knowledge project',
        'Tool',
      ],
    },
  });

  ccaHealthSearch.facets = facets;

  ccaHealthSearch.initialView.tilesLandingPageParams.sections = [
    {
      id: 'types',
      title: 'Types',
      facetField: 'objectProvides',
      sortOn: 'alpha',
      icon: {
        family: 'Content types',
      },
    },
    {
      id: 'healthImpacts',
      title: 'Health Impacts',
      facetField: 'health_impacts.keyword',
      sortOn: 'alpha',
      // icon: {
      //   family: 'Content types',
      // },
      whitelist: [
        'Wildfires',
        'Air pollution and aero-allergens',
        'Droughts and floods',
        'Climate-sensitive diseases',
        'Heat',
      ],
    },

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
    config.searchui.ccaHealthSearch.host =
      process.env.RAZZLE_ES_PROXY_ADDR || getClientProxyAddress();
  }
  // console.log(config.searchui.ccaHealthSearch);

  return config;
}

// {
//       id: 'cca_geographic_countries',
//       title: 'Countries',
//       facetField: 'cca_geographic_countries.keyword',
//       // filterType: 'any:exact',
//       sortOn: 'alpha',
//       // maxPerSection: 100,
//       whitelist: [
//         'Austria',
//         'Belgium',
//         'Bulgaria',
//         'Croatia',
//         'Cyprus',
//         'Czechia',
//         'Denmark',
//         'Estonia',
//         'Finland',
//         'France',
//         'Germany',
//         'Greece',
//         'Hungary',
//         'Iceland',
//         'Ireland',
//         'Italy',
//         'Latvia',
//         'Liechtenstein',
//         'Lithuania',
//         'Luxembourg',
//         'Malta',
//         'Netherlands',
//         'Norway',
//         'Poland',
//         'Portugal',
//         'Romania',
//         'Slovakia',
//         'Slovenia',
//         'Spain',
//         'Sweden',
//         'Switzerland',
//         'Türkiye',
//         'Albania',
//         'Bosnia and Herzegovina',
//         'Kosovo',
//         'Montenegro',
//         'North Macedonia',
//         'Serbia',
//       ],
//       icon: {
//         family: 'CountryFlags',
//         className: 'facet-option-icon',
//       },
//     },
