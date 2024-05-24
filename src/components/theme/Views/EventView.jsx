import React from 'react';
import { expandToBackendURL } from '@plone/volto/helpers';
import { useIntl, defineMessages, FormattedMessage } from 'react-intl';
import { Grid, Container, Segment, Button, Icon } from 'semantic-ui-react';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
import {
  SubjectTags,
  EventDetails,
  HTMLField,
} from '@eeacms/volto-cca-policy/helpers';
import { filterBlocks } from '@eeacms/volto-cca-policy/utils';
import { PortalMessage } from '@eeacms/volto-cca-policy/components';

const messages = defineMessages({
  downloadEvent: {
    id: 'Download this event in iCal format',
    defaultMessage: 'Download this event in iCal format',
  },
});

function EventView(props) {
  const intl = useIntl();
  const { content } = props;
  const {
    blocks: filtered_blocks,
    blocks_layout: filtered_blocks_layout,
    hasBlockType,
  } = filterBlocks(content, 'tabs_block');

  return (
    <div className="cca-event-view">
      <PortalMessage content={content} />

      <Container>
        <Grid columns="12">
          <Grid.Row>
            <Grid.Column mobile={12} tablet={12} computer={8}>
              {hasBlockType && (
                <>
                  <p className="documentDescription">{content.description}</p>
                  <HTMLField value={content.text} className="content-text" />
                </>
              )}

              <RenderBlocks
                {...props}
                content={{
                  ...content,
                  blocks: filtered_blocks,
                  blocks_layout: filtered_blocks_layout,
                }}
              />

              <SubjectTags {...props} />
            </Grid.Column>
            <Grid.Column mobile={12} tablet={12} computer={4}>
              <Segment>
                <EventDetails {...props} />
                {content?.event_url && (
                  <>
                    <h4>
                      <FormattedMessage id="Web" defaultMessage="Web" />
                    </h4>
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

export default EventView;
