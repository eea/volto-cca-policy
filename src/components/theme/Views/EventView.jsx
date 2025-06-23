import React from 'react';
import { Grid, Container, Segment } from 'semantic-ui-react';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
import {
  SubjectTags,
  EventDetails,
  HTMLField,
} from '@eeacms/volto-cca-policy/helpers';
import { filterBlocks } from '@eeacms/volto-cca-policy/utils';

function EventView(props) {
  const { content } = props;
  // These blocks are used in the Edit View for dexterity layout.
  // We don't want to display them in the View mode.
  const {
    blocks: filteredBlocks,
    blocks_layout: filteredBlocksLayout,
    hasBlockTypes,
  } = filterBlocks(content, ['tabs_block', 'metadataSection']);

  const titleBlock = Object.values(content.blocks).find(
    (block) => block['@type'] === 'title',
  );
  if (titleBlock && !titleBlock.copyright && content.image_caption) {
    titleBlock.copyright = content.image_caption;
  }

  return (
    <div className="cca-event-view">
      <Container>
        <Grid columns="12">
          <Grid.Row>
            <Grid.Column mobile={12} tablet={12} computer={8}>
              {hasBlockTypes && (
                <>
                  <p className="documentDescription">{content.description}</p>
                  <HTMLField value={content.text} className="content-text" />
                </>
              )}

              <RenderBlocks
                {...props}
                content={{
                  ...content,
                  blocks: filteredBlocks,
                  blocks_layout: filteredBlocksLayout,
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
