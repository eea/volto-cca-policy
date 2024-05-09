import { compose } from 'redux';
import { Sitemap } from '@plone/volto/components';
import DefaultView from '@plone/volto/components/theme/View/DefaultView';
import {
  RASTWidgetView,
  TranslationDisclaimer,
} from '@eeacms/volto-cca-policy/components';
import { blockAvailableInMission } from '@eeacms/volto-cca-policy/utils';

import CcaEventView from './components/theme/Views/CcaEventView';
import NewsItemView from './components/theme/Views/NewsItemView';
import EventView from './components/theme/Views/EventView';
import AdaptationOptionView from './components/theme/Views/AdaptationOptionView';
import CaseStudyView from './components/theme/Views/CaseStudyView';
import ProjectView from './components/theme/Views/ProjectView';
import C3SIndicatorView from './components/theme/Views/C3SIndicatorView';
import DatabaseItemView from './components/theme/Views/DatabaseItemView';

import GeocharsWidget from './components/theme/Widgets/GeocharsWidget';
import GeolocationWidget from './components/theme/Widgets/GeolocationWidget';
import MigrationButtons from './components/MigrationButtons';
import HealthHorizontalCardItem from './components/Result/HealthHorizontalCardItem';

import { langRedirection } from './store/middleware';

import installBlocks from './components/manage/Blocks';
import installSearchEngine from './search';
import installStore from './store';

import ccaLogo from '@eeacms/volto-cca-policy/../theme/assets/images/Header/climate-adapt-logo.svg';
import ccaLogoWhite from '@eeacms/volto-cca-policy/../theme/assets/images/Header/climate-adapt-logo-white.svg';
import observatoryLogoWhite from '@eeacms/volto-cca-policy/../theme/assets/images/Header/observatory-white-logo.svg';
import europeanComissionLogo from '@eeacms/volto-cca-policy/../theme/assets/images/Footer/ec_logo.svg';
import eeaWhiteLogo from '@eeacms/volto-eea-design-system/../theme/themes/eea/assets/logo/eea-logo-white.svg';

import './slate-styles.less';

const getEnv = () => (typeof window !== 'undefined' ? window.env : process.env);

