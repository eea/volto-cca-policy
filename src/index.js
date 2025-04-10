import { defineMessages, FormattedMessage } from 'react-intl';
import loadable from '@loadable/component';
import { compose } from 'redux';
import { Sitemap } from '@plone/volto/components';
import DefaultView from '@plone/volto/components/theme/View/DefaultView';
import SelectAutoCompleteWidget from '@plone/volto/components/manage/Widgets/SelectAutoComplete';
import {
  RASTWidgetView,
  TranslationDisclaimer,
  RedirectToLogin,
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
import PromotionalImageWidget from './components/theme/Widgets/PromotionalImageWidget';
import MigrationButtons from './components/MigrationButtons';
import HealthHorizontalCardItem from './components/Result/HealthHorizontalCardItem';
import ClusterHorizontalCardItem from './components/Result/ClusterHorizontalCardItem';

import { langRedirection } from './store/middleware';

import installBlocks from './components/manage/Blocks';
import installSearchEngine from './search';
import installStore from './store';

import ccaLogo from '@eeacms/volto-cca-policy/../theme/assets/images/Header/Climate_ADAPT_logo.svg';
import ccaLogoWhite from '@eeacms/volto-cca-policy/../theme/assets/images/Header/Climate_ADAPT_logo_white.svg';
import observatoryLogoWhite from '@eeacms/volto-cca-policy/../theme/assets/images/Header/Climate_and_health_logo_white.svg';
import europeanComissionLogo from '@eeacms/volto-cca-policy/../theme/assets/images/Footer/ec_logo.svg';
import eeaWhiteLogo from '@eeacms/volto-eea-design-system/../theme/themes/eea/assets/logo/eea-logo-white.svg';

import './slate-styles.less';
import BrokenLinks from './components/theme/Views/BrokenLinks';

const getEnv = () => (typeof window !== 'undefined' ? window.env : process.env);

const pathToNegRegex = (p) => `(?!(${p}))`;

const messages = defineMessages({
  placeholderClimateSearch: {
    id: 'Search the Climate-ADAPT database',
    defaultMessage: 'Search the Climate-ADAPT database',
  },
  placeholderObservatorySearch: {
    id: 'Search the Observatory Resource Catalogue...',
    defaultMessage: 'Search the Observatory Resource Catalogue...',
  },
  placeholderMissionSearch: {
    id: 'Search the EU Mission on Adaptation',
    defaultMessage: 'Search the EU Mission on Adaptation',
  },
});

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
          exact: false,
          path: new RegExp(voltoLocationsRegex),
          strict: false,
        },
        url(payload) {
          return payload.location.pathname;
        },
      },
    ];
  }

  config.settings.allowed_cors_destinations = [
    ...(config.settings.allowed_cors_destinations || []),
    'nominatim.openstreetmap.org',
  ];

  if (!config.settings.loadables.reactTable)
    config.settings.loadables.reactTable = loadable.lib(() =>
      import('@tanstack/react-table'),
    );

  config.settings.dateLocale = 'en-gb';
  config.settings.isMultilingual = true;
  config.settings.hasLanguageDropdown = true;
  config.settings.defaultLanguage = 'en';
  config.settings.supportedLanguages = [
    'en',
    'de',
    'fr',
    'es',
    'it',
    'pl',
    'el',

    'bg',
    'cs',
    'da',
    // 'de',
    // 'el',
    // 'es',
    'et',
    'fi',
    // 'fr',
    'ga',
    'hr',
    'hu',
    // 'it',
    'lt',
    'lv',
    'mt',
    'nl',
    // 'pl',
    'pt',
    'sk',
    'sl',
    'sv',
  ];

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

      { name: 'български', code: 'bg' },
      { name: 'Čeština', code: 'cs' },
      { name: 'Dansk', code: 'da' },
      { name: 'Eesti keel', code: 'et' },
      { name: 'Ελληνικά', code: 'el' },
      { name: 'Hrvatski', code: 'hr' },
      { name: 'Latviešu valoda', code: 'lv' },
      { name: 'Lietuvių kalba', code: 'lt' },
      { name: 'Magyar', code: 'hu' },
      { name: 'Malti', code: 'mt' },
      { name: 'Nederlands', code: 'nl' },
      { name: 'Português', code: 'pt' },
      { name: 'Română', code: 'ro' },
      { name: 'Slovenčina', code: 'sk' },
      { name: 'Slovenščina', code: 'sl' },
      { name: 'Suomi', code: 'fi' },
      { name: 'Svenska', code: 'sv' },
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
        matchpath: /\/([a-z]{2})\/mission/,
        path: ({ currentLang }) => `/${currentLang}/mission/advanced-search`,
        placeholder: ({ intl }) =>
          intl.formatMessage(messages.placeholderMissionSearch),
        description: (
          <FormattedMessage
            id="For more search options"
            defaultMessage="For more search options"
          />
        ),
        buttonTitle: (
          <FormattedMessage
            id="Go to advanced search"
            defaultMessage="Go to advanced search"
          />
        ),
        buttonUrl: ({ currentLang }) =>
          `/${currentLang}/mission/advanced-search/`,
      },
      {
        isDefault: false,
        // to replace search path change path to whatever you want and match with the page in volto website
        matchpath: /\/([a-z]{2})\/observatory/,
        path: ({ currentLang }) =>
          `/${currentLang}/observatory/advanced-search`,
        placeholder: ({ intl }) =>
          intl.formatMessage(messages.placeholderObservatorySearch),
        description: (
          <FormattedMessage
            id="Looking for more information?"
            defaultMessage="Looking for more information?"
          />
        ),
        buttonTitle: (
          <FormattedMessage
            id="Explore more on Climate-ADAPT"
            defaultMessage="Explore more on Climate-ADAPT"
          />
        ),
        buttonUrl: ({ currentLang }) => `/${currentLang}/data-and-downloads/`,
      },
      {
        isDefault: true,
        // to replace search path change path to whatever you want and match with the page in volto website
        matchpath: '/',
        path: ({ currentLang }) => `/${currentLang}/data-and-downloads`,
        placeholder: ({ intl }) =>
          intl.formatMessage(messages.placeholderClimateSearch),
        description: (
          <FormattedMessage
            id="Looking for more information?"
            defaultMessage="Looking for more information?"
          />
        ),
        buttonTitle: (
          <FormattedMessage
            id="Explore more on Climate-ADAPT"
            defaultMessage="Explore more on Climate-ADAPT"
          />
        ),
        buttonUrl: ({ currentLang }) => `/${currentLang}/data-and-downloads/`,
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
  config.settings.searchlib.resolve.ClusterHorizontalCardItem = {
    component: ClusterHorizontalCardItem,
  };
  // Custom widgets
  config.widgets.id.geochars = GeocharsWidget;
  config.widgets.id.geolocation = GeolocationWidget;
  config.widgets.id.promotional_image = PromotionalImageWidget;

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

  // TODO: fix in all languages
  config.settings.menuItemsLayouts = {
    '/en/countries-regions': {
      menuItemColumns: [
        'three wide column',
        'six wide column',
        'three wide column',
      ],
      menuItemChildrenListColumns: [1, 4, 1],
    },
    '/en/eu-policy': {
      menuItemColumns: [
        'two wide column',
        'two wide column',
        'six wide column',
        'two wide column',
      ],
      menuItemChildrenListColumns: [1, 1, 3, 1],
    },
    '/en/observatory/evidence': {
      menuItemColumns: [
        'six wide column',
        'two wide column',
        'two wide column',
        'two wide column',
      ],
      menuItemChildrenListColumns: [2, 1, 1, 1],
    },
  };

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

    {
      path: `/broken-links`,
      component: BrokenLinks,
    },

    ...(config.addonRoutes || []),
  ];

  config.settings.nonContentRoutes = [
    ...config.settings.nonContentRoutes,
    '/broken-links',
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
    {
      match: {
        path: /(.*)\/add$/,
      },
      component: RedirectToLogin,
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
    {
      match: {
        path: /(.*)\/countries-regions\/countries\/(.*)/,
      },
      GET_CONTENT: ['siblings'],
    },
    {
      match: '',
      GET_CONTENT: ['navigation', 'breadcrumbs', 'actions'],
      querystring: { 'expand.navigation.depth': '3' },
    },
  ];

  // plug custom redux middleware
  const storeExtender = (stack) => [langRedirection, ...stack];
  config.settings.storeExtenders = [
    storeExtender,
    ...config.settings.storeExtenders,
  ];

  config.widgets.vocabulary[
    'plone.app.vocabularies.Users'
  ] = SelectAutoCompleteWidget;

  return compose(installBlocks, installSearchEngine, installStore)(config);
};

export default applyConfig;
