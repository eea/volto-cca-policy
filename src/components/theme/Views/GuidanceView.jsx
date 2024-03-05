import React from 'react';
import {
  HTMLField,
  ContentMetadata,
  PublishedModifiedInfo,
  ShareInfo,
  BannerTitle,
  DocumentsList,
  LogoWrapper,
  ReferenceInfo,
} from '@eeacms/volto-cca-policy/helpers';
import { Segment, Divider, Image, Grid } from 'semantic-ui-react';

const ContributorsList = (props) => {
  const { content } = props;
  const { contributor_list, other_contributor } = content;

  if (contributor_list?.length > 0 || other_contributor?.length > 0) {
    return (
      <>
        <h5>Contributor:</h5>
        {contributor_list?.length > 0 &&
          contributor_list.map((contributor, index) => (
            <p key={index}>{contributor.title}</p>
          ))}
        {other_contributor && <p>{other_contributor}</p>}
      </>
    );
  }

  return null;
};

function GuidanceView(props) {
  const { content } = props;
  const { long_description, cca_files, logo, title } = content;

  return (
    <div className="db-item-view guidance-view">
      <BannerTitle
        content={{ ...content, image: '' }}
        type="Guidance Document"
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

              <ReferenceInfo content={content} />
              <ContributorsList {...props} />
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

              {cca_files && cca_files.length > 0 && (
                <Segment>
                  <DocumentsList {...props} />
                </Segment>
              )}
            </Grid.Column>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default GuidanceView;
