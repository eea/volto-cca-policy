import React from 'react';
import PropTypes from 'prop-types';
import { observatoryURL } from './common';
import { makeContributionsSearchQuery } from '@eeacms/volto-cca-policy/helpers';

import './styles.less';
import { useIntl, defineMessages, FormattedMessage } from 'react-intl';

const messages = defineMessages({
  website: {
    id: 'Web site',
    defaultMessage: 'Web site',
  },
});

const OrganisationCardsListingView = ({ items }) => {
  const intl = useIntl();

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
                {intl.formatMessage(messages.website)}
              </a>
              <a
                className="header-link org-site"
                href={makeContributionsSearchQuery(item)}
              >
                <FormattedMessage
                  id="Observatory contributions"
                  defaultMessage="Observatory contributions"
                />
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

export default OrganisationCardsListingView;
