import React from 'react';
import {
  HTMLField,
  ContentMetadata,
  LinksList,
  PublishedModifiedInfo,
  ShareInfo,
  LogoWrapper,
} from '@eeacms/volto-cca-policy/helpers';
import { Divider, Segment, Image, Grid } from 'semantic-ui-react';

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
    logo,
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
        <Grid columns="12">
          <div className="row">
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={8}
              className="col-left"
            >
              <LogoWrapper logo={logo}>
                <h2>Description</h2>
                {logo && (
                  <Image
                    src={logo?.scales?.mini?.download}
                    alt={title}
                    className="db-logo"
                  />
                )}
              </LogoWrapper>
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

              {websites && websites?.length > 0 && (
                <LinksList title="Websites:" value={websites} />
              )}

              <PublishedModifiedInfo {...props} />
              <ShareInfo {...props} />
            </Grid.Column>
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={4}
              className="col-right"
            >
              <Segment>
                <ContentMetadata {...props} />
              </Segment>
            </Grid.Column>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default ProjectView;
