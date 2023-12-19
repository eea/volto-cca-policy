import React from 'react';
import { List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { flattenToAppURL, getBaseUrl } from '@plone/volto/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { getContent } from '@plone/volto/actions';
// import useChildren from './RASTView';

const RASTAccordionContent = (props) => {
  const { main } = props;
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
  // const items = useChildren(location);

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
        {items.length
          ? items.map((item) => (
              <List.Item key={item.id}>
                <List.Content>
                  <div className="dataset-item">
                    <Link to={flattenToAppURL(getBaseUrl(item['@id']))}>
                      {item.title}
                    </Link>
                  </div>
                </List.Content>
              </List.Item>
            ))
          : null}
      </div>
    </div>
  );
};

export default compose()(RASTAccordionContent);
