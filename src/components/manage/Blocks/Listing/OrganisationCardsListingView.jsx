import PropTypes from 'prop-types';
import {
  CardGroup,
  CardHeader,
  CardContent,
  CardDescription,
  Card,
} from 'semantic-ui-react';

import './styles.less';

const OrganisationCardsListingView = ({ items }) => {
  return (
    <CardGroup itemsPerRow={4} stackable>
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
                  />
                </div>
              </div>
            </CardHeader>
            <CardDescription>
              <h5 className="card-title">{item.title}</h5>
            </CardDescription>
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
