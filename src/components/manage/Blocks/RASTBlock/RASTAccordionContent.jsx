import { List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { flattenToAppURL, getBaseUrl } from '@plone/volto/helpers';

import { withContentNavigation } from '@plone/volto/components/theme/Navigation/withContentNavigation';

const RASTAccordionContent = (props) => {
  const { main } = props;
  const items = props.navigation?.items;

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
        {items
          ? items.map((item, index) => {
              return (
                <List.Item key={item.id}>
                  <List.Content>
                    <div className="dataset-item">
                      <Link to={flattenToAppURL(getBaseUrl(item['@id']))}>
                        {item.title}
                      </Link>
                      {/* <a
                        className="item-link"
                        href={item.href}
                        target="_self"
                        // rel="noreferrer"
                      >
                        {item.title}
                      </a> */}
                    </div>
                  </List.Content>
                </List.Item>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default compose(withContentNavigation)(RASTAccordionContent);
