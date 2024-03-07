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
import { Label } from 'semantic-ui-react';

const Separator = () => {
  return <div className="sep">&nbsp;&nbsp;⎯&nbsp;&nbsp;</div>;
};

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

  const dayOfWeek = start_date
    .toLocaleDateString('en', { weekday: 'short' })
    .substring(0, 2);

  return (
    <div className="start-date">
      <p className="day">{dayOfWeek}</p>
      <p className="date">
        {day} {monthName}
      </p>
    </div>
  );
};

const EventCardsListingView = ({ items, isEditMode, token }) => {
  const go_to_contact = (contact_info) => {
    if (contact_info.includes('@')) {
      return `mailto:${contact_info}`;
    }
    return contact_info;
  };

  const event_url = (item) => {
    if (!!item.event_url) {
      return item.event_url;
    }
    return item.id;
  };

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
                        <a href={event_url(item)}>
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
                      <div className="bottom-info">
                        {!!item.subjects && item.subjects.length > 0 && (
                          <>
                            <div className="subjects">
                              {item.subjects.map((tag) => (
                                <Label key={tag} size="small">
                                  {tag}
                                </Label>
                              ))}
                            </div>

                            <Separator />
                          </>
                        )}
                        <div className="source">
                          <ConditionalLink item={item} condition={!isEditMode}>
                            Climate-ADAPT page for this event
                          </ConditionalLink>
                        </div>
                        {!!item.contact_email && (
                          <>
                            <Separator />
                            <div className="email-info">
                              <Icon className="mail" />
                              <a
                                className="contact_email"
                                title=""
                                href={go_to_contact(item.contact_email)}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {item.contact_email}
                              </a>
                            </div>
                          </>
                        )}
                      </div>
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
