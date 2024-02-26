import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import cx from 'classnames';
import './styles.less';
import { ConditionalLink } from '@plone/volto/components';
import { Icon } from 'semantic-ui-react';
import { When } from '@plone/volto/components/theme/View/EventDatesInfo';
import { Card, Grid } from 'semantic-ui-react';

const StartDate = (start) => {
  const start_date = new Date(start);

  const day = start_date.getDate();
  const monthIndex = start_date.getMonth();

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const monthName = monthNames[monthIndex];

  const dayOfWeek = start_date.toLocaleDateString('en', { weekday: 'short' });

  return (
    <div className="start-date">
      <p className="day">{dayOfWeek}</p>
      <p className="date">
        {day}.{monthName}.
      </p>
    </div>
  );
};

const EventCardsListingView = ({ items, isEditMode, token }) => {
  return (
    <div className={cx('ui fluid eventCards')}>
      {items.map((item, index) => (
        <div
          className={cx('u-item listing-item simple-listing-item')}
          key={item['@id']}
        >
          <div className="wrapper">
            <Card fluid>
              <Card.Content>
                <Grid stackable columns={12}>
                  <Grid.Column width={2}>
                    {!!item.start && StartDate(item.start)}
                  </Grid.Column>
                  <Grid.Column width={10}>
                    <div className="event-details">
                      <h3 className={'listing-header'}>
                        <a href={item.event_url}>
                          {item.title ? item.title : item.id}
                        </a>
                      </h3>
                      <div className="listing-body-dates">
                        {!!item.start && (
                          <span className="event-date">
                            <Icon className="ri-calendar-line" />
                            <When
                              start={item.start}
                              end={item.end}
                              whole_day={true}
                              open_end={item.open_end}
                            />
                          </span>
                        )}
                      </div>
                      <div className="listing-body-dates">
                        {!!item['location'] && (
                          <span className="event-date">
                            <Icon className="map marker alternate" />
                            {item['location']}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className={'listing-description'}>
                          {item.description}
                        </p>
                      )}
                      <ConditionalLink item={item} condition={!isEditMode}>
                        Climate Adapt page for this event
                      </ConditionalLink>
                    </div>
                  </Grid.Column>
                </Grid>
              </Card.Content>
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
};

EventCardsListingView.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  isEditMode: PropTypes.bool,
};

export default compose(
  connect((state) => ({
    token: state.userSession.token,
  })),
)(EventCardsListingView);
