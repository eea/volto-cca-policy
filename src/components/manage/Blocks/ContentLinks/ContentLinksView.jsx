import React from 'react';
import { List } from 'semantic-ui-react';
import { Link, useLocation } from 'react-router-dom';
import { flattenToAppURL } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import cx from 'classnames';

import './style.less';

const DefaultBody = (props) => {
  const location = useLocation();
  const { title, items = [], variation } = props;
  return (
    <div className={`block content-links ${variation}-view`}>
      {title && <h4>{title}</h4>}

      <List className="content-items">
        {items.map((item, index) => {
          const link = item?.source?.[0]?.['@id'];
          const active = location.pathname === link;
          return (
            <List.Item
              key={index}
              className={cx({
                active: active,
              })}
            >
              <Link to={flattenToAppURL(link)}>{item.item_title}</Link>
            </List.Item>
          );
        })}
      </List>
    </div>
  );
};

const ContentLinksView = (props) => {
  const { data, mode = 'view' } = props;
  const { title, items = [], variation, placeholder_text } = data;
  const isEdit = mode === 'edit';
  const activeTemplate = config.blocks.blocksConfig[
    'contentLinks'
  ].variations.filter((v, _i) => v.id === variation);

  const BodyComponent = activeTemplate?.[0]?.view || DefaultBody;

  return items && items.length > 0 ? (
    <BodyComponent
      title={title}
      variation={variation}
      items={items}
      placeholder_text={placeholder_text}
    />
  ) : (
    <>{isEdit && <div>No items</div>}</>
  );
};

export default ContentLinksView;
