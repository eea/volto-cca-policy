import React from 'react';
import { useIntl } from 'react-intl';
import { Popup } from 'semantic-ui-react';

const MetadataItemList = (props) => {
  const { value, join_type, asTags = false, maxItems } = props;
  const intl = useIntl();

  const items = value
    ?.map((item) => item?.title || item?.token || item)
    .filter(Boolean);

  if (!items?.length) return null;

  const visibleItems = maxItems ? items.slice(0, maxItems) : items;
  const hiddenItems = items.slice(visibleItems.length);

  if (asTags) {
    return (
      <div className="metadata-tags">
        {visibleItems.map((item) => (
          <span className="metadata-tag" key={item}>
            {intl.formatMessage({ id: item, defaultMessage: item })}
          </span>
        ))}
        {hiddenItems.length > 0 && (
          <Popup
            className="catalogue-tag-popup"
            content={
              <div className="catalogue-tag-tooltip">
                <ul>
                  {hiddenItems.map((item) => (
                    <li key={`hidden-${item}`}>
                      {intl.formatMessage({ id: item, defaultMessage: item })}
                    </li>
                  ))}
                </ul>
              </div>
            }
            position="bottom left"
            trigger={
              <button
                type="button"
                className="metadata-tag metadata-tag-more"
                aria-label={`Additional items: ${hiddenItems.join(', ')}`}
              >
                + {hiddenItems.length}
              </button>
            }
          />
        )}
      </div>
    );
  }

  return (
    <>
      {join_type ? (
        <>
          {items.map((item, index) => (
            <React.Fragment key={item}>
              <span>
                {intl.formatMessage({
                  id: item,
                  defaultMessage: item,
                })}
              </span>
              {index !== items.length - 1 && (
                <span dangerouslySetInnerHTML={{ __html: join_type }} />
              )}
            </React.Fragment>
          ))}
        </>
      ) : (
        <p>
          {items
            .map((item) =>
              intl.formatMessage({
                id: item,
                defaultMessage: item,
              }),
            )
            .join(', ')}
        </p>
      )}
    </>
  );
};

export default MetadataItemList;
