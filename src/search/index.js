import installMainSearch from './config';
import installHealthSearch from './health_observatory/config-health';
import installMissionStoriesSearch from './mission_stories/config-stories';
import installMissionProjectsSearch from './mission_projects/config-projects';

const extraQueryParams = {
  text_fields: [
    'title^4',
    'subject^1.5',
    'description^1.5',
    'all_fields_for_freetext',
  ],
  functions: [
    {
      exp: {
        'issued.date': {
          offset: '1800d',
          scale: '3600d',
        },
      },
    },
  ],
  score_mode: 'sum',
};

const applyConfig = (config) => {
  config.settings.searchlib = installHealthSearch(
    installMainSearch(config.settings.searchlib),
  );

  config.settings.searchlib = installMissionStoriesSearch(
    config.settings.searchlib,
  );

  config.settings.searchlib = installMissionProjectsSearch(
    installMainSearch(config.settings.searchlib),
  );

  config.settings.searchlib.searchui.ccaSearch.extraQueryParams = extraQueryParams;

  return config;
};
export default applyConfig;
