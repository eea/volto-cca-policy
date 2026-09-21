import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { makeAdvancedSearchQuery } from '@eeacms/volto-cca-policy/search/queryUtils';

const LinkedMetadataItemList = (props) => {
  const {
    value,
    asInline = false,
    asList = false,
    field,
    getSearchValue,
  } = props; // contentType
  const intl = useIntl();

  const resolveSearchValue = (item) => {
    if (getSearchValue) return getSearchValue(item);
    return item.title || item;
  };

  const resolveLabel = (item) => {
    const label = item.title || item;
    return intl.formatMessage({ id: label, defaultMessage: label });
  };

  if (!value?.length) return null;

  const renderLink = (item) => (
    <Link
      key={resolveSearchValue(item)}
      to={makeAdvancedSearchQuery({
        field,
        value: resolveSearchValue(item),
        // contentType,
      })}
    >
      {resolveLabel(item)}
    </Link>
  );

  if (asList) {
    return (
      <div className="metadata-list" role="list">
        {value.map((item) => (
          <div key={resolveSearchValue(item)} role="listitem">
            {renderLink(item)}
          </div>
        ))}
      </div>
    );
  }

  const links = value.map((item, index) => (
    <React.Fragment key={resolveSearchValue(item)}>
      {renderLink(item)}
      {index < value.length - 1 && ', '}
    </React.Fragment>
  ));

  return asInline ? (
    <span className="metadata-inline">{links}</span>
  ) : (
    <p>{links}</p>
  );
};

export default LinkedMetadataItemList;
