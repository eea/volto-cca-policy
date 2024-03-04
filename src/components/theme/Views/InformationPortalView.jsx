import React from 'react';
import {
  HTMLField,
  ContentMetadata,
  LinksList,
  PublishedModifiedInfo,
  ShareInfo,
  BannerTitle,
  LogoWrapper,
} from '@eeacms/volto-cca-policy/helpers';
import { Segment, Image, Grid, Divider } from 'semantic-ui-react';

function InformationPortalView(props) {
  const { content } = props;
  const { long_description, websites, source, logo, title } = content;

  return (
    <div className="db-item-view information-portal-view">
      <BannerTitle
        content={{ ...content, image: '' }}
        type="Information Portal"
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

export default InformationPortalView;
