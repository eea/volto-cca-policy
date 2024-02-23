import React from 'react';
import { DocumentsList, HTMLField } from '@eeacms/volto-cca-policy/helpers';
import { When } from '@plone/volto/components/theme/View/EventDatesInfo';
import { Grid } from 'semantic-ui-react';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
import config from '@plone/volto/registry';

function CcaEventView(props) {
  const {
    blocks: { blocksConfig },
  } = config;
  const TitleBlockView = blocksConfig?.title?.view;
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
      {content?.image !== null && (
        <TitleBlockView
          {...props}
          data={{ info: [{ description: '' }] }}
          metadata={content}
        />
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
              {content?.image === null && (
                <>
                  <div className="ui label">Climate adapt event</div>
                  <h1>{content.title}</h1>
                </>
              )}
              <HTMLField value={content.text} className="long_description" />
              <RenderBlocks {...props} />

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
      </div>
    </div>
  );
}

export default CcaEventView;
