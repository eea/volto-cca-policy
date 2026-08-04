import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { makeAdvancedSearchQuery } from '@eeacms/volto-cca-policy/helpers/search';

const LinkedMetadataItemList = (props) => {
  const { value, join_type, field, getSearchValue } = props; // contentType
  const intl = useIntl();

  const resolveSearchValue = (item) => {
    if (getSearchValue) return getSearchValue(item);
    return item.title || item;
  };

  const resolveLabel = (item) => {
    const label = item.title || item;
    return intl.formatMessage({ id: label, defaultMessage: label });
  };

  return value && value.length > 0 ? (
    <>
      {join_type ? (
        <>
          {value.map((item, index) => (
            <React.Fragment key={resolveSearchValue(item)}>
              <Link
                to={makeAdvancedSearchQuery({
                  field,
                  value: resolveSearchValue(item),
                  // contentType,
                })}
              >
                {resolveLabel(item)}
              </Link>
              {index !== value.length - 1 && (
                <span dangerouslySetInnerHTML={{ __html: join_type }} />
              )}
            </React.Fragment>
          ))}
        </>
      ) : (
        <p>
          {value.map((item, index) => (
            <React.Fragment key={resolveSearchValue(item)}>
              <Link
                to={makeAdvancedSearchQuery({
                  field,
                  value: resolveSearchValue(item),
                  // contentType,
                })}
              >
                {resolveLabel(item)}
              </Link>
              {index < value.length - 1 && ', '}
            </React.Fragment>
          ))}
        </p>
      )}
    </>
  ) : null;
};

export default LinkedMetadataItemList;
