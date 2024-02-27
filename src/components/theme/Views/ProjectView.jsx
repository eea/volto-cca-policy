import React from 'react';
import {
  HTMLField,
  ContentMetadata,
  LinksList,
  PublishedModifiedInfo,
  ShareInfo,
} from '@eeacms/volto-cca-policy/helpers';
import { Divider, Segment } from 'semantic-ui-react';

import config from '@plone/volto/registry';

function ProjectView(props) {
  const { content } = props;
  const {
    long_description,
    lead,
    funding,
    partners,
    acronym,
    title,
    websites,
  } = content;

  const {
    blocks: { blocksConfig },
  } = config;

  const TitleBlockView = blocksConfig?.title?.view;

  return (
    <div className="db-item-view project-view">
      <TitleBlockView
        {...props}
        data={{
          info: [{ description: '' }],
          hideContentType: true,
          hideCreationDate: false,
          hideModificationDate: false,
          hidePublishingDate: false,
          hideDownloadButton: false,
          hideShareButton: false,
          subtitle: 'Project',
        }}
        metadata={{
          ...content,
          title: title + ' (' + acronym + ')',
        }}
      />

      <div className="ui container">
        <h2>Description:</h2>
        <HTMLField value={long_description} />

        <Divider />

        <h2>Project information</h2>
        <h5>Lead</h5>
        <p>{lead}</p>

        <h5>Partners</h5>
        <HTMLField value={partners} className="partners" />
        {funding && (
          <>
            <h5>Source of funding</h5>
            <p>{funding}</p>
          </>
        )}

        <Divider />
        <h2>Reference information</h2>

        {websites?.length > 0 && (
          <LinksList title="Websites:" value={websites} />
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

export default ProjectView;
