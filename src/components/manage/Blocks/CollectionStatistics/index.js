import CollectionStatsEdit from './CollectionStatsEdit';
import CollectionStatsView, {
  StatVoltoIcon,
  RemixIcon,
} from './CollectionStatsView';

import dotsSVG from '@plone/volto/icons/dots.svg';
import airPollutionSvg from '@eeacms/volto-cca-policy/icons/air_pollution_and_aero-allergens.svg';
import heatSvg from '@eeacms/volto-cca-policy/icons/heat.svg';
import climateSensitiveSvg from '@eeacms/volto-cca-policy/icons/climate-sensitive_diseases.svg';
import wildfiresSvg from '@eeacms/volto-cca-policy/icons/wildfires.svg';
import droughtsSvg from '@eeacms/volto-cca-policy/icons/droughts_and_floods.svg';

const healthImpactIcons = {
  'Climate-sensitive diseases': climateSensitiveSvg,
  Heat: heatSvg,
  Wildfires: wildfiresSvg,
  'Droughts and floods': droughtsSvg,
  'Air pollution and aero-allergens': airPollutionSvg,
};

const portalTypeIcons = {
  'Adaptation option': 'cogs',
  'Case study': 'file text',
  Guidance: 'compass',
  Indicator: 'area chart',
  'Information portal': 'info circle',
  Organisation: 'sitemap',
  'Publication and report': 'newspaper',
  'Research and knowledge project': 'university',
  Tool: 'wrench',
  'Video and podcast': 'video play',
  // 'eea.climateadapt.aceproject': '',
  // 'eea.climateadapt.c3sindicator': '',
  // 'eea.climateadapt.mapgraphdataset': '',
};

const portalTypesToSearchTypes = {
  'eea.climateadapt.adaptationoption': 'Adaptation option',
  'eea.climateadapt.casestudy': 'Case study',
  'eea.climateadapt.guidancedocument': 'Guidance',
  'eea.climateadapt.indicator': 'Indicator',
  'eea.climateadapt.c3sindicator': 'Indicator',
  'eea.climateadapt.informationportal': 'Information portal',
  'eea.climateadapt.organisation': 'Organisation',
  'eea.climateadapt.publicationreport': 'Publication and report',
  'eea.climateadapt.aceproject': 'Research and knowledge project',
  'eea.climateadapt.researchproject': 'Research and knowledge project',
  'eea.climateadapt.tool': 'Tool',
  'eea.climateadapt.video': 'Video and podcast',
  // TODO: what about these?
  // 'eea.climateadapt.aceproject': '',
  // 'eea.climateadapt.mapgraphdataset': '',
};

export default function installCollectionStatsBlock(config) {
  config.blocks.blocksConfig.collectionStats = {
    id: 'collectionStats',
    title: 'Collection Statistics',
    icon: dotsSVG,
    group: 'site',
    edit: CollectionStatsEdit,
    view: CollectionStatsView,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
    groups: {
      health_impacts: {
        cleanup: (stats) => {
          const res = {};
          Object.keys(stats).forEach((name) => {
            const count = parseInt(stats[name]);

            if (name === 'Air quality and aeroallergens')
              name = 'Air pollution and aero-allergens';
            if (name === 'Heat and cold') name = 'Heat';
            if (name === 'Floods and storms') name = 'Droughts and floods';

            // if (name === '-NONSPECIFIC-') return;
            // this excludes options that have no icon
            if (!healthImpactIcons[name]) return;

            if (!res[name]) res[name] = 0;
            res[name] += count;
          });

          return res;
        },
        icons: healthImpactIcons,
        iconComponent: StatVoltoIcon,
      },
      portal_type: {
        searchFieldName: 'objectProvides',
        cleanup: (stats) => {
          const res = {};
          Object.keys(stats).forEach((name) => {
            const count = parseInt(stats[name]);

            name = portalTypesToSearchTypes[name];
            if (!name) return;

            if (!portalTypeIcons[name]) return;

            if (!res[name]) res[name] = 0;
            res[name] += count;
          });
          return res;
        },
        icons: portalTypeIcons,
        iconComponent: RemixIcon,
      },
    },
  };

  return config;
}

// -NONSPECIFIC-
// Air pollution and aero-allergens
// Air quality and aeroallergens
// Climate-sensitive diseases
// Droughts and floods
// Floods and storms
// Heat
// Heat and cold
// Infectious diseases
// Wildfires
