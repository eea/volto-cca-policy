import React from 'react';
import {
  HTMLField,
  ContentMetadata,
  LinksList,
  PublishedModifiedInfo,
  ShareInfo,
  BannerTitle,
} from '@eeacms/volto-cca-policy/helpers';
import { Segment, Divider } from 'semantic-ui-react';

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
  const { long_description, websites, source } = content;

  return (
    <div className="db-item-view guidance-view">
      <BannerTitle content={content} type="Guidance Document" />
      <div className="ui container">
        <h2>Description:</h2>
        <HTMLField value={long_description} className="long_description" />
        <Divider />
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
        <ContributorsList {...props} />
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

export default GuidanceView;
