import { compose } from 'redux';
import loadable from '@loadable/component';

import { Sitemap } from '@plone/volto/components';
import AdaptationOptionView from './components/theme/Views/AdaptationOptionView';
import CaseStudyView from './components/theme/Views/CaseStudyView';
import CcaEventView from './components/theme/Views/CcaEventView';
import GuidanceView from './components/theme/Views/GuidanceView';
import IndicatorView from './components/theme/Views/IndicatorView';
import InformationPortalView from './components/theme/Views/InformationPortalView';
import OrganisationView from './components/theme/Views/OrganisationView';
import ProjectView from './components/theme/Views/ProjectView';
import PublicationReportView from './components/theme/Views/PublicationReportView';
import ToolView from './components/theme/Views/ToolView';
import VideoView from './components/theme/Views/VideoView';
import C3SIndicatorView from './components/theme/Views/C3SIndicatorView';

import HealthHorizontalCardItem from './components/Result/HealthHorizontalCardItem';

import ccaLogo from '@eeacms/volto-cca-policy/../theme/assets/images/Header/climate-adapt-logo.svg';
import eeaWhiteLogo from '@eeacms/volto-eea-design-system/../theme/themes/eea/assets/logo/eea-logo-white.svg';
import europeanComissionLogo from '@eeacms/volto-cca-policy/../theme/assets/images/Footer/ec_logo.svg';

import installBlocks from './components/manage/Blocks';
import installSearchEngine from './search';
import installStore from './store';

import GeocharsWidget from './components/theme/Widgets/GeocharsWidget';
import GeolocationWidget from './components/theme/Widgets/GeolocationWidget';

const getEnv = () => (typeof window !== 'undefined' ? window.env : process.env);

const pathToNegRegex = (p) => `(?!(${p}))`;

const restrictedBlocks = ['countryFlag'];

