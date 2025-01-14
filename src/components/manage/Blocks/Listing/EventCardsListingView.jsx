import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Card, Grid, Icon, Label } from 'semantic-ui-react';
import { useIntl, defineMessages, FormattedMessage } from 'react-intl';
import { ConditionalLink, UniversalLink } from '@plone/volto/components';
import { When } from '@plone/volto/components/theme/View/EventDatesInfo';
import './styles.less';

const Separator = () => {
  return <div className="sep">&nbsp;&nbsp;⎯&nbsp;&nbsp;</div>;
};

const messages = defineMessages({
  jan: { id: 'Jan', defaultMessage: 'Jan' },
  feb: { id: 'Feb', defaultMessage: 'Feb' },
  mar: { id: 'Mar', defaultMessage: 'Mar' },
  apr: { id: 'Apr', defaultMessage: 'Apr' },
  may: { id: 'May', defaultMessage: 'May' },
  jun: { id: 'Jun', defaultMessage: 'Jun' },
  jul: { id: 'Jul', defaultMessage: 'Jul' },
  aug: { id: 'Aug', defaultMessage: 'Aug' },
  sep: { id: 'Sep', defaultMessage: 'Sep' },
  oct: { id: 'Oct', defaultMessage: 'Oct' },
  nov: { id: 'Nov', defaultMessage: 'Nov' },
  dec: { id: 'Dec', defaultMessage: 'Dec' },

  mo: { id: 'Mo', defaultMessage: 'Mo' },
  tu: { id: 'Tu', defaultMessage: 'Tu' },
  we: { id: 'We', defaultMessage: 'We' },
  th: { id: 'Th', defaultMessage: 'Th' },
  fr: { id: 'Fr', defaultMessage: 'Fr' },
  sa: { id: 'Sa', defaultMessage: 'Sa' },
  su: { id: 'Su', defaultMessage: 'Su' },
});

const StartDate = (start) => {
  const start_date = new Date(start);

  const day = start_date.getDate();
  const monthIndex = start_date.getMonth();

  const intl = useIntl();
  const monthNames = [
    intl.formatMessage(messages.jan),
    intl.formatMessage(messages.feb),
    intl.formatMessage(messages.mar),
    intl.formatMessage(messages.apr),
    intl.formatMessage(messages.may),
    intl.formatMessage(messages.jun),
    intl.formatMessage(messages.jul),
    intl.formatMessage(messages.aug),
    intl.formatMessage(messages.sep),
    intl.formatMessage(messages.oct),
    intl.formatMessage(messages.nov),
    intl.formatMessage(messages.dec),
  ];

  const dayNames = {
    Mo: intl.formatMessage(messages.mo),
    Tu: intl.formatMessage(messages.tu),
    We: intl.formatMessage(messages.we),
    Th: intl.formatMessage(messages.th),
    Fr: intl.formatMessage(messages.fr),
    Sa: intl.formatMessage(messages.sa),
    Su: intl.formatMessage(messages.su),
  };

  const monthName = monthNames[monthIndex];

  const dayOfWeek =
    dayNames[
      start_date.toLocaleDateString('en', { weekday: 'short' }).substring(0, 2)
    ];

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
    return item['@id'];
  };

  return (
    <div className="ui fluid eventCards">
      {items.map((item, index) => (
        <div className="u-item listing-item simple-listing-item" key={item.UID}>
          <div className="wrapper">
            <Card fluid>
              <Card.Content>
                <Grid stackable columns={12}>
                  <Grid.Column width={2}>
                    {!!item.start && StartDate(item.start)}
                  </Grid.Column>
                  <Grid.Column width={10}>
                    <div className="event-details">
                      <h3 className="listing-header">
                        <UniversalLink href={event_url(item)}>
                          {item.title}
                        </UniversalLink>
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
                        <p className="listing-description">
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
                            <FormattedMessage
                              id="Climate-ADAPT page for this event"
                              defaultMessage="Climate-ADAPT page for this event"
                            />
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
