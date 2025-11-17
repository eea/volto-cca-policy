import PropTypes from 'prop-types';
import { CardGroup, CardHeader, CardContent, Card } from 'semantic-ui-react';

import './styles.less';

const OrganisationCardsListingView = ({ items }) => {
  return (
    <CardGroup itemsPerRow={4}>
      {items.map((item, index) => (
        <Card fluid className="u-card" key={index} href={item['@id']}>
          <CardContent>
            <CardHeader>
              <div className="image">
                <div className="img-container">
                  <img
                    src={item['@id'] + '/@@images/logo/preview'}
                    alt={item.title}
                    className="ui image"
                  ></img>
                </div>
              </div>
              <div className="card-title">{item.title}</div>
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
