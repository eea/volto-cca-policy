import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import './styles.less';

const OrganisationCardsListingView = ({ items, isEditMode, token }) => {
  const observatoryURL = (item) => {
    return item['@id'].replace('/metadata/', '/observatory/++aq++metadata/');
  };

  const contributionsURL = (item) => {
    const mapContributorValues = {
      'copernicus-climate-change-service-ecmw':
        'Copernicus Climate Change Service and Copernicus Atmosphere Monitoring Service',
      'european-centre-for-disease-prevention-and-control-ecdc':
        'European Centre for Disease Prevention and Control',
      'european-commission': 'European Commission',
      'european-environment-agency-eea': 'European Environment Agency',
      'european-food-safety-authority': 'European Food Safety Authority',
      'lancet-countdown': 'Lancet Countdown',
      'who-regional-office-for-europe-who-europe':
        'WHO Regional Office for Europe',
      'world-health-organization': 'World Health Organization',
    };
    const org = mapContributorValues[item['@id'].split('/').pop()] || '';
    const query = {
      query: {
        function_score: {
          query: {
            bool: {
              filter: {
                bool: {
                  should: [{ term: { partner_contributors: org } }],
                },
              },
            },
          },
        },
      },
    };

    const encodedQuery = encodeURIComponent(JSON.stringify(query));
    return `/en/observatory/catalogue/?source=${encodedQuery}`;
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
              <a className="header-link org-name" href={observatoryURL(item)}>
                {item.title}
              </a>
              <a
                className="header-link org-site"
                href={item.websites?.[0] ?? '#'}
              >
                Web site
              </a>
              <a className="header-link org-site" href={contributionsURL(item)}>
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
