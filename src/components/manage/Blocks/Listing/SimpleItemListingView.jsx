import PropTypes from 'prop-types';
import { ConditionalLink } from '@plone/volto/components';
import { getBaseUrl } from '@plone/volto/helpers';

const SimpleItemListingView = ({ items, isEditMode }) => {
  return (
    <>
      {items.map((item, index) => (
        <ConditionalLink
          to={getBaseUrl(item['@id'])}
          condition={!isEditMode}
          className="simple-listing-link"
          key={index}
        >
          <p className="simple-listing-item">
            {item.title ? item.title : item.id}
          </p>
        </ConditionalLink>
      ))}
    </>
  );
};

SimpleItemListingView.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  isEditMode: PropTypes.bool,
};

export default SimpleItemListingView;
