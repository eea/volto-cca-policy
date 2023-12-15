import installMainSearch from './config';
import installHealthSearch from './config-health';
import installMissionStoriesSearch from './config-mission-stories';

// import DatahubCardItem from './components/Result/DatahubCardItem';
// import DatahubItemView from './components/ItemView/ItemView';
//
// import { DatahubResultModel } from './config/models';
//
// import { datahub_results } from './store';

// function tweakForNLPService(body, config) {
//   if (!config.enableNLP) {
//     delete body.source;
//     delete body.index;
//     return body;
//   }
//   return body;
// }

const applyConfig = (config) => {
  config.settings.searchlib = installHealthSearch(
    installMainSearch(config.settings.searchlib),
  );
  config.settings.searchlib = installMissionStoriesSearch(
    config.settings.searchlib,
  );
  return config;
};

export default applyConfig;
