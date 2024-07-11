import React from 'react';
import { Grid, Container, Segment } from 'semantic-ui-react';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
import {
  SubjectTags,
  EventDetails,
  HTMLField,
} from '@eeacms/volto-cca-policy/helpers';
import { filterBlocks } from '@eeacms/volto-cca-policy/utils';
import { PortalMessage } from '@eeacms/volto-cca-policy/components';

function EventView(props) {
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
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
}

export default EventView;
