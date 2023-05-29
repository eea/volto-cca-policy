import { compose } from 'redux';
import loadable from '@loadable/component';

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
import C3SIndicatorView from './components/theme/Views/C3SIndicatorView';

import ccaLogo from '@eeacms/volto-cca-policy/../theme//assets/images/Header/climate-adapt-logo.svg';
import eeaWhiteLogo from '@eeacms/volto-eea-design-system/../theme/themes/eea/assets/logo/eea-logo-white.svg';
import europeanComissionLogo from '@eeacms/volto-cca-policy/../theme//assets/images/Footer/ec_logo.svg';

import installBlocks from './components/manage/Blocks';
import installSearchEngine from './search';

import GeocharsWidget from './components/theme/Widgets/GeocharsWidget';
import GeolocationWidget from './components/theme/Widgets/GeolocationWidget';

const applyConfig = (config) => {
  const notInEnMission = /^(?!(\/en\/mission)).*$/;
  if (!__DEVELOPMENT__) {
    config.settings.externalRoutes = [
      ...(config.settings.externalRoutes || []),
      {
        match: {
          path: notInEnMission,
          exact: false,
          strict: false,
        },
      },
    ];
  }

  config.settings.loadables.d3 = loadable.lib(() => import('d3'));

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
      managedBy: [
        {
          link: 'https://www.eea.europa.eu/',
          src: eeaWhiteLogo,
          alt: 'EEA Logo',
          className: 'site logo',
          columnSize: {
            mobile: 6,
            tablet: 12,
            computer: 4,
          },
        },
        {
          link: 'https://commission.europa.eu/',
          src: europeanComissionLogo,
          alt: 'European Commission Logo',
          className: 'ec logo',
          columnSize: {
            mobile: 6,
            tablet: 12,
            computer: 4,
          },
        },
      ],
      social: [],
      actions: [
        {
          link: '/en/mission/the-mission/privacy',
          title: 'Privacy',
        },
        {
          link: '/en/mission/login',
          title: 'CMS Login',
        },
      ],
      contacts: [
        {
          icon: 'comment outline',
          text: 'About',
          link: '/en/mission/the-mission/about-the-mission',
          children: [],
        },
        {
          icon: 'comment outline',
          text: 'Contact',
          link: 'climate.adapt@eea.europa.eu',
        },
      ],
    },
    headerSearchBox: [
      {
        isDefault: true,
        // to replace search path change path to whatever you want and match with the page in volto website
        matchpath: '/en/mission',
        path: '/en/mission/advanced-search',
        placeholder: 'Search Climate-ADAPT...',
        description:
          'Looking for more information? Try searching the full EEA website content',
        buttonTitle: 'Go to advanced search',
        buttonUrl: 'https://www.eea.europa.eu/en/advanced-search',
      },
      {
        isDefault: false,
        // to replace search path change path to whatever you want and match with the page in volto website
        matchpath: '/en/observatory',
        path: '/en/observatory/advanced-search',
        placeholder: 'Search Observatory Climate-ADAPT...',
        description:
          'Looking for more information? Try searching the full EEA website content',
        buttonTitle: 'Go to advanced search',
        buttonUrl: 'https://www.eea.europa.eu/en/advanced-search',
      },
    ],
    logoTargetUrl: '/',
    organisationName: 'Climate-ADAPT',
    websiteTitle: 'Climate-ADAPT',
  };

  // Enable volto-embed
  if (config.blocks.blocksConfig.maps) {
    config.blocks.blocksConfig.maps.restricted = false;
  }

  // Enable video
  if (config.blocks.blocksConfig.video) {
    config.blocks.blocksConfig.video.restricted = false;
  }

  config.blocks.blocksConfig.__grid = {
    ...config.blocks.blocksConfig.__grid,
    maxNumberOfColumns: 5,
  };

  config.blocks.blocksConfig.nextCloudVideo = {
    ...config.blocks.blocksConfig.nextCloudVideo,
    whiteList: [
      'https://cmshare.eea.europa.eu',
      'https://shareit.eea.europa.eu',
    ],
  };

  config.blocks.groupBlocksOrder.push({ id: 'site', title: 'Site' });

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
    'eea.climateadapt.c3sindicator': C3SIndicatorView,
  };

  config.settings.contextNavigationLocations = [
    // {
    //   title: 'Regional Adaptation Support Tool',
    //   columns: 4,
    //   topLevel: 2,
    //   bottomLevel: 0,
    //   rootPath: '/mission/knowledge-and-data/regional-adaptation-support-tool',
    // },
    {
      title: 'UrbanAST',
      topLevel: 3,
      bottomLevel: 2,
      rootPath: 'knowledge/tools/urban-ast',
    },
    {
      title: 'Adaptation Suport Tool',
      topLevel: 3,
      bottomLevel: 2,
      rootPath: 'knowledge/tools/adaptation-support-tool',
    },
    {
      title: 'Adaptation',
      topLevel: 4,
      bottomLevel: 2,
      rootPath:
        'countries-regions/transnational-regions/baltic-sea-region/adaptation',
    },
    {
      title: 'Adaptation in Carpathian Mountains',
      topLevel: 3,
      bottomLevel: 2,
      rootPath: 'countries-regions/transnational-regions/carpathian-mountains',
    },
    {
      title: 'Share your info',
      topLevel: 2,
      bottomLevel: 2,
      rootPath: 'help/share-your-info',
    },
  ];

  // Custom widgets
  config.widgets.id.geochars = GeocharsWidget;
  config.widgets.id.geolocation = GeolocationWidget;

  // we won't need the listing for Folders
  delete config.views.layoutViews.listing_view;

  if (__SERVER__) {
    const installExpressMiddleware = require('./express-middleware').default;
    config = installExpressMiddleware(config);
  }

  // fixes bug caused by https://github.com/eea/volto-eea-website-theme/commit/94078403458a5a3ea725ce9126fffed9d463097d
  config.settings.apiExpanders.push({
    match: '',
    GET_CONTENT: ['breadcrumbs'], // 'navigation', 'actions', 'types'],
  });

  return compose(installBlocks, installSearchEngine)(config);
};

export default applyConfig;
