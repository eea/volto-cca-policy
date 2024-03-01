import React from 'react';
import {
  HTMLField,
  ContentMetadata,
  LinksList,
  PublishedModifiedInfo,
  ShareInfo,
  BannerTitle,
} from '@eeacms/volto-cca-policy/helpers';
import { Segment, Image } from 'semantic-ui-react';

function InformationPortalView(props) {
  const { content } = props;
  const { long_description, websites, source, logo } = content;

  return (
    <div className="db-item-view information-portal-view">
      <BannerTitle content={content} type="Information Portal" />

      <div className="ui container">
        {logo && (
          <Image
            src={logo?.scales?.mini?.download}
            alt={content.title}
            className="db-logo"
          />
        )}
        <h2>Description</h2>
        <HTMLField value={long_description} />

        <h2>Reference information</h2>
        {websites && websites?.length > 0 && (
          <LinksList title="Websites:" value={websites} />
        )}
        {source && (
          <>
            <h5>Source:</h5>
            <HTMLField value={source} />
          </>
        )}
        <PublishedModifiedInfo {...props} />
        <ShareInfo {...props} />

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

export default InformationPortalView;
