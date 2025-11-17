import PropTypes from 'prop-types';
import { CardGroup, CardHeader, CardContent, Card } from 'semantic-ui-react';
import { UniversalLink } from '@plone/volto/components';

import './styles.less';

const OrganisationCardsListingView = ({ items }) => {
  return (
    <CardGroup itemsPerRow={4}>
      {items.map((item, index) => (
        <Card fluid className="u-card" key={index} href={item['@id']}>
          <CardContent>
            <CardHeader>
              <UniversalLink className="image">
                <div className="img-container">
                  <img
                    src={item['@id'] + '/@@images/logo/preview'}
                    alt={item.title}
                    className="ui image"
                  ></img>
                </div>
              </UniversalLink>
              <UniversalLink className="header-link org-name">
                {item.title}
              </UniversalLink>
            </CardHeader>
          </CardContent>
        </Card>
      ))}
    </CardGroup>
  );
};

OrganisationCardsListingView.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  isEditMode: PropTypes.bool,
};

export default OrganisationCardsListingView;
