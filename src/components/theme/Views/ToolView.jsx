import React from 'react';
import {
  ContentMetadata,
  PublishedModifiedInfo,
  ReferenceInfo,
  BannerTitle,
} from '@eeacms/volto-cca-policy/helpers';
import { Segment, Image } from 'semantic-ui-react';

function ToolView(props) {
  const { content, logo } = props;

  return (
    <div className="db-item-view tool-view">
      <BannerTitle content={{ ...content, image: '' }} type="Tools" />

      <div className="ui container">
        {logo && (
          <Image
            src={logo?.scales?.mini?.download}
            alt={content.title}
            className="db-logo"
          />
        )}
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
