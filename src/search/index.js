import installMainSearch from './config';
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
  config.settings.searchlib = installMainSearch(config.settings.searchlib);

  return config;
};

export default applyConfig;
