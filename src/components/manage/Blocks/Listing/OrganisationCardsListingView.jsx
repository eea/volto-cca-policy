import React from 'react';
import PropTypes from 'prop-types';
import { observatoryURL } from './common';
import './styles.less';
import { useIntl, defineMessages, FormattedMessage } from 'react-intl';

// const messages = {
//   'Web site': defineMessages({
//     id: 'Web site',
//     defaultMessage: 'Web site',
//   }),
// };

const OrganisationCardsListingView = ({ items }) => {
  const contributionsURL = (item) => {
    const mapContributorValues = {
      'copernicus-climate-change-service-ecmw':
        'Copernicus Climate Change Service and Copernicus Atmosphere Monitoring Service',
      'european-centre-for-disease-prevention-and-control-ecdc':
        'European Centre for Disease Prevention and Control',
      'european-commission': 'European Commission',
      'european-environment-agency-eea': 'European Environment Agency',
      'european-food-safety-authority': 'European Food Safety Authority',
      'lancet-countdown': 'Lancet Countdown in Europe',
      'who-regional-office-for-europe-who-europe':
        'WHO Regional Office for Europe',
      'world-health-organization': 'World Health Organization',
      'association-schools-public-health-in-european-region-aspher':
        'The Association of Schools of Public Health in the European Region',
    };
    const org = mapContributorValues[item['@id'].split('/').pop()] || '';
    const query =
      'size=n_10_n' +
      '&filters[0][field]=cca_partner_contributors.keyword' +
      '&filters[0][values][0]=' +
      org +
      '&filters[0][type]=any' +
      '&filters[1][field]=issued.date' +
      '&filters[1][values][0]=Last 5 years' +
      '&filters[1][type]=any' +
      '&filters[2][field]=language' +
      '&filters[2][values][0]=en' +
      '&filters[2][type]=any' +
      '&sort-field=issued.date' +
      '&sort-direction=desc';

    return `/en/observatory/advanced-search?${query
      .replaceAll('[', '%5B')
      .replaceAll(']', '%5D')}`;
  };

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
                <FormattedMessage id="Web site" defaultMessage="Web site" />
              </a>
              <a className="header-link org-site" href={contributionsURL(item)}>
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
