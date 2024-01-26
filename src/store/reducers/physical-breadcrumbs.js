import { map } from 'lodash';
import { flattenToAppURL } from '@plone/volto/helpers';

import { GET_PHYSICAL_BREADCRUMBS } from '../constants';

const initialState = {
  error: null,
  items: [],
  root: null,
  loaded: false,
  loading: false,
};

export default function physicalBreadcrumbs(state = initialState, action = {}) {
  switch (action.type) {
    case `${GET_PHYSICAL_BREADCRUMBS}_PENDING`:
      return {
        ...state,
        error: null,
        loaded: false,
        loading: true,
      };
    case `${GET_PHYSICAL_BREADCRUMBS}_SUCCESS`:
      return {
        ...state,
        error: null,
        items: map(action.result.items, (item) => ({
          title: item.title,
          url: flattenToAppURL(item['@id']),
        })),
        root: flattenToAppURL(action.result.root),
        loaded: true,
        loading: false,
      };
    case `${GET_PHYSICAL_BREADCRUMBS}_FAIL`:
      return {
        ...state,
        error: action.error,
        items: [],
        loaded: false,
        loading: false,
      };
    default:
      return state;
  }
}
