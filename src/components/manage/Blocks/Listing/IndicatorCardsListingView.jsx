import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import cx from 'classnames';
import { ConditionalLink } from '@plone/volto/components';
import { flattenToAppURL, getBaseUrl } from '@plone/volto/helpers';
import './styles.less';

const fixedTitles = {
  C3S: 'Copernicus (C3S)',
  'Lancet Countdown': 'Lancet Countdown in Europe',
};

const fixTitle = (title) => {
  return fixedTitles[title] || title;
};

const IndicatorCardsListingView = ({ items, isEditMode, token }) => {
  return (
    <div className={cx('ui fluid indicatorCards')}>
      {items.map((item, index) => (
        <div
          className={cx('u-item listing-item simple-listing-item')}
          key={item['@id']}
        >
          <div className="wrapper">
            <div className="slot-top">
              <ConditionalLink
                to={flattenToAppURL(getBaseUrl(item['@id']))}
                condition={!isEditMode}
              >
                <div className="listing-body">
                  <h4 className={'listing-header'}>
                    {item.title ? item.title : item.id}
                  </h4>
                </div>
              </ConditionalLink>
            </div>
            <div className="simple-item-meta">
              <span className="text-left year">
                {item?.cca_published &&
                  new Date(item?.publication_date).getFullYear()}
              </span>
              <span className="text-left">
                {item &&
                  item.origin_website &&
                  item.origin_website.length > 0 &&
                  fixTitle(item?.origin_website[0]?.title)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

IndicatorCardsListingView.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  isEditMode: PropTypes.bool,
};

export default compose(
  connect((state) => ({
    token: state.userSession.token,
  })),
)(IndicatorCardsListingView);
