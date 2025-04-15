import { mergeConfig } from '@eeacms/search';
import { build_runtime_mappings } from '@eeacms/volto-globalsearch/utils';
import { getClientProxyAddress } from './../utils';
import { vocab } from './../vocabulary';

import facets from './facets-health';
import views from './views-health';

// import { defineMessages } from 'react-intl';

// const messages = defineMessages({
//   types: {
//     id: 'Types',
//     defaultMessage: 'Types',
//   },
//   healthImpacts: { id: 'Health Impacts', defaultMessage: 'Health Impacts' },
//   observatoryPartner: {
//     id: 'Observatory partner',
//     defaultMessage: 'Observatory partner',
//   },
// });

const ccaConfig = {
  title: 'ClimateAdapt Health',
  ...views,
};

export const clusters = {
  name: 'op_cluster',
  field: 'objectProvides',
  clusters: [
    {
      name: 'Case studies',
      icon: { name: 'file text' },
      values: ['Case study'],
    },
    {
      name: 'Guidance',
      icon: { name: 'compass' },
      values: ['Guidance'],
    },
    {
      name: 'Indicators',
      icon: { name: 'area chart' },
      values: ['Indicator'],
    },
    {
      name: 'Information portals',
      icon: { name: 'info circle' },
      values: ['Information portal'],
    },
    {
      name: 'Publications and reports',
      icon: { name: 'newspaper' },
      values: ['Publication reference'],
    },
    {
      name: 'Research and knowledge projects',
      icon: { name: 'university' },
      values: ['Research and knowledge project'],
    },
    {
      name: 'Tools',
      icon: { name: 'wrench' },
      values: ['Tool'],
    },
    {
      name: 'Videos',
      icon: { name: 'video play' },
      values: ['Video'],
    },
  ].map((cluster) => ({
    ...cluster,
    defaultResultView: 'horizontalCard',
  })),
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
    vocab,
    runtime_mappings: build_runtime_mappings(clusters),
  };

  const { ccaHealthSearch } = config.searchui;

  ccaHealthSearch.permanentFilters.push({
    term: {
      cca_include_in_search_observatory: 'true',
    },
  });
  ccaHealthSearch.permanentFilters.push({
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
  ccaHealthSearch.contentSectionsParams = {
    enable: true,
    sectionFacetsField: 'op_cluster',
    sections: clusters.clusters,
    clusterMapping: Object.assign(
      {},
      ...clusters.clusters.map(({ name, values }) =>
        Object.assign({}, ...values.map((v) => ({ [v]: name }))),
      ),
    ),
  };
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
  // ccaHealthSearch.views = views;

  ccaHealthSearch.initialView.tilesLandingPageParams.sections = [
    {
      id: 'types',
      title: 'Types',
      // title: messages.types,
      facetField: 'objectProvides',
      sortOn: 'alpha',
      icon: {
        family: 'Content types',
      },
    },
    {
      id: 'healthImpacts',
      title: 'Health Impacts',
      // title: messages.healthImpacts,
      facetField: 'cca_health_impacts.keyword',
      sortOn: 'alpha',
      whitelist: [
        'Wildfires',
        'Air pollution and aero-allergens',
        'Droughts and floods',
        'Climate-sensitive diseases',
        'Heat',
      ],
    },
    {
      id: 'observatoryPartner',
      title: 'Observatory partner',
      // title: messages.observatoryPartner,
      facetField: 'cca_partner_contributors.keyword',
      sortOn: 'alpha',
    },
  ];

  if (typeof window !== 'undefined') {
    config.searchui.ccaHealthSearch.host =
      process.env.RAZZLE_ES_PROXY_ADDR || getClientProxyAddress();
  }

  ccaHealthSearch.icons['Content types'] = Object.assign(
    {
      ...ccaHealthSearch.icons['Content types'],
    },
    ...clusters.clusters.map((cluster) => ({ [cluster.name]: cluster.icon })),
  );

  return config;
}