const pathToNegRegex = (p) => `(?!(${p}))`;

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

  // if (!config.settings.loadables.d3)
  //   config.settings.loadables.d3 = loadable.lib(() => import('d3'));
  // if (!config.settings.loadables.d3Geo)
  //   config.settings.loadables.d3Geo = loadable.lib(() => import('d3-geo'));

  config.settings.dateLocale = 'en-gb';
  config.settings.isMultilingual = true;
  config.settings.hasLanguageDropdown = true;
  config.settings.defaultLanguage = 'en';
  config.settings.supportedLanguages = ['en', 'de', 'fr', 'es', 'it', 'pl'];

  // EEA customizations
  config.settings.eea = {
    ...(config.settings.eea || {}),
    languages: [
      { name: 'English', code: 'en' },
      { name: 'Deutsch', code: 'de' },
      { name: 'Français', code: 'fr' },
      { name: 'Español', code: 'es' },
      { name: 'Italiano', code: 'it' },
      { name: 'Polski', code: 'pl' },
    ],
    headerOpts: {
      ...(config.settings.eea?.headerOpts || {}),
      logo: ccaLogo,
      logoWhite: ccaLogoWhite,
    },
    subsiteHeaderOpts: [
      {
        matchpath: '/observatory',
        logoWhite: observatoryLogoWhite,
      },
    ],
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
        placeholder: 'Search the Observatory Resource Catalogue...',
        description: 'Looking for more information?',
        buttonTitle: 'Explore more on Climate-ADAPT',
        buttonUrl: 'https://climate-adapt.eea.europa.eu/en/data-and-downloads/',
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

  if (config.blocks.blocksConfig.layoutSettings) {
    config.blocks.blocksConfig.layoutSettings.blockHasOwnFocusManagement = false;
  }

  // Enable video
  if (config.blocks.blocksConfig.video) {
    config.blocks.blocksConfig.video.restricted = false;
  }

  // Disable blocks on Mission
  if (config.blocks.blocksConfig.countryFlag) {
    config.blocks.blocksConfig.countryFlag = {
      ...config.blocks.blocksConfig.countryFlag,
      restricted: ({ properties, block }) => {
        return blockAvailableInMission(properties, block);
      },
    };
  }

  const { facetWidgets } = config.blocks.blocksConfig.search.extensions;
  const { rewriteOptions } = facetWidgets;
  const origin_website_blacklist = ['AdapteCCA', 'DRMKC'];
  facetWidgets.rewriteOptions = (name, choices) => {
    let base = rewriteOptions(name, choices);
    if (name === 'origin_website') {
      base.forEach((pair) => {
        if (pair.value === 'Lancet Countdown') {
          pair.label = 'Lancet Countdown in Europe';
        }
        if (pair.value === 'C3S') {
          pair.label = 'Copernicus (C3S)';
        }
      });
      base = base.filter(
        (f) => origin_website_blacklist.indexOf(f.value) === -1,
      );
    }
    return base;
  };

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
    maxNumberOfColumns: 7,
  };

  config.blocks.blocksConfig.nextCloudVideo = {
    ...config.blocks.blocksConfig.nextCloudVideo,
    whiteList: [
      'https://cmshare.eea.europa.eu',
      'https://shareit.eea.europa.eu',
    ],
  };

  config.blocks.groupBlocksOrder.push({ id: 'site', title: 'Site' });

  config.views.contentTypesViews = {
    ...config.views.contentTypesViews,
    Event: EventView,
    'cca-event': CcaEventView,
    'eea.climateadapt.tool': DatabaseItemView,
    'eea.climateadapt.indicator': DatabaseItemView,
    'eea.climateadapt.organisation': DatabaseItemView,
    'eea.climateadapt.guidancedocument': DatabaseItemView,
    'eea.climateadapt.informationportal': DatabaseItemView,
    'eea.climateadapt.publicationreport': DatabaseItemView,
    'eea.climateadapt.video': DatabaseItemView,
    'eea.climateadapt.aceproject': ProjectView,
    'eea.climateadapt.casestudy': CaseStudyView,
    'eea.climateadapt.c3sindicator': C3SIndicatorView,
    'eea.climateadapt.adaptationoption': AdaptationOptionView,
    'News Item': NewsItemView,
  };

  config.views.layoutViewsNamesMapping.view_cca_event = 'CCA Event View';

  config.views.layoutViews = {
    ...config.views.layoutViews,
    document_view: DefaultView,
    album_view: DefaultView,
    summary_view: DefaultView,
    tabular_view: DefaultView,
  };

  config.settings.contextNavigationLocations = [
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
  ];

  config.settings.astNavigations = [
    {
      title: 'Urban adaptation support tool',
      root_path: 'knowledge/tools/urban-ast',
    },
    {
      title: 'Adaptation Suport Tool',
      root_path: 'knowledge/tools/adaptation-support-tool',
    },
  ];

  // Custom results
  config.settings.searchlib.resolve.HealthHorizontalCardItem = {
    component: HealthHorizontalCardItem,
  };

  // Custom widgets
  config.widgets.id.geochars = GeocharsWidget;
  config.widgets.id.geolocation = GeolocationWidget;

  if (config.widgets.views?.widget) {
    config.widgets.views.id.rast_steps = RASTWidgetView;
    config.widgets.views.widget.rast_steps = RASTWidgetView;
  }

  config.settings.slate.styleMenu.inlineStyles = [
    ...(config.settings.slate.styleMenu?.inlineStyles || []),
    { cssClass: 'large-text', label: 'Large text' },
    { cssClass: 'medium-text', label: 'Medium text' },
    { cssClass: 'small-text', label: 'Small text' },
  ];

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
    {
      path: `/(${config.settings?.supportedLanguages.join(
        '|',
      )})/observatory/sitemap`,
      component: Sitemap,
    },

    ...(config.addonRoutes || []),
  ];

  config.settings.appExtras = [
    ...(config.settings.appExtras || []),
    {
      match: '',
      component: MigrationButtons,
    },
    {
      match: '',
      component: TranslationDisclaimer,
    },
  ];

  config.settings.apiExpanders = [
    ...config.settings.apiExpanders,
    {
      match: {
        path: /(.*)\/policy-context\/country-profiles\/(.*)/,
      },
      GET_CONTENT: ['siblings'],
    },
  ];

  // plug custom redux middleware
  const storeExtender = (stack) => [langRedirection, ...stack];
  config.settings.storeExtenders = [
    storeExtender,
    ...config.settings.storeExtenders,
  ];

  return compose(installBlocks, installSearchEngine, installStore)(config);
};

export default applyConfig;
