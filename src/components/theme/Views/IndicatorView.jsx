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

  return (
    <div className="db-item-view indicator-view">
      <BannerTitle content={content} type="Indicator" />

      <div className="ui container">
        <h2>Description</h2>
        <HTMLField
          value={content.long_description}
          className="long_description"
        />
        <Divider />
        <h2>Reference information</h2>

        {content?.websites?.length > 0 && (
          <LinksList title="Websites:" value={content.websites} />
        )}

        <h5>Source:</h5>
        <HTMLField value={content.source} />
        {(content?.contributor_list?.length > 0 ||
          content?.other_contributor?.length > 0) && (
          <>
            <h4>Contributor:</h4>
            {content.contributor_list
              .map((item) => (
                <>
                  {item.title}
                  <br />
                </>
              ))
              .sort()}
            {content.other_contributor}
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
