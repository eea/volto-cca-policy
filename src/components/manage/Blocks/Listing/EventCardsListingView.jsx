import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Card, Grid, Icon, Label, Image } from 'semantic-ui-react';
import { useIntl, defineMessages, FormattedMessage } from 'react-intl';
import { ConditionalLink, UniversalLink } from '@plone/volto/components';
import { When } from '@plone/volto/components/theme/View/EventDatesInfo';
import eeaLogo from '@eeacms/volto-cca-policy/../theme/assets/images/eea-logo.svg';
import config from '@plone/volto/registry';
import './styles.less';

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

const StartDate = ({ start }) => {
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
      <p className="date">{`${day} ${monthName}`}</p>
    </div>
  );
};

const goToContact = (contactInfo) =>
  contactInfo.includes('@') ? `mailto:${contactInfo}` : contactInfo;

const getEventUrl = (item) => item?.event_url || item['@id'];

const EventCard = ({ item, isEditMode }) => (
  <div className="u-item listing-item simple-listing-item" key={item.UID}>
    <div className="wrapper">
      <Card fluid>
        <Card.Content>
          <Grid stackable columns={12}>
            <Grid.Column width={2}>
              {item?.start && <StartDate start={item.start} />}
            </Grid.Column>
            <Grid.Column width={10}>
              <div className="event-details">
                <h3 className="listing-header">
                  <UniversalLink href={getEventUrl(item)}>
                    {item.title}
                  </UniversalLink>
                </h3>
                <EventDetails item={item} isEditMode={isEditMode} />
              </div>
            </Grid.Column>
          </Grid>
        </Card.Content>
      </Card>
    </div>
  </div>
);

const EventDetails = ({ item, isEditMode }) => (
  <>
    {item?.start && (
      <div className="listing-body-dates">
        <span className="event-date">
          <Icon className="ri-calendar-line" />
          <When
            whole_day
            start={item.start}
            end={item.end}
            open_end={item.open_end}
          />
        </span>
      </div>
    )}
    {item?.location && (
      <div className="listing-body-dates">
        <span className="event-date">
          <Icon className="map marker alternate" />
          {item.location}
        </span>
      </div>
    )}
    {item?.description && (
      <p className="listing-description">{item.description}</p>
    )}
    <BottomInfo item={item} isEditMode={isEditMode} />
  </>
);

const BottomInfo = ({ item, isEditMode }) => {
  const { '@type': itemType, event_url, subjects, contact_email } = item || {};
  const isCcaEventType = itemType === 'cca-event';
  const isExternal = event_url && !event_url.includes(config.settings.apiPath);

  return (
    <>
      {(!isExternal || isCcaEventType) && (
        <div className="event-organisation">
          <FormattedMessage
            id="Organised by EEA"
            defaultMessage="Organised by EEA"
          />
          <Image
            className="eea-logo"
            src={eeaLogo}
            alt="European Environment Agency"
            title="European Environment Agency"
          />
        </div>
      )}
      <div className="bottom-info">
        {subjects && subjects.length > 0 && (
          <div className="subjects">
            {subjects.map((tag) => (
              <Label key={tag} size="small">
                {tag}
              </Label>
            ))}
          </div>
        )}

        <div className="source">
          <ConditionalLink item={item} condition={!isEditMode}>
            <FormattedMessage
              id="Climate-ADAPT page for this event"
              defaultMessage="Climate-ADAPT page for this event"
            />
          </ConditionalLink>
        </div>
        {contact_email && (
          <div className="email-info">
            <Icon name="mail" />
            <a
              className="contact_email"
              href={goToContact(contact_email)}
              target="_blank"
              rel="noreferrer"
            >
              {contact_email}
            </a>
          </div>
        )}
      </div>
    </>
  );
};

const EventCardsListingView = ({ items, isEditMode }) => {
  return (
    <div className="ui fluid eventCards">
      {items.map((item) => (
        <EventCard key={item.UID} item={item} isEditMode={isEditMode} />
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
