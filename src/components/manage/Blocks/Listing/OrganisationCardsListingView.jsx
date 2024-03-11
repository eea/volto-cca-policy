import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { observatoryURL } from './common';
import { makeContributionsSearchQuery } from '@eeacms/volto-cca-policy/helpers';

import './styles.less';

const OrganisationCardsListingView = ({ items }) => {
  return (
    <div className="ui fluid four cards">
      {items.map((item, index) => (
        <div className="ui fluid card u-card" key={item['@id']}>
          <div className="content">
            <div className="header">
              <a className="image" href={observatoryURL(item)}>
                <div className="img-container">
                  <img
                    src={item['@id'] + '/@@images/logo/preview'}
                    alt={item.title}
                    className="ui image"
                  ></img>
                </div>
              </a>
              <a className="header-link org-name" href={observatoryURL(item)}>
                {item.title}
              </a>
              <a
                className="header-link org-site"
                href={item.websites?.[0] ?? '#'}
              >
                Web site
              </a>
              <a
                className="header-link org-site"
                href={makeContributionsSearchQuery(item)}
              >
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
