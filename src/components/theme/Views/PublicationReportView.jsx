import React from 'react';
import {
  HTMLField,
  ContentMetadata,
  PublishedModifiedInfo,
  DocumentsList,
  ShareInfo,
  ReferenceInfo,
  BannerTitle,
  LogoWrapper,
} from '@eeacms/volto-cca-policy/helpers';
import { Image, Grid, Divider } from 'semantic-ui-react';

function PublicationReportView(props) {
  const { content } = props;
  const { logo, title } = content;

  return (
    <div className="db-item-view publication-report-view">
      <BannerTitle
        content={{ ...content, image: '' }}
        type="Publications and Report"
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
              <HTMLField value={content.long_description} />
              <Divider />
              <ReferenceInfo content={content} />
              <PublishedModifiedInfo {...props} />
              <ShareInfo {...props} />
            </Grid.Column>

            <Grid.Column
              mobile={12}
              tablet={12}
              computer={4}
              className="col-right"
            >
              <ContentMetadata {...props} />

              <DocumentsList {...props} />
            </Grid.Column>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default PublicationReportView;
