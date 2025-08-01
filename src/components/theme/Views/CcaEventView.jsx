import React from 'react';
import { useIntl, defineMessages, FormattedMessage } from 'react-intl';
import { Grid, Container, Segment } from 'semantic-ui-react';
import {
  HTMLField,
  EventDetails,
  DocumentsList,
} from '@eeacms/volto-cca-policy/helpers';
import { PortalMessage } from '@eeacms/volto-cca-policy/components';
import { filterBlocks } from '@eeacms/volto-cca-policy/utils';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';

const messages = defineMessages({
  download_agenda: {
    id: 'Download the detailed agenda',
    defaultMessage: 'Download the detailed agenda',
  },
  download_documents: {
    id: 'A background document for the event is available',
    defaultMessage: 'A background document for the event is available',
  },
});

const DocumentSection = ({ title, file }) => (
  <DocumentsList
    content={{
      show_counter: false,
      section_title: title,
      cca_files: [
        {
          url: file?.download,
          title: file?.filename,
        },
      ],
    }}
  />
);

function CcaEventView(props) {
  const intl = useIntl();
  const { content } = props;
  const {
    event_language,
    agenda_file,
    background_documents,
    participation,
    contact_email,
  } = content;

  const { blocks: filteredBlocks, blocks_layout: filteredBlocksLayout } =
    filterBlocks(content, ['tabs_block', 'metadataSection']);

  const titleBlock = Object.values(filteredBlocks).find(
    (block) => block['@type'] === 'title',
  );
  if (titleBlock && !titleBlock.subtitle && content.subtitle) {
    titleBlock.subtitle = content.subtitle;
  }

  return (
    <div className="cca-event-view">
      <Container>
        <PortalMessage content={content} />
        <Grid columns="12">
          <Grid.Row>
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={9}
              className="col-left"
            >
              <HTMLField value={content.text} />

              <h2>
                <FormattedMessage
                  id="Agenda and supporting documents"
                  defaultMessage="Agenda and supporting documents"
                />
              </h2>
              <HTMLField value={content.agenda} />

              {agenda_file && (
                <DocumentSection
                  title={intl.formatMessage(messages.download_agenda)}
                  file={agenda_file}
                />
              )}

              {background_documents && (
                <DocumentSection
                  title={intl.formatMessage(messages.download_documents)}
                  file={background_documents}
                />
              )}

              <h2>
                <FormattedMessage
                  id="Practical information"
                  defaultMessage="Practical information"
                />
              </h2>
              <h3>
                <FormattedMessage
                  id="Participation"
                  defaultMessage="Participation"
                />
              </h3>
              <HTMLField value={participation} />

              <h2>
                <FormattedMessage id="Contact" defaultMessage="Contact" />
              </h2>

              {contact_email && (
                <p>
                  <FormattedMessage
                    id="If you have any further questions you can contact"
                    defaultMessage="If you have any further questions you can contact"
                  />{' '}
                  <a href={`mailto:${contact_email}`}>{contact_email}</a>
                </p>
              )}

              {event_language && (
                <>
                  <h2>
                    <FormattedMessage
                      id="Language of the conference"
                      defaultMessage="Language of the conference"
                    />
                  </h2>
                  <p>{event_language.title}</p>
                </>
              )}

              <RenderBlocks
                {...props}
                content={{
                  ...content,
                  '@type': 'climate-adapt-event',
                  blocks: filteredBlocks,
                  blocks_layout: filteredBlocksLayout,
                }}
              />
            </Grid.Column>
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={3}
              className="col-right"
            >
              <Segment>
                <EventDetails {...props} />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
}

export default CcaEventView;
