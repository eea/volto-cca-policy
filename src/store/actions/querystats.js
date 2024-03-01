import { GET_QUERY_STATS } from '../constants';

export function getQueryStats(url, id, data) {
  return {
    type: GET_QUERY_STATS,
    id,
    request: {
      op: 'post',
      path: `${url}/@querystats`,
      data,
    },
  };
}
