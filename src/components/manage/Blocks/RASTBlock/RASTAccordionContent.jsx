import React from 'react';
import { List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { flattenToAppURL, getBaseUrl } from '@plone/volto/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { getContent } from '@plone/volto/actions';

import { withContentNavigation } from '@plone/volto/components/theme/Navigation/withContentNavigation';

const RASTAccordionContent = (props) => {
  const { main, location } = props;
  // const items = props.navigation?.items;

  const dispatch = useDispatch();
  React.useEffect(() => {
    const action = getContent(location, null, location);
    dispatch(action);
  }, [location, dispatch]);

  const items = useSelector(
    (state) => state.content.subrequests?.[location]?.data?.items || [],
  );

  return (
    <div className="dataset-content">
      <div>
        <List.Item key={'0'}>
          <List.Content>
            <div className="dataset-item">
              <Link to={flattenToAppURL(getBaseUrl(main.href))}>
                {main.title}
              </Link>
            </div>
          </List.Content>
        </List.Item>
        {items.map((item) => (
          <List.Item key={item.id}>
            <List.Content>
              <div className="dataset-item">
                <Link to={flattenToAppURL(getBaseUrl(item['@id']))}>
                  {item.title}
                </Link>
              </div>
            </List.Content>
          </List.Item>
        ))}
      </div>
    </div>
  );
};

export default compose(withContentNavigation)(RASTAccordionContent);
