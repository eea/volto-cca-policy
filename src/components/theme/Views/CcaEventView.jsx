import React from 'react';
import {
  DocumentsList,
  HTMLField,
  ContentMetadata,
  LinksList,
  PublishedModifiedInfo,
  ShareInfo,
} from '@eeacms/volto-cca-policy/helpers';
import { Grid } from 'semantic-ui-react';

function CcaEventView(props) {
  const { content } = props;
  // cca_files: [content.agenda_file]}
  if (content.agenda_file) {
    content.agenda_file['url'] = content.agenda_file['download'];
  }
  if (content.background_documents) {
    content.background_documents['url'] =
      content.background_documents['download'];
  }
  console.log(content.agenda_file);
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
      {content?.image !== null && (
        <div className="eea hero-block">
          <div className="hero-block-image-wrapper full-width">
            <div
              className="hero-block-image has--bg--center"
              style={{
                backgroundImage:
                  `url("` +
                  content.image['scales']['panoramic']['download'] +
                  `")`,
              }}
              en=""
              about=""
              test-001=""
            ></div>
            <div className="hero-block-image-overlay dark-overlay-4"></div>
          </div>
          <div className="hero-block-inner-wrapper d-flex flex-items-center">
            <div className="hero-block-body">
              <div className="hero-block-text color-fg-white text-left">
                <div className="">
                  <h2>{content.title}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="ui container">
        <Grid columns="12">
          <div className="row">
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={9}
              className="col-left"
            >
              <div className="ui label">Climate adapt event</div>
              <h1>{content.title}</h1>
              <HTMLField value={content.text} className="long_description" />
              <h2>Agenda and supporting documents</h2>
              <HTMLField value={content.agenda} className="long_description" />
              {content?.agenda_file && <DocumentsList content={agenda_files} />}
              {content?.background_documents && (
                <DocumentsList content={background_documents} />
              )}

              <h2>Practical information</h2>
              <h3>Participation</h3>
              <HTMLField
                value={content.participation}
                className="long_description"
              />

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
              <p>{content.start}</p>
              <p>{content.end}</p>
              <p>{content.timezone}</p>
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
      </div>
    </div>
  );
}

export default CcaEventView;
