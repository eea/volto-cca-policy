import React from 'react';
import {
  ContentMetadata,
  PublishedModifiedInfo,
  ReferenceInfo,
  BannerTitle,
} from '@eeacms/volto-cca-policy/helpers';
import { Segment } from 'semantic-ui-react';

function ToolView(props) {
  const { content } = props;

  return (
    <div className="db-item-view tool-view">
      <BannerTitle content={content} type="Tools" />

      <div className="ui container">
        <ReferenceInfo content={content} />
        <PublishedModifiedInfo {...props} />

        <div className="content-box">
          <div className="content-box-inner">
            <Segment>
              <ContentMetadata {...props} />
            </Segment>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ToolView;
