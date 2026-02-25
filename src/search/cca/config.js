import { mergeConfig } from '@eeacms/search';
import { getClientProxyAddress } from '../utils';
import { vocab } from '../vocabulary';

import facets from './facets';
import views from './views';
import { DOWNLOAD_FIELDS } from '@eeacms/volto-cca-policy/constants';

const ccaConfig = {
  title: 'ClimateAdapt Main',
  ...views,
};

export const clusters = {
  name: 'op_cluster',
  // field: 'objectProvides',
  clusters: [
    {
      name: 'Climate-ADAPT',
      icon: { name: 'file text' },
      values: ['climate'],
    },
    {
      name: 'Health Observatory',
      icon: { name: 'compass' },
      values: ['observatory'],
    },
    {
      name: 'Mission Portal',
      icon: { name: 'compass' },
      values: ['mission'],
    },
  ].map((cluster) => ({
    ...cluster,
    defaultResultView: 'ClusterHorizontalCardItem',
  })),
};

const cca_build_runtime_mappings = {};
cca_build_runtime_mappings['op_cluster'] = {
  type: 'keyword',
  script: {
    source:
      "def objectProvides = ['Adaptation option','Case study','Guidance','Video','Indicator','Information portal','Organisation','Publication reference','Research and knowledge project','Video','Tool'];def vals = doc['objectProvides'];for (defVal in objectProvides) {for (objVal in vals) {if (objVal.contains(defVal)) {emit('Climate-ADAPT')}}}emit('_all_');if (doc['cca_include_in_search_observatory'][0]) {for (defVal in objectProvides) {for (objVal in vals) {if (objVal.contains(defVal)){emit('Health Observatory')}}}}  if (doc['cca_include_in_mission.keyword'][0].toString() == 'true') {emit('Mission Portal')} else {if (doc['id.keyword'].length==1) { if(doc['id.keyword'][0].toString().contains('climate-adapt.eea.europa.eu/en/mission')) {emit('Mission Portal')}}}",
  },
};

export default function installMainSearch(config) {
  const envConfig = ccaConfig;
  const pjson = require('@eeacms/volto-cca-policy/../package.json');

  envConfig.app_name = pjson.name;
  envConfig.app_version = pjson.version;

  config.searchui.ccaSearch = {
    ...mergeConfig(envConfig, config.searchui.globalsearchbase),
    elastic_index: '_es/globalsearch',
    index_name: 'data_searchui',
    host: process.env.RAZZLE_ES_PROXY_ADDR || 'http://localhost:3000',
    runtime_mappings: cca_build_runtime_mappings,
    vocab,
  };

  config.searchui.ccaSearch.download_fields = DOWNLOAD_FIELDS;

  const { ccaSearch } = config.searchui;

  ccaSearch.contentSectionsParams = {
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

  ccaSearch.permanentFilters.push({
    term: {
      cluster_name: 'cca',
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
    {
      id: 'cca_geographic_countries',
      title: 'Countries',
      facetField: 'cca_geographic_countries.keyword',
      // filterType: 'any:exact',
      sortOn: 'alpha',
      // maxPerSection: 100,
      whitelist: [
        'Austria',
        'Belgium',
        'Bulgaria',
        'Croatia',
        'Cyprus',
        'Czechia',
        'Denmark',
        'Estonia',
        'Finland',
        'France',
        'Germany',
        'Greece',
        'Hungary',
        'Iceland',
        'Ireland',
        'Italy',
        'Latvia',
        'Liechtenstein',
        'Lithuania',
        'Luxembourg',
        'Malta',
        'Netherlands',
        'Norway',
        'Poland',
        'Portugal',
        'Romania',
        'Slovakia',
        'Slovenia',
        'Spain',
        'Sweden',
        'Switzerland',
        'Türkiye',
        'Albania',
        'Bosnia and Herzegovina',
        'Kosovo',
        'Montenegro',
        'North Macedonia',
        'Serbia',
      ],
      icon: {
        family: 'CountryFlags',
        className: 'facet-option-icon',
      },
    },
  ];

  if (typeof window !== 'undefined') {
    config.searchui.ccaSearch.host =
      process.env.RAZZLE_ES_PROXY_ADDR || getClientProxyAddress();
  }
  let fieldsMatchAll = [
    'cca_climate_impacts.keyword',
    'cca_adaptation_sectors.keyword',
    'cca_adaptation_elements.keyword',
    'cca_key_type_measure.keyword',
  ];
  config.searchui.ccaSearch.facets.forEach((facet) => {
    if (fieldsMatchAll.includes(facet.field)) {
      facet.filterType = 'all';
    }
  });

  return config;
}
