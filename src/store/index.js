import physicalBreadcrumbs from './reducers/physical-breadcrumbs';
export { getPhysicalBreadcrumbs } from './actions/physical-breadcrumbs';

export default function installStore(config) {
  config.addonReducers.physicalBreadcrumbs = physicalBreadcrumbs;
  return config;
}
