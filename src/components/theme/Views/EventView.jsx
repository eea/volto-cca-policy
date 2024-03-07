import React from 'react';
import { HTMLField } from '@eeacms/volto-cca-policy/helpers';
import {
  BannerTitle,
  PortalMessage,
} from '@eeacms/volto-cca-policy/components';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
import { When } from '@plone/volto/components/theme/View/EventDatesInfo';
import { Grid } from 'semantic-ui-react';

function CcaEventView(props) {
  const { content } = props;
  // cca_files: [content.agenda_file]}

  return (
    <div className="cca-event-view">
      <BannerTitle content={content} />

      <div className="ui container">
        <PortalMessage content={content} />
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
              <p>{content.description}</p>
              <HTMLField value={content.text} className="long_description" />
              <RenderBlocks {...props} />
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
              {!!content.contact_email && (
                <>
                  <h3>Info</h3>
                  <p>{content.contact_email}</p>
                </>
              )}
            </Grid.Column>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default CcaEventView;
