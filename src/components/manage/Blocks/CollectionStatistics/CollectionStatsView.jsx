import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getQueryStats } from '@eeacms/volto-cca-policy/store';
import { getBaseUrl as getBase } from '@eeacms/volto-cca-policy/utils';
import { getBaseUrl } from '@plone/volto/helpers';
import { Icon } from '@plone/volto/components';
import { Icon as UiIcon } from 'semantic-ui-react';
import config from '@plone/volto/registry';

import qs from 'query-string';
import './styles.less';

const useStats = (path, id, data) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getQueryStats(path, id, data));
  }, [path, id, data, dispatch]);

  const stats = useSelector((store) => store.querystats?.[id]?.items || {});

  return stats;
};

export const StatVoltoIcon = ({ name, value, source }) => {
  return (
    <div className="tab-icon" title={value}>
      {!source && name}
      {!!source && <Icon className="small" title={name} name={source} />}
      <span className="count">{value}</span>
    </div>
  );
};

export const RemixIcon = ({ name, value, source }) => {
  console.log('source', source);
  return (
    <div className="tab-icon" title={value}>
      {!!source && <UiIcon className="small" title={name} name={source} />}
      <span className="count">{value}</span>
    </div>
  );
};

const makeSearchBlockQuery = ({ base, query, field, value }) => {
  const filtered = [
    ...query.filter(({ i }) => i !== field),
    {
      i: field,
      o: 'plone.app.querystring.operation.selection.any',
      v: [value],
    },
  ];
  const params = qs.stringify({ query: JSON.stringify(filtered) });

  return `${base}?${params}`;
};

const makeEEASearchQuery = ({ base, query, field, value }) => {
  const arr = [{ field, type: 'any', values: [value] }];
  console.log(qs.stringify(arr));

  return '';
};

const urlBuilders = {
  SearchBlock: makeSearchBlockQuery,
  EEASemanticSearch: makeEEASearchQuery,
};

const nop = () => '';

export default function CollectionStatsView(props) {
  const { id, data = {}, pathname = props.path } = props;
  const field = data.aggregateField?.value;
  const { queryParameterStyle = 'SearchBlock', query = {} } = data;
  const base = getBase(props);
  let stats = useStats(getBaseUrl(pathname), id, data);

  const groupDefinition =
    config.blocks.blocksConfig.collectionStats.groups[field] || {};
  const { cleanup, icons = {}, iconComponent: IconComponent } = groupDefinition;

  if (cleanup) stats = cleanup(stats);

  const keys = Object.keys(stats);
  const urlHandler = urlBuilders[queryParameterStyle] || nop;

  return (
    (field && keys.length > 0 && (
      <div className="collection-stats">
        {keys.sort().map((k) => (
          <a
            key={k}
            href={urlHandler({
              base,
              query: query.query,
              field,
              value: k,
            })}
          >
            <IconComponent
              name={k}
              value={stats[k]}
              field={field}
              source={icons[k]}
            />
          </a>
        ))}
      </div>
    )) ||
    'no results'
  );
}
