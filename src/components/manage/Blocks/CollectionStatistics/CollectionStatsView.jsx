import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getQueryStats } from '@eeacms/volto-cca-policy/store';
import { getBaseUrl as getBase } from '@eeacms/volto-cca-policy/utils';
import { getBaseUrl } from '@plone/volto/helpers';
import { Icon, UniversalLink } from '@plone/volto/components';
import { Icon as UiIcon } from 'semantic-ui-react';
import config from '@plone/volto/registry';
import { useIntl } from 'react-intl';

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

export const StatVoltoIcon = ({ name, value, source, showLabel = false }) => {
  const intl = useIntl();
  const label = intl.formatMessage({ id: name, defaultMessage: name });

  return (
    <div className="tab-icon" title={label}>
      <div className="tab-icon-wrapper">
        {!source && name}
        {!!source && <Icon title={label} name={source} size="50" />}
        <span className="count">{value}</span>
      </div>
      {!!showLabel && <span className="label">{label}</span>}
    </div>
  );
};

export const RemixIcon = ({ name, value, source, showLabel = false }) => {
  const intl = useIntl();
  const label = intl.formatMessage({ id: name, defaultMessage: name });

  return (
    <div className="tab-icon semantic-icon" title={label}>
      <div className="tab-icon-wrapper">
        {!!source && <UiIcon title={label} name={source} />}
        <span className="count">{value}</span>
      </div>
      {!!showLabel && <span className="label">{label}</span>}
    </div>
  );
};

const makeSearchBlockQuery = ({ base, query = [], field, value }) => {
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

const makeEEASearchQuery = ({ base, field, value, extraFilters }) => {
  // TODO: don't hardcode the language
  const allFields = [
    // ['issued.date', 'Last 5 years'],
    ['language', 'en'],
    [field, value],
    ...(extraFilters?.map(({ id, value }) => [id, value]) || []),
  ];

  const rest = '&sort-field=issued.date&sort-direction=desc';

  // See FilterAceContentView
  const filters = allFields
    .map(([name, anyValue], index) =>
      [
        `filters[${index}][field]=${name}`,
        `filters[${index}][type]=any`,
        `filters[${index}][values][0]=${anyValue}`,
      ].join('&'),
    )
    .join('&');

  return `${base}?size=n_10_n&${filters}&${rest}`;
};

const urlBuilders = {
  SearchBlock: makeSearchBlockQuery,
  EEASemanticSearch: makeEEASearchQuery,
};

const nop = () => '';

function remapItemTypeValue(val) {
  const list = {
    'Publication and report': 'Publication reference',
    'Video and podcast': 'Video',
  };

  return list[val] || val;
}

function getActiveFilters(locationSearch) {
  try {
    const params = new URLSearchParams(locationSearch);
    const queryParam = params.get('query');
    if (!queryParam) return [];

    const parsed = JSON.parse(queryParam);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function isFilterActive(activeFilters, field, value) {
  return activeFilters.some(
    (f) =>
      f?.i === field &&
      Array.isArray(f?.v) &&
      f.v.includes(value) &&
      f?.o === 'plone.app.querystring.operation.selection.any',
  );
}

export default function CollectionStatsView(props) {
  const { id, data = {}, pathname = props.path } = props;
  const field =
    typeof data.aggregateField === 'string'
      ? data.aggregateField
      : data.aggregateField?.value;

  const { queryParameterStyle = 'SearchBlock', query = {}, showLabel } = data;
  const base = getBase(props);
  const location = useLocation();
  const activeFilters = React.useMemo(
    () => getActiveFilters(location.search),
    [location.search],
  );

  let stats = useStats(getBaseUrl(pathname), id, data);
  const intl = useIntl();

  const groupDefinition =
    config.blocks.blocksConfig.collectionStats?.groups?.[field] || {};
  const { cleanup, icons = {}, iconComponent: IconComponent } = groupDefinition;

  if (cleanup) stats = cleanup(stats);

  const keys = Object.keys(stats);
  const urlHandler = urlBuilders[queryParameterStyle] || nop;
  const extraFilters = data?.extraFilters || [];

  return (
    (field && keys.length > 0 && IconComponent && (
      <div className="collection-stats">
        {keys
          .sort((a, b) => a.localeCompare(b))
          .map((k) => {
            const kV = remapItemTypeValue(k);
            const currentField = groupDefinition.searchFieldName || field;
            const currentValue = intl.formatMessage({
              id: kV,
              defaultMessage: kV,
            });

            const href = urlHandler({
              base,
              query: query.query,
              field: currentField,
              value: currentValue,
              extraFilters,
            });

            const active = isFilterActive(
              activeFilters,
              currentField,
              currentValue,
            );

            return (
              <UniversalLink
                className={`tab-item-link ${active ? 'active' : ''}`}
                key={k}
                href={href}
              >
                <IconComponent
                  name={k}
                  value={stats[k]}
                  field={field}
                  source={icons[k]}
                  showLabel={showLabel}
                />
              </UniversalLink>
            );
          })}
      </div>
    )) ||
    'no results'
  );
}
