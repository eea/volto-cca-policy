import React from 'react';
import {
  HTMLField,
  ContentMetadata,
  LinksList,
  PublishedModifiedInfo,
  ShareInfo,
  BannerTitle,
  DocumentsList,
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
  const { long_description, websites, source, cca_files } = content;

  return (
    <div className="db-item-view guidance-view">
      <BannerTitle content={content} type="Guidance Document" />
      <div className="ui container">
        <h2>Description</h2>
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
        <ContributorsList {...props} />
        <PublishedModifiedInfo {...props} />
        <ShareInfo {...props} />

        <div className="content-box">
          <div className="content-box-inner">
            <Segment>
              <ContentMetadata {...props} />
            </Segment>

            {cca_files && cca_files.length > 0 && (
              <Segment>
                <DocumentsList {...props} />
              </Segment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuidanceView;
