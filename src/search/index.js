import installMainSearch from './config';
import installHealthSearch from './health_observatory/config-health';
import installMissionStoriesSearch from './mission_stories/config-stories';
import installMissionProjectsSearch from './mission_projects/config-projects';

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

  return config;
};

export default applyConfig;
