import { useIntl } from 'react-intl';
import { TagOverflowPopup } from '@eeacms/volto-cca-policy/components';

const MetadataItemList = (props) => {
  const {
    value,
    asInline = false,
    asList = false,
    asTags = false,
    maxItems,
  } = props;
  const intl = useIntl();

  const items = value
    ?.map((item) => item?.title || item?.token || item)
    .filter(Boolean);

  if (!items?.length) return null;

  if (asList) {
    return (
      <div className="metadata-list" role="list">
        {items.map((item) => (
          <div key={item} role="listitem">
            {intl.formatMessage({ id: item, defaultMessage: item })}
          </div>
        ))}
      </div>
    );
  }

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
          <TagOverflowPopup
            items={hiddenItems.map((item) =>
              intl.formatMessage({ id: item, defaultMessage: item }),
            )}
            className="metadata-tag metadata-tag-more"
            ariaLabel={`Additional items: ${hiddenItems.join(', ')}`}
          />
        )}
      </div>
    );
  }

  const text = items
    .map((item) => intl.formatMessage({ id: item, defaultMessage: item }))
    .join(', ');

  return asInline ? (
    <span className="metadata-inline">{text}</span>
  ) : (
    <p>{text}</p>
  );
};

export default MetadataItemList;
