import React from 'react';
import {
  HTMLField,
  ContentMetadata,
  LinksList,
  PublishedModifiedInfo,
  ShareInfo,
  BannerTitle,
} from '@eeacms/volto-cca-policy/helpers';
import { Grid } from 'semantic-ui-react';
import config from '@plone/volto/registry';

const ContributorsList = (props) => {
  const { content } = props;

  if (
    content.contributor_list?.length > 0 ||
    content.other_contributor?.length > 0
  ) {
    return (
      <>
        <h5>Contributor:</h5>
        {content.contributor_list?.length > 0 &&
          content.contributor_list.map((contributor, index) => (
            <p key={index}>{contributor.title}</p>
          ))}
        {content.other_contributor && <p>{content.other_contributor}</p>}
      </>
    );
  }

  return null;
};

function GuidanceView(props) {
  const { content } = props;

  return (
    <div className="guidance-view">
      <BannerTitle content={content} type="Guidance Document" />
      <div className="ui container">
        <Grid columns="12">
          <div className="row">
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={9}
              className="col-left"
            >
              <h4>Description:</h4>
              <HTMLField
                value={content.long_description}
                className="long_description"
              />
              <hr />
              <h4>Reference information</h4>

              {content?.websites?.length > 0 && (
                <LinksList title="Websites:" value={content.websites} />
              )}

              {content?.source && (
                <>
                  <h5>Source:</h5>
                  <HTMLField value={content.source} />
                </>
              )}
              <ContributorsList {...props} />
              <PublishedModifiedInfo {...props} />
              <ShareInfo {...props} />
            </Grid.Column>
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={3}
              className="col-right"
            >
              <div style={{}}>
                <ContentMetadata {...props} />
              </div>
            </Grid.Column>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default GuidanceView;
