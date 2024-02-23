import React from 'react';
import { HTMLField } from '@eeacms/volto-cca-policy/helpers';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
import config from '@plone/volto/registry';

function CcaEventView(props) {
  const {
    blocks: { blocksConfig },
  } = config;
  const TitleBlockView = blocksConfig?.title?.view;
  const { content } = props;

  return (
    <div className="cca-newsitem-view">
      <TitleBlockView
        {...props}
        data={{ info: [{ description: '' }] }}
        metadata={content}
      />
      <div className="ui container">
        <p>{content.description}</p>
        <HTMLField value={content.text} className="long_description" />
        <RenderBlocks {...props} />
      </div>
    </div>
  );
}

export default CcaEventView;
