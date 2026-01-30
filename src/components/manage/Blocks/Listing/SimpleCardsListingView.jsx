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
  // console.log('items', items);

  return (
    <CardGroup itemsPerRow={4} stackable>
      {items.map((item, index) => (
        <Card fluid className="u-card" key={index}>
          <div className="image">
            {item.image ? (
              <Image
                // src={item['@id'] + '/@@images/logo/preview'}
                src={item.image?.scales?.preview?.download}
                alt={item.title}
                title={item.title}
              />
            ) : (
              <div style={{ height: '120px', backgroundColor: '#f0f0f0' }} />
            )}
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
