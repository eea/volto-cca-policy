import React from 'react';
import PropTypes from 'prop-types';
import { UniversalLink } from '@plone/volto/components';
import { useIntl, defineMessages, FormattedMessage } from 'react-intl';
import { makeContributionsSearchQuery } from '@eeacms/volto-cca-policy/helpers';

import './styles.less';

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
        <div className="ui fluid card u-card" key={index}>
          <div className="content">
            <div className="header">
              <UniversalLink className="image" href={item['@id']}>
                <div className="img-container">
                  <img
                    src={item['@id'] + '/@@images/logo/preview'}
                    alt={item.title}
                    className="ui image"
                  ></img>
                </div>
              </UniversalLink>
              <UniversalLink
                className="header-link org-name"
                href={item['@id']}
              >
                {item.title}
              </UniversalLink>
              <UniversalLink
                className="header-link org-site"
                href={item.websites?.[0] ?? '#'}
              >
                {intl.formatMessage(messages.website)}
              </UniversalLink>
              <UniversalLink
                className="header-link org-site"
                href={makeContributionsSearchQuery(item)}
              >
                <FormattedMessage
                  id="Observatory contributions"
                  defaultMessage="Observatory contributions"
                />
              </UniversalLink>
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
