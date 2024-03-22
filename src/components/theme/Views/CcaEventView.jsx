import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import {
  DocumentsList,
  HTMLField,
  BannerTitle,
} from '@eeacms/volto-cca-policy/helpers';
import {
  PortalMessage,
  TranslationDisclaimer,
} from '@eeacms/volto-cca-policy/components';
import { When } from '@plone/volto/components/theme/View/EventDatesInfo';

function CcaEventView(props) {
  const { content } = props;
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
      <TranslationDisclaimer />

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

              <h2>Agenda and supporting documents</h2>
              <HTMLField value={content.agenda} />

              {content?.agenda_file && <DocumentsList content={agenda_files} />}
              {content?.background_documents && (
                <DocumentsList content={background_documents} />
              )}

              <h2>Practical information</h2>
              <h3>Participation</h3>
              <HTMLField value={content.participation} />

              <h2>Contact</h2>
              <p>
                If you have any further questions you can contact{' '}
                <a href="mailto:{content.contact_email}">
                  {content.contact_email}
                </a>
              </p>
            </Grid.Column>
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={3}
              className="col-right"
            >
              <h3>When</h3>
              <When
                start={content.start}
                end={content.end}
                whole_day={content.whole_day}
                open_end={content.open_end}
              />
              {content?.location !== null && (
                <>
                  <h3>Where</h3>
                  <p>{content.location}</p>
                </>
              )}
              <h3>Language</h3>
              <p>{content.language}</p>
              <h3>Info</h3>
              <p>{content.contact_email}</p>
            </Grid.Column>
          </div>
        </Grid>
      </Container>
    </div>
  );
}

export default CcaEventView;
