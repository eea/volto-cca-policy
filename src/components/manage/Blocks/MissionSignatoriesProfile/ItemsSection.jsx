import React from 'react';
import { Item, ItemGroup, ItemContent, Image } from 'semantic-ui-react';

import image from '@eeacms/volto-cca-policy/../theme//assets/images/image-narrow.svg';

const ItemsSection = ({ items }) => {
  return (
    <ItemGroup className="items-group">
      <Item>
        <Image size="small" src={image} />
        <ItemContent verticalAlign="middle">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </ItemContent>
      </Item>

      <Item>
        <Image size="small" src={image} />
        <ItemContent verticalAlign="middle">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </ItemContent>
      </Item>

      <Item>
        <Image size="small" src={image} />
        <ItemContent verticalAlign="middle">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </ItemContent>
      </Item>

      <Item>
        <Image size="small" src={image} />
        <ItemContent verticalAlign="middle">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </ItemContent>
      </Item>

      <Item>
        <Image size="small" src={image} />
        <ItemContent verticalAlign="middle">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </ItemContent>
      </Item>

      <Item>
        <Image size="small" src={image} />
        <ItemContent verticalAlign="middle">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </ItemContent>
      </Item>
    </ItemGroup>
  );
};

export default ItemsSection;
