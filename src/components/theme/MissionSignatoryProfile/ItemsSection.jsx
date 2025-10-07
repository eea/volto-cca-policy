import cx from 'classnames';
import { Item, Image } from 'semantic-ui-react';
import { normalizeImageFileName } from '@eeacms/volto-cca-policy/utils';
import defaultImage from '@eeacms/volto-cca-policy/../theme/assets/images/image-narrow.svg';

const ItemsSection = ({ items, field, iconPath }) => {
  if (!items?.length) return null;

  return (
    <Item.Group
      unstackable
      className={cx('items-group', { column: items.length > 3 })}
    >
      {items.map((item, index) => {
        const normalizedIcon = normalizeImageFileName(item.Icon);
        return (
          <Item key={index}>
            {item.Icon ? (
              <Image
                src={`/en/mission/icons/signatory-reporting/${iconPath}/${normalizedIcon}/@@images/image`}
              />
            ) : (
              <Image size="small" src={defaultImage} />
            )}
            <Item.Content verticalAlign="middle">
              <p>{item[field]}</p>
            </Item.Content>
          </Item>
        );
      })}
    </Item.Group>
  );
};

export default ItemsSection;
