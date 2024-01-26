import { GET_PHYSICAL_BREADCRUMBS } from '../constants';

export function getPhysicalBreadcrumbs(url) {
  return {
    type: GET_PHYSICAL_BREADCRUMBS,
    request: {
      op: 'get',
      path: `${url}/@physical-breadcrumbs`,
    },
  };
}
