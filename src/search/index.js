import installMainSearch from './cca/config';
import installHealthSearch from './health_observatory/config-health';
import installMissionStoriesSearch from './mission_stories/config-stories';
import installMissionToolsSearch from './mission_tools/config-tools';
import installMissionProjectsSearch from './mission_projects/config-projects';
import installMissionFundingSearch from './mission_funding/config-funding';
import installMissionAllSearch from './mission_all/config-all';

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
  config.settings.searchlib = [
    installMainSearch,
    installHealthSearch,
    installMissionStoriesSearch,
    installMissionProjectsSearch,
    installMissionToolsSearch,
    installMissionFundingSearch,
    installMissionAllSearch,
  ].reduce((acc, cur) => cur(acc), config.settings.searchlib);

  const searchui = config.settings.searchlib.searchui;
  searchui.ccaSearch.extraQueryParams = extraQueryParams;
  searchui.ccaHealthSearch.extraQueryParams = extraQueryParams;
  searchui.missionProjects.extraQueryParams = extraQueryParams;
  searchui.missionStoriesSearch.extraQueryParams = extraQueryParams;
  searchui.missionToolsSearch.extraQueryParams = extraQueryParams;
  searchui.missionAll.extraQueryParams = extraQueryParams;

  console.log(config.settings.searchlib);

  return config;
};
export default applyConfig;
