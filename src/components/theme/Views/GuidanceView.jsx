import React from 'react';
import {
  HTMLField,
  ContentMetadata,
  LinksList,
  PublishedModifiedInfo,
} from '@eeacms/volto-cca-policy/helpers';

function GuidanceView(props) {
  const { content } = props;

  return (
    <div className="guidance-view">
      <div className="ui container">
        <div className="ui grid">
          <div className="row">
            <div className="nine wide column left-col">
              <div className="ui label">Guidance Document</div>
              <h1>{content.title}</h1>
              <hr />
              <h4>Description:</h4>
              <HTMLField
                value={content.long_description}
                className="long_description"
              />
              <hr />
              <h4>Reference information</h4>

              {content?.websites?.length > 0 && (
                <LinksList title="Websites" value={content.websites} />
              )}

              {content?.source && (
                <>
                  <h5>Source</h5>
                  <HTMLField value={content.source} />
                </>
              )}
              <PublishedModifiedInfo {...props} />
            </div>
            <div className="three wide column right-col">
              <div style={{}}>
                <ContentMetadata {...props} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuidanceView;
