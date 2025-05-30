import React from 'react';
import { Container } from 'semantic-ui-react';
import { filterBlocks } from '@eeacms/volto-cca-policy/utils';
import { PortalMessage } from '@eeacms/volto-cca-policy/components';
import { HTMLField, SubjectTags } from '@eeacms/volto-cca-policy/helpers';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
import { UniversalLink } from '@plone/volto/components';

const DescriptionText = ({ content }) => {
  return (
    <>
      <p className="documentDescription">{content.description}</p>
      <HTMLField value={content.text} className="content-text" />
      {content.remoteUrl && (
        <div className="news-link">
          <span>Read more on </span>
          <UniversalLink href={content.remoteUrl}>
            {content.remoteUrl}
          </UniversalLink>
        </div>
      )}
    </>
  );
};

function NewsItemView(props) {
  const { content } = props;

  // These blocks are used in the Edit View for dexterity layout.
  // We don't want to display them in the View mode.
  const {
    blocks: filteredBlocks,
    blocks_layout: filteredBlocksLayout,
    hasBlockTypes,
  } = filterBlocks(content, ['tabs_block', 'metadataSection']);

  return (
    <div className="cca-newsitem-view">
      <Container>
        <PortalMessage content={content} />
        {hasBlockTypes ? (
          <>
            <DescriptionText content={content} />
            <RenderBlocks
              {...props}
              content={{
                ...content,
                blocks: filteredBlocks,
                blocks_layout: filteredBlocksLayout,
              }}
            />
          </>
        ) : (
          <>
            <RenderBlocks {...props} content={content} />
          </>
        )}
        <SubjectTags {...props} />
      </Container>
    </div>
  );
}

export default NewsItemView;
