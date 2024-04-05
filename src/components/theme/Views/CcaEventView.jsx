import React from 'react';
import { Grid, Container, Segment } from 'semantic-ui-react';
import {
  DocumentsList,
  HTMLField,
  BannerTitle,
  EventDetails,
} from '@eeacms/volto-cca-policy/helpers';
import { PortalMessage } from '@eeacms/volto-cca-policy/components';
import { FormattedMessage } from 'react-intl';

function CcaEventView(props) {
  const { content } = props;
  const { event_language } = content;
  // cca_files: [content.agenda_file]}
  if (content.agenda_file) {
    content.agenda_file['url'] = content.agenda_file['download'];
    content.agenda_file['title'] = content.agenda_file['filename'];
  }
  if (content.background_documents) {
    content.background_documents['url'] =
      content.background_documents['download'];
    content.background_documents['title'] =
      content.background_documents['filename'];
  }
  const agenda_files = {
    section_title: 'Download the detailed agenda',
    cca_files: [content.agenda_file],
    show_counter: false,
  };
  const background_documents = {
    section_title: 'A background document for the event is available ',
    cca_files: [content.background_documents],
    show_counter: false,
  };

  return (
    <div className="cca-event-view">
      <BannerTitle
        content={{ ...content, '@type': 'Climate adapt event' }}
        data={{
          info: [{ description: '' }],
          hideContentType: false,
          hideCreationDate: false,
          hideModificationDate: false,
          hidePublishingDate: false,
          hideDownloadButton: false,
          hideShareButton: false,
        }}
      />

      <Container>
        <PortalMessage content={content} />
        <Grid columns="12">
          <div className="row">
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

              {content?.agenda_file && <DocumentsList content={agenda_files} />}
              {content?.background_documents && (
                <DocumentsList content={background_documents} />
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
              <HTMLField value={content.participation} />

              <h2>
                <FormattedMessage id="Contact" defaultMessage="Contact" />
              </h2>
              <p>
                <FormattedMessage
                  id="If you have any further questions you can contact"
                  defaultMessage="If you have any further questions you can contact"
                />{' '}
                <a href="mailto:{content.contact_email}">
                  {content.contact_email}
                </a>
              </p>

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
          </div>
        </Grid>
      </Container>
    </div>
  );
}

export default CcaEventView;
