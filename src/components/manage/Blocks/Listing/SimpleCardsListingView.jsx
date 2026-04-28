import PropTypes from 'prop-types';
import {
  Image,
  Card,
  CardGroup,
  CardHeader,
  CardContent,
} from 'semantic-ui-react';
import { ConditionalLink } from '@plone/volto/components';

import './styles.less';

const SimpleCardsListingView = ({ items, isEditMode }) => {
  return (
    <CardGroup itemsPerRow={4} stackable>
      {items.map((item, index) => (
        <Card fluid className="u-card" key={index}>
          <div className="image">
            <div className="image">
              {item.image || item.logo ? (
                <Image
                  src={
                    item.image?.scales?.preview?.download ||
                    item.logo?.scales?.preview?.download
                  }
                  alt={item.title}
                  title={item.title}
                  style={{
                    objectFit: item.image ? 'cover' : 'contain',
                  }}
                />
              ) : (
                <div className="no-image-placeholder" />
              )}
            </div>
          </div>
          <CardContent>
            <CardHeader>
              <ConditionalLink
                to={item['@id']}
                className="header-link"
                title={item.title}
                condition={!isEditMode}
              >
                {item.title}
              </ConditionalLink>
            </CardHeader>
          </CardContent>
        </Card>
      ))}
    </CardGroup>
  );
};

SimpleCardsListingView.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  isEditMode: PropTypes.bool,
};

export default SimpleCardsListingView;