const applyConfig = (config) => {
  const env = getEnv();

  // VOLTO_LOCATIONS is a list of paths that should be handled by Volto.
  // All other paths (meaning, everything that's not specifically set in this
  // variable) will be treated as an external path and the browser will fully
  // load the link as a separate document, and it will load from Plone 4
  const voltoLocations = (env.RAZZLE_VOLTO_LOCATIONS || '')
    .split(';')
    .map((s) => s.trim().replaceAll('/', '\\/'))
    .filter((s) => !!s);

  if (voltoLocations.length) {
    const voltoLocationsRegex =
      '^' + voltoLocations.map(pathToNegRegex).join('') + '.*$';
    config.settings.externalRoutes = [
      ...(config.settings.externalRoutes || []),
      {
        match: {
          path: new RegExp(voltoLocationsRegex),
          exact: false,
          strict: false,
        },
        url(payload) {
          return payload.location.pathname;
        },
      },
    ];
  }

  if (!config.settings.loadables.d3)
    config.settings.loadables.d3 = loadable.lib(() => import('d3'));
  if (!config.settings.loadables.d3Geo)
    config.settings.loadables.d3Geo = loadable.lib(() => import('d3-geo'));

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
          url: '/en/mission/the-mission/privacy',
          title: 'Privacy',
        },
        {
          url: '/en/mission/sitemap',
          title: 'Sitemap',
        },
        {
          url: '/en/mission/login',
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
        isDefault: false,
        // to replace search path change path to whatever you want and match with the page in volto website
        matchpath: '/en/mission',
        path: '/en/mission/knowledge-and-data/search-the-database',
        placeholder: 'Search the Climate-ADAPT database',
        description: 'Looking for more information?',
        buttonTitle: 'Explore more on Climate-ADAPT',
        buttonUrl: 'https://climate-adapt.eea.europa.eu/en/data-and-downloads/',
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
      {
        isDefault: true,
        // to replace search path change path to whatever you want and match with the page in volto website
        matchpath: '/',
        path: '/en/data-and-downloads',
        placeholder: 'Search the Climate-ADAPT database',
        description: 'Looking for more information?',
        buttonTitle: 'Explore more on Climate-ADAPT',
        buttonUrl: 'https://climate-adapt.eea.europa.eu/en/data-and-downloads/',
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

  // Disable blocks
  restrictedBlocks.forEach((block) => {
    if (config.blocks.blocksConfig[block]) {
      config.blocks.blocksConfig[block].restricted = true;
    }
  });

  // Move blocks to Site group
  const move_to_site = [
    'countryFlag',
    'imagecards',
    'layoutSettings',
    'maps',
    'video',
  ];

  for (let block_id of move_to_site) {
    if (config.blocks.blocksConfig[block_id]) {
      config.blocks.blocksConfig[block_id].group = 'site';
    }
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
    'cca-event': CcaEventView,
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

  config.views.layoutViewsNamesMapping.view_cca_event = 'CCA Event View';

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

  // mega menu layout settings
  config.settings.menuItemsLayouts = {
    // '*': {
    //   hideChildrenFromNavigation: false,
    // },
    '/en/eu-policy': {
      hideChildrenFromNavigation: false,
    },
    '/de/eu-policy': {
      hideChildrenFromNavigation: false,
    },
    '/fr/eu-policy': {
      hideChildrenFromNavigation: false,
    },
    '/es/eu-policy': {
      hideChildrenFromNavigation: false,
    },
    '/it/eu-policy': {
      hideChildrenFromNavigation: false,
    },
    '/pl/eu-policy': {
      hideChildrenFromNavigation: false,
    },
    '/en/knowledge-1': {
      hideChildrenFromNavigation: false,
    },
    '/de/knowledge-1': {
      hideChildrenFromNavigation: false,
    },
    '/fr/knowledge-1': {
      hideChildrenFromNavigation: false,
    },
    '/es/knowledge-1': {
      hideChildrenFromNavigation: false,
    },
    '/it/knowledge-1': {
      hideChildrenFromNavigation: false,
    },
    '/pl/knowledge-1': {
      hideChildrenFromNavigation: false,
    },
    // observatory
    '/en/observatory/about': {
      hideChildrenFromNavigation: false,
    },
    '/de/observatory/about': {
      hideChildrenFromNavigation: false,
    },
    '/fr/observatory/about': {
      hideChildrenFromNavigation: false,
    },
    '/es/observatory/about': {
      hideChildrenFromNavigation: false,
    },
    '/it/observatory/about': {
      hideChildrenFromNavigation: false,
    },
    '/pl/observatory/about': {
      hideChildrenFromNavigation: false,
    },
    '/en/observatory/policy-context-1': {
      hideChildrenFromNavigation: false,
    },
    '/de/observatory/policy-context-1': {
      hideChildrenFromNavigation: false,
    },
    '/fr/observatory/policy-context-1': {
      hideChildrenFromNavigation: false,
    },
    '/es/observatory/policy-context-1': {
      hideChildrenFromNavigation: false,
    },
    '/it/observatory/policy-context-1': {
      hideChildrenFromNavigation: false,
    },
    '/pl/observatory/policy-context-1': {
      hideChildrenFromNavigation: false,
    },
    '/en/observatory/evidence-on-climate-and-health': {
      hideChildrenFromNavigation: false,
    },
    '/de/observatory/evidence-on-climate-and-health': {
      hideChildrenFromNavigation: false,
    },
    '/fr/observatory/evidence-on-climate-and-health': {
      hideChildrenFromNavigation: false,
    },
    '/es/observatory/evidence-on-climate-and-health': {
      hideChildrenFromNavigation: false,
    },
    '/it/observatory/evidence-on-climate-and-health': {
      hideChildrenFromNavigation: false,
    },
    '/pl/observatory/evidence-on-climate-and-health': {
      hideChildrenFromNavigation: false,
    },
    '/en/observatory/resource-catalogue-1': {
      hideChildrenFromNavigation: false,
    },
    '/en/observatory/resource-catalogue-1': {
      hideChildrenFromNavigation: false,
    },
    '/de/observatory/resource-catalogue-1': {
      hideChildrenFromNavigation: false,
    },
    '/fr/observatory/resource-catalogue-1': {
      hideChildrenFromNavigation: false,
    },
    '/es/observatory/resource-catalogue-1': {
      hideChildrenFromNavigation: false,
    },
    '/it/observatory/resource-catalogue-1': {
      hideChildrenFromNavigation: false,
    },
    '/pl/observatory/resource-catalogue-1': {
      hideChildrenFromNavigation: false,
    },
    '/en/observatory/publications-and-outreach': {
      hideChildrenFromNavigation: false,
    },
    '/de/observatory/publications-and-outreach': {
      hideChildrenFromNavigation: false,
    },
    '/fr/observatory/publications-and-outreach': {
      hideChildrenFromNavigation: false,
    },
    '/es/observatory/publications-and-outreach': {
      hideChildrenFromNavigation: false,
    },
    '/it/observatory/publications-and-outreach': {
      hideChildrenFromNavigation: false,
    },
    '/pl/observatory/publications-and-outreach': {
      hideChildrenFromNavigation: false,
    },
  };

  // Custom results
  config.settings.searchlib.resolve.HealthHorizontalCardItem = {
    component: HealthHorizontalCardItem,
  };

  // Custom widgets
  config.widgets.id.geochars = GeocharsWidget;
  config.widgets.id.geolocation = GeolocationWidget;

  // we won't need the listing for Folders
  delete config.views.layoutViews.listing_view;

  if (__SERVER__) {
    const installExpressMiddleware = require('./express-middleware').default;
    config = installExpressMiddleware(config);
  }

  config.addonRoutes = [
    {
      path: `/(${config.settings?.supportedLanguages.join(
        '|',
      )})/mission/sitemap`,
      component: Sitemap,
    },

    ...(config.addonRoutes || []),
  ];

  return compose(installBlocks, installSearchEngine, installStore)(config);
};

export default applyConfig;
