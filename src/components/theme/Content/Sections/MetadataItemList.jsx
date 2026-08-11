import React from 'react';
import { useIntl } from 'react-intl';

const MetadataItemList = (props) => {
  const { value, join_type } = props;
  const intl = useIntl();

  return value && value.length > 0 ? (
    <>
      {join_type ? (
        <>
          {value.map((item, index) => (
            <React.Fragment key={item.token || item.title}>
              <span>
                {intl.formatMessage({
                  id: item.title,
                  defaultMessage: item.title,
                })}
              </span>
              {index !== value.length - 1 && (
                <span dangerouslySetInnerHTML={{ __html: join_type }} />
              )}
            </React.Fragment>
          ))}
        </>
      ) : (
        <p>
          {value
            .map((item) => item.title)
            .map((title) =>
              intl.formatMessage({
                id: title,
                defaultMessage: title,
              }),
            )
            .join(', ')}
        </p>
      )}
    </>
  ) : null;
};

export default MetadataItemList;
