import cx from 'classnames';
import { ConditionalLink } from '@plone/volto/components';
import { getBaseUrl } from '@plone/volto/helpers';
import { getVoltoStyles } from '@eeacms/volto-listing-block/schema-utils';

const getStyles = (props) => {
  const { itemModel = {} } = props;
  const res = {};
  if (itemModel.maxDescription) {
    res[`max-${itemModel.maxDescription}-lines`] = true;
  }
  if (itemModel.maxTitle) {
    res[`title-max-${itemModel.maxTitle}-lines`] = true;
  }
  return res;
};

const getItemHref = (item) => {
  const preservedHref = item?.linkHref || item?.linkWithHash;
  if (preservedHref) {
    return preservedHref;
  }
  return item?.['@id'] ? getBaseUrl(item['@id']) : undefined;
};

const BasicItem = (props) => {
  const { item, className, isEditMode = false } = props;
  const { hasMetaType } = props.itemModel;
  const styles = getStyles(props);
  const href = getItemHref(item);

  return (
    <div
      className={cx(
        'u-item listing-item simple-listing-item',
        getVoltoStyles(styles),
        className,
      )}
    >
      <div className="wrapper">
        <div className="slot-top">
          <ConditionalLink to={href} condition={!isEditMode && !!href}>
            <div className="listing-body">
              <p className="listing-header">
                {item.title ? item.title : item.id}
              </p>
            </div>
          </ConditionalLink>
        </div>
        <div className="simple-item-meta">
          {hasMetaType && (
            <span className="text-left">{item['type_title']}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export const SimpleItemLayout = (props) => {
  return <BasicItem {...props} />;
};
