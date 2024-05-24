import React from 'react';
import { Container } from 'semantic-ui-react';
import { filterBlocks } from '@eeacms/volto-cca-policy/utils';
import { PortalMessage } from '@eeacms/volto-cca-policy/components';
import { HTMLField, SubjectTags } from '@eeacms/volto-cca-policy/helpers';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
import { When } from '@plone/volto/components/theme/View/EventDatesInfo';

const Date = (props) => {
  const date = props.content?.effective;
  return date ? (
    <div className="news-date-info">
      Date:
      <When start={date} end={date} whole_day={true} open_end={false} />
    </div>
  ) : null;
};

function NewsItemView(props) {
  const { content } = props;
  const {
    blocks: filtered_blocks,
    blocks_layout: filtered_blocks_layout,
    hasBlockType,
  } = filterBlocks(content, 'tabs_block');

  return (
    <div className="cca-newsitem-view">
      <PortalMessage content={content} />

      <Container>
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

        <Date {...props} />
        <SubjectTags {...props} />
      </Container>
    </div>
  );
}

export default NewsItemView;
