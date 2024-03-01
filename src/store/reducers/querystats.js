import { GET_QUERY_STATS } from '../constants';

const initialState = {};

export default function querystats(state = initialState, action = {}) {
  switch (action.type) {
    case `${GET_QUERY_STATS}_PENDING`:
      return {
        ...state,
        [action.id]: {
          error: null,
          loaded: false,
          loading: true,
          items: {},
        },
      };
    case `${GET_QUERY_STATS}_SUCCESS`:
      return {
        ...state,
        [action.id]: {
          error: null,
          loaded: true,
          loading: false,
          items: action.result,
        },
      };
    case `${GET_QUERY_STATS}_FAIL`:
      return {
        ...state,
        [action.id]: {
          error: action.error,
          items: {},
          loaded: false,
          loading: false,
        },
      };
    default:
      return state;
  }
}
