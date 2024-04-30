import installMainSearch from './config';
import installHealthSearch from './health_observatory/config-health';
import installMissionStoriesSearch from './mission_stories/config-stories';
import installMissionProjectsSearch from './mission_projects/config-projects';
import installMissionToolsSearch from './mission_tools/config-tools';

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

  config.settings.searchlib = installMissionToolsSearch(
    installMainSearch(config.settings.searchlib),
  );

  config.settings.searchlib.searchui.ccaSearch.extraQueryParams = extraQueryParams;
  config.settings.searchlib.searchui.ccaHealthSearch.extraQueryParams = extraQueryParams;
  config.settings.searchlib.searchui.missionProjects.extraQueryParams = extraQueryParams;
  config.settings.searchlib.searchui.missionStoriesSearch.extraQueryParams = extraQueryParams;
  config.settings.searchlib.searchui.missionToolsSearch.extraQueryParams = extraQueryParams;

  return config;
};
export default applyConfig;
