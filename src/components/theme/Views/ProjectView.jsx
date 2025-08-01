import React from 'react';
import {
  HTMLField,
  ContentMetadata,
  PublishedModifiedInfo,
  ItemLogo,
  ReferenceInfo,
} from '@eeacms/volto-cca-policy/helpers';
import { Container, Divider, Grid } from 'semantic-ui-react';
import {
  ShareInfoButton,
  PortalMessage,
} from '@eeacms/volto-cca-policy/components';

import { FormattedMessage } from 'react-intl';

import config from '@plone/volto/registry';

function ProjectView(props) {
  const { content } = props;
  const { long_description, lead, funding, partners, acronym, title } = content;
  const item_title = acronym ? title + ' (' + acronym + ')' : title;

  const {
    blocks: { blocksConfig },
  } = config;

  const TitleBlockView = blocksConfig?.title?.view;

  const titleBlockData = { ...content, title: item_title, image: '' };

  return (
    <div className="db-item-view project-view">
      <TitleBlockView
        {...props}
        data={{
          '@type': 'title',
          info: [{ description: '' }],
          hideContentType: true,
          hideCreationDate: true,
          hideModificationDate: true,
          hidePublishingDate: true,
          hideDownloadButton: false,
          hideShareButton: false,
          subtitle: 'Project',
        }}
        metadata={titleBlockData}
        properties={titleBlockData}
      />

      <Container>
        <PortalMessage content={content} />
        <Grid columns="12">
          <div className="row">
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={8}
              className="col-left"
            >
              <ItemLogo {...props}></ItemLogo>
              <HTMLField value={long_description} />

              <Divider />

              <h2>
                <FormattedMessage
                  id="Project information"
                  defaultMessage="Project information"
                />
              </h2>
              <h5>
                <FormattedMessage id="Lead" defaultMessage="Lead" />
              </h5>
              <p>{lead}</p>
              <h5>
                <FormattedMessage id="Partners" defaultMessage="Partners" />
              </h5>
              <HTMLField value={partners} className="partners" />
              {funding && (
                <>
                  <h5>
                    <FormattedMessage
                      id="Source of funding"
                      defaultMessage="Source of funding"
                    />
                  </h5>
                  <p>{funding}</p>
                </>
              )}

              <Divider />
              <ReferenceInfo content={content} />
              <PublishedModifiedInfo {...props} />
              <ShareInfoButton {...props} />
            </Grid.Column>
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={4}
              className="col-right"
            >
              <ContentMetadata {...props} />
            </Grid.Column>
          </div>
        </Grid>
      </Container>
    </div>
  );
}

export default ProjectView;
