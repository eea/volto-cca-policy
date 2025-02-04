import { mergeConfig } from '@eeacms/search';
import { getClientProxyAddress } from '../utils';
import vocabs from '../vocabulary';

import facets from './facets';
import views from './views';

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

// console.log('clusters default', clusters, build_runtime_mappings(clusters));
// console.log(
//   'clusters mission',
//   clusters_mission,
//   build_runtime_mappings(clusters_mission),
// );

const cca_build_runtime_mappings = {};
cca_build_runtime_mappings['op_cluster'] = {
  type: 'keyword',
  script: {
    source:
      // "emit('_all_'); if (doc['cca_include_in_search_observatory'][0]) {emit('Health Observatory')} if (doc['cca_include_in_mission.keyword'][0].toString() == 'true') {emit('Mission Portal')} else {emit('Climate-ADAPT')}",
      // "emit('_all_'); if (doc['cca_include_in_search_observatory'][0]) {emit('Health Observatory')} if (doc['cca_include_in_mission.keyword'][0].toString() == 'true' or (doc['id.keyword'].length==1 and doc['id.keyword'][0].toString().indexOf('https://climate-adapt.eea.europa.eu/en/mission')==0)) {emit('Mission Portal')} else {emit('Climate adapt')}",
      // "def objectProvides = ['Adaptation option','Case study','Guidance','Video','Indicator','Information portal','Organisation','Publication reference','Research and knowledge project','Video','Tool'];def vals = doc['objectProvides'];for (defVal in objectProvides) {for (objVal in vals) {if (objVal.contains(defVal)) {emit('Climate-ADAPT')}}}emit('_all_');if (doc['cca_include_in_search_observatory'][0]) {emit('Health Observatory')}  if (doc['cca_include_in_mission.keyword'][0].toString() == 'true') {emit('Mission Portal')} else {if (doc['id.keyword'].length==1) { if(doc['id.keyword'][0].toString().contains('climate-adapt.eea.europa.eu/en/mission')) {emit('Mission Portal')}}}",
      "def objectProvides = ['Adaptation option','Case study','Guidance','Video','Indicator','Information portal','Organisation','Publication reference','Research and knowledge project','Video','Tool'];def vals = doc['objectProvides'];for (defVal in objectProvides) {for (objVal in vals) {if (objVal.contains(defVal)) {emit('Climate-ADAPT')}}}emit('_all_');if (doc['cca_include_in_search_observatory'][0]) {for (defVal in objectProvides) {for (objVal in vals) {if (objVal.contains(defVal)){emit('Health Observatory')}}}}  if (doc['cca_include_in_mission.keyword'][0].toString() == 'true') {emit('Mission Portal')} else {if (doc['id.keyword'].length==1) { if(doc['id.keyword'][0].toString().contains('climate-adapt.eea.europa.eu/en/mission')) {emit('Mission Portal')}}}",
  },
};

// const mapping = {};
// mapping[settings.name] = {
//   type: 'keyword',
//   script: { source: source },
// };

export default function installMainSearch(config) {
  const envConfig = ccaConfig;

  const pjson = require('@eeacms/volto-cca-policy/../package.json');

  envConfig.app_name = pjson.name;
  envConfig.app_version = pjson.version;

  // console.log('config.searchui.ccaSearch clusers', clusters);
  // debugger;
  config.searchui.globalsearch.download_fields = [
    { field: 'about', name: 'About' },
    { field: 'title', name: 'title' },
    { field: 'issued', name: 'Issued' },
    { field: 'objectProvides', name: 'Content type' },
    { field: 'cca_adaptation_sectors', name: 'Sectors' },
    { field: 'cca_climate_impacts', name: 'Climate impact' },
    { field: 'transnational_regions', name: 'Transnational regions' },
    { field: 'cca_adaptation_elements', name: 'Adaptation Approaches' },
    { field: 'cca_funding_programme', name: 'Funding programme' },
    { field: 'cca_key_type_measure', name: 'Key type measure' },
    { field: 'cca_geographic_countries', name: 'Countries' },
    { field: 'cca_origin_websites', name: 'Origin website' },
    { field: 'cca_health_impacts', name: 'Health impacts' },
    { field: 'cca_partner_contributors', name: 'Observatory impacts' },
  ];
  config.searchui.ccaSearch = {
    ...mergeConfig(envConfig, config.searchui.globalsearchbase),
    elastic_index: '_es/globalsearch',
    index_name: 'data_searchui',
    host: process.env.RAZZLE_ES_PROXY_ADDR || 'http://localhost:3000',
    runtime_mappings: cca_build_runtime_mappings,
    ...vocabs,
  };

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

  // ccaSearch.permanentFilters.push((filters) => {
  //   const hasLanguageFilter = filters.find(({ field }) => field === 'language');
  //   console.log('permanentFilters', hasLanguageFilter, filters);
  //   if (!hasLanguageFilter) {
  //     return {
  //       terms: {
  //         language: ['en'],
  //       },
  //     };
  //   }
  //   return null;
  // });

  // ccaSearch.permanentFilters.push({
  //   terms: {
  //     objectProvides: [
  //       'Adaptation option',
  //       'Case study',
  //       'Guidance',
  //       'Video',
  //       'Indicator',
  //       'Information portal',
  //       'Organisation',
  //       'Publication reference',
  //       'Research and knowledge project',
  //       'Tool',
  //     ],
  //   },
  // });

  ccaSearch.facets = facets;
  // console.log('ccaSearch.facets', ccaSearch.facets);

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

  // console.log(config);
  return config;
}
