import React from 'react';
import { List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { flattenToAppURL } from '@plone/volto/helpers';
import { ShareInfoButton } from '@eeacms/volto-cca-policy/components';
import cx from 'classnames';

import './style.less';

const ContentLinksView = (props) => {
  const location = useLocation();
  const { data, mode = 'view' } = props;
  const { title, items = [], show_share_btn, variation } = data;
  const isEdit = mode === 'edit';

  return items && items.length > 0 ? (
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

      {show_share_btn && <ShareInfoButton />}
    </div>
  ) : (
    <>{isEdit && <div>No items</div>}</>
  );
};

export default ContentLinksView;
