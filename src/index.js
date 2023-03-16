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
      contacts: [
        {
          icon: 'comment outline',
          text: 'About us',
          link: '/about',
          children: [],
        },
        {
          icon: 'comment outline',
          text: 'Contact us',
          link: '/contact-us',
        },
        // {
        //   icon: 'envelope outline',
        //   text: 'Sign up to our newsletter',
        //   link: '/newsletter',
        // },
      ],
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
    'eea.climateadapt.c3sindicator': C3SIndicatorView,
  };

  config.settings.contextNavigationLocations = [
    {
      title: 'Regional Adaptation Tool',
      columns: 4,
      topLevel: 2,
      bottomLevel: 0,
      rootPath:
        '/mission-knowledge-hub/adaptation-knowledge-data/regional-adaptation-support-tool',
    },
    {
      title: 'UrbanAST',
      topLevel: 3,
      bottomLevel: 2,
      rootPath: '/knowledge/tools/urban-ast',
    },
    {
      title: 'Adaptation Suport Tool',
      topLevel: 3,
      bottomLevel: 2,
      rootPath: '/knowledge/tools/adaptation-support-tool',
    },
  ];

  // we won't need the listing for Folders
  delete config.views.layoutViews.listing_view;

  if (__SERVER__) {
    const installExpressMiddleware = require('./express-middleware').default;
    config = installExpressMiddleware(config);
  }

  return installBlocks(config);
};

export default applyConfig;
