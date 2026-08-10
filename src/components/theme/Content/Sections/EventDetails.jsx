import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { Button, Icon } from 'semantic-ui-react';
import { expandToBackendURL } from '@plone/volto/helpers/Url/Url';
import { When } from '@plone/volto/components/theme/View/EventDatesInfo';

const messages = defineMessages({
  downloadEvent: {
    id: 'Download this event in iCal format',
    defaultMessage: 'Download this event in iCal format',
  },
});

export const WebDetails = (props) => {
  const { content } = props;
  const eventUrl = content?.event_url;
  return eventUrl ? (
    <>
      <h4>
        <FormattedMessage id="Web" defaultMessage="Web" />
      </h4>
      <p>
        <a href={eventUrl} target="_blank" rel="noopener">
          <FormattedMessage
            id="Visit external website"
            defaultMessage="Visit external website"
          />
        </a>
      </p>
    </>
  ) : null;
};

const EventDetails = (props) => {
  const { content } = props;
  const intl = useIntl();

  return (
    <>
      <h4>
        <FormattedMessage id="When" defaultMessage="When" />
      </h4>
      <When
        start={content.start}
        end={content.end}
        whole_day={content.whole_day}
        open_end={content.open_end}
      />
      {content?.location !== null && (
        <>
          <h4>
            <FormattedMessage id="Where" defaultMessage="Where" />
          </h4>
          <p>{content.location}</p>
        </>
      )}
      {!!content.contact_email && (
        <>
          <h4>
            <FormattedMessage id="Info" defaultMessage="Info" />
          </h4>
          <p>{content.contact_email}</p>
        </>
      )}

      <WebDetails {...props} />

      <div className="download-event">
        <a
          className="ics-download"
          target="_blank"
          rel="noreferrer"
          href={`${expandToBackendURL(content['@id'])}/ics_view`}
        >
          <Button
            className="icon inverted primary labeled"
            title={intl.formatMessage(messages.downloadEvent)}
          >
            <Icon name="calendar alternate outline" />
            <FormattedMessage
              id="Download Event"
              defaultMessage="Download Event"
            />
          </Button>
        </a>
      </div>
    </>
  );
};

export default EventDetails;
