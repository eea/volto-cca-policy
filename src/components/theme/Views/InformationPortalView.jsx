import React from 'react';
import {
  HTMLField,
  ContentMetadata,
  LinksList,
  PublishedModifiedInfo,
  ShareInfo,
  BannerTitle,
} from '@eeacms/volto-cca-policy/helpers';
import { Segment } from 'semantic-ui-react';

function InformationPortalView(props) {
  const { content } = props;
  const { long_description, websites, source } = content;

  return (
    <div className="db-item-view information-portal-view">
      <BannerTitle content={content} type="Information Portal" />

      <div className="ui container">
        <h2>Description:</h2>
        <HTMLField value={long_description} />

        <h2>Reference information</h2>
        {websites?.length > 0 && (
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

        <div class="content-box">
          <div class="content-box-inner">
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
