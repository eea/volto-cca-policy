import physicalBreadcrumbs from './reducers/physical-breadcrumbs';
import querystats from './reducers/querystats';

export { getPhysicalBreadcrumbs } from './actions/physical-breadcrumbs';
export { getQueryStats } from './actions/querystats';

export default function installStore(config) {
  config.addonReducers = {
    ...config.addonReducers,
    physicalBreadcrumbs,
    querystats,
  };

  return config;
}
