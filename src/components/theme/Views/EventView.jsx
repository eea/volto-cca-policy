import React from 'react';
import {
  BannerTitle,
  PortalMessage,
} from '@eeacms/volto-cca-policy/components';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
import { Grid, Container, Segment, Button, Icon } from 'semantic-ui-react';
import { useIntl, defineMessages, FormattedMessage } from 'react-intl';
import { SubjectTags, EventDetails } from '@eeacms/volto-cca-policy/helpers';
import { expandToBackendURL } from '@plone/volto/helpers';

const messages = defineMessages({
  downloadEvent: {
    id: 'Download this event in iCal format',
    defaultMessage: 'Download this event in iCal format',
  },
});

function CcaEventView(props) {
  const { content } = props;
  const intl = useIntl();

  return (
    <div className="cca-event-view">
      <BannerTitle content={content} />

      <Container>
        <PortalMessage content={content} />
        <Grid columns="12">
          <Grid.Row>
            <Grid.Column mobile={12} tablet={12} computer={8}>
              <RenderBlocks {...props} />
              <SubjectTags {...props} />
            </Grid.Column>
            <Grid.Column mobile={12} tablet={12} computer={4}>
              <Segment>
                <EventDetails {...props} />
                {content?.event_url && (
                  <>
                    <h3>
                      <FormattedMessage id="Web" defaultMessage="Web" />
                    </h3>
                    <p>
                      <a href={content.event_url} target="_blank">
                        <FormattedMessage
                          id="Visit external website"
                          defaultMessage="Visit external website"
                        />
                      </a>
                    </p>
                  </>
                )}

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
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
}

export default CcaEventView;
