import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

const OrganisationCardsListingView = ({ items, isEditMode, token }) => {
  // console.log(items[0]);

  const observatoryURL = (item) => {
    return item.getURL.replace('/metadata/', '/observatory/++aq++metadata/');
  };
  return (
    <div className="ui fluid four cards">
      {items.map((item, index) => (
        <div className="ui fluid card u-card" key={item['@id']}>
          <div className="content">
            <div className="header">
              <a className="image" href={observatoryURL(item)}>
                <img
                  src={observatoryURL(item) + '/@@images/logo'}
                  alt={item.title}
                  className="ui image"
                ></img>
              </a>
              <a className="header-link" href={observatoryURL(item)}>
                {item.title}
              </a>
              <a className="header-link" href={observatoryURL(item)}>
                Web site
              </a>
              <a className="header-link" href={observatoryURL(item)}>
                Observatory contributions
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

OrganisationCardsListingView.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  isEditMode: PropTypes.bool,
};

export default compose(
  connect((state) => ({
    token: state.userSession.token,
  })),
)(OrganisationCardsListingView);
