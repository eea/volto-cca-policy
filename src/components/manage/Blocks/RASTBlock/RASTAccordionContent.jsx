import React from 'react';
import { List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { flattenToAppURL, getBaseUrl } from '@plone/volto/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { getContent } from '@plone/volto/actions';

import cx from 'classnames';

const RASTAccordionContent = (props) => {
  const { main, curent_location } = props;
  const dispatch = useDispatch();
  const location = main.url;
  let items = [];

  React.useEffect(() => {
    const action = getContent(location, null, location);
    dispatch(action);
  }, [location, dispatch]);

  items = useSelector(
    (state) => state.content?.subrequests?.[location]?.data?.items || [],
  );

  return (
    <div>
      {items.length
        ? items
            .filter((item) => item['@type'] === 'Folder')
            .map((item) => {
              const active = item['@id'].endsWith(curent_location.pathname);
              return (
                <List.Item
                  key={item.id}
                  className={cx('substep', {
                    active: active,
                  })}
                >
                  <Link to={flattenToAppURL(getBaseUrl(item['@id']))}>
                    {item.title}
                  </Link>
                </List.Item>
              );
            })
        : null}
    </div>
  );
};

export default compose()(RASTAccordionContent);
