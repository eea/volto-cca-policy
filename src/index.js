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

const applyConfig = (config) => {
  config.settings.dateLocale = 'en-gb';
  config.settings.isMultilingual = true;
  config.settings.defaultLanguage =
    config.settings.eea?.defaultLanguage || 'en';
  // config.settings.supportedLanguages = config.settings.eea?.languages?.map(
  //   (item) => item.code,
  // ) || ['en'];
  config.settings.supportedLanguages = ['en', 'de', 'fr', 'es', 'it'];

  // Enable volto-embed
  if (config.blocks.blocksConfig.maps) {
    config.blocks.blocksConfig.maps.restricted = false;
  }

  //console.log(config);
  config.views.contentTypesViews['eea.climateadapt.adaptationoption'] = AdaptationOptionView;
  config.views.contentTypesViews['eea.climateadapt.casestudy'] = CaseStudyView;
  config.views.contentTypesViews['eea.climateadapt.guidancedocument'] = GuidanceView;
  config.views.contentTypesViews['eea.climateadapt.indicator'] = IndicatorView;
  config.views.contentTypesViews['eea.climateadapt.informationportal'] = InformationPortalView;
  config.views.contentTypesViews['eea.climateadapt.organisation'] = OrganisationView;
  config.views.contentTypesViews['eea.climateadapt.aceproject'] = ProjectView;
  config.views.contentTypesViews['eea.climateadapt.publicationreport'] = PublicationReportView;
  config.views.contentTypesViews['eea.climateadapt.tool'] = ToolView;
  config.views.contentTypesViews['eea.climateadapt.video'] = VideoView;

  return config;
};

export default applyConfig;
