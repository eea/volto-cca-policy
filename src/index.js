import AdaptationOptionView from './components/theme/Views/AdaptationOptionView';
import CaseStudyView from './components/theme/Views/CaseStudyView';
import GuidanceView from './components/theme/Views/GuidanceView';
import IndicatorView from './components/theme/Views/IndicatorView';
import InformationPortalView from './components/theme/Views/InformationPortalView';
import OrganisationView from './components/theme/Views/OrganisationView';
import ProjectView from './components/theme/Views/ProjectView';
import PublicationReportView from './components/theme/Views/PublicationReportView';
import ToolView from './components/theme/Views/ToolView';
import VideoView from './components/theme/Views/VideoView';

import ccaLogo from '@eeacms/volto-cca-policy/../theme//assets/images/Header/climate-adapt-logo.svg';

import installBlocks from './components/manage/Blocks';

const applyConfig = (config) => {
  config.settings.dateLocale = 'en-gb';
  config.settings.isMultilingual = true;
  config.settings.defaultLanguage =
    config.settings.eea?.defaultLanguage || 'en';
  // config.settings.supportedLanguages = config.settings.eea?.languages?.map(
  //   (item) => item.code,
  // ) || ['en'];
  config.settings.supportedLanguages = ['en', 'de', 'fr', 'es', 'it'];

  // EEA customizations
  config.settings.eea = {
    ...(config.settings.eea || {}),
    headerOpts: {
      ...(config.settings.eea?.headerOpts || {}),
      logo: ccaLogo,
    },
    footerOpts: {
      ...(config.settings.eea?.footerOpts || {}),
      description:
        'The European Climate Adaptation Platform Climate-ADAPT is a partnership between the European Commission and the European Environment Agency.',
    },
    headerSearchBox: [
      {
        isDefault: true,
        path: '/advanced-search',
        placeholder: 'Search...',
        // description:
        //   'Looking for more information? Try searching the full EEA website content',
        // buttonTitle: 'Go to full site search',
      },
    ],
    logoTargetUrl: '/en',
  };

  // Enable volto-embed
  if (config.blocks.blocksConfig.maps) {
    config.blocks.blocksConfig.maps.restricted = false;
  }

  //console.log(config);
  config.views.contentTypesViews = {
    ...config.views.contentTypesViews,
    'eea.climateadapt.adaptationoption': AdaptationOptionView,
    'eea.climateadapt.casestudy': CaseStudyView,
    'eea.climateadapt.guidancedocument': GuidanceView,
    'eea.climateadapt.indicator': IndicatorView,
    'eea.climateadapt.informationportal': InformationPortalView,
    'eea.climateadapt.organisation': OrganisationView,
    'eea.climateadapt.aceproject': ProjectView,
    'eea.climateadapt.publicationreport': PublicationReportView,
    'eea.climateadapt.tool': ToolView,
    'eea.climateadapt.video': VideoView,
  };

  config.settings.contextNavigationLocations = [
    {
      title: 'Regional Adaptation Tool',
      topLevel: 1, // mkh is a navigation root
      rootPath: '/mkh/regional-adaptation-tool',
      columns: 4,
    },
    {
      title: 'UrbanAST',
      topLevel: 3,
      rootPath: '/knowledge/tools/urban-ast',
    },
    {
      title: 'Adaptation Suport Tool',
      topLevel: 3,
      rootPath: '/knowledge/tools/adaptation-support-tool',
    },
  ];

  // we won't need the listing for Folders
  delete config.views.layoutViews.listing_view;

  return installBlocks(config);
};

export default applyConfig;
