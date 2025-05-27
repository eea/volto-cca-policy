import { GET_QUERY_STATS } from '../constants';

export function getQueryStats(url, id, data) {
  const query = encodeURIComponent(JSON.stringify(data));
  return {
    type: GET_QUERY_STATS,
    id,
    request: {
      op: 'get',
      path: `${url}/@querystats?query=${query}`,
    },
  };
}
