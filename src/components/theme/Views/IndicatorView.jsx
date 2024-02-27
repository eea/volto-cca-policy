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

function IndicatorView(props) {
  const { content } = props;
  const {
    long_description,
    websites,
    source,
    contributor_list,
    other_contributor,
  } = content;

  return (
    <div className="db-item-view indicator-view">
      <BannerTitle content={content} type="Indicator" />

      <div className="ui container">
        <h2>Description</h2>
        <HTMLField value={long_description} />
        <Divider />
        <h2>Reference information</h2>

        {websites && websites?.length > 0 && (
          <LinksList title="Websites:" value={websites} />
        )}

        <h5>Source:</h5>
        <HTMLField value={source} />
        {(contributor_list?.length > 0 || other_contributor?.length > 0) && (
          <>
            <h4>Contributor:</h4>
            {contributor_list
              .map((item) => (
                <>
                  {item.title}
                  <br />
                </>
              ))
              .sort()}
            {other_contributor}
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

export default IndicatorView;
