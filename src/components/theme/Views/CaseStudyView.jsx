import React from 'react';
import {
  HTMLField,
  ContentMetadata,
  LinksList,
  PublishedModifiedInfo,
} from '@eeacms/volto-cca-policy/helpers';

const PrimaryPhoto = (props) => {
  const { content } = props;

  return (
    <div>
      <img
        src={content.primary_photo.scales.preview.download}
        alt={content.title}
      />
      <p>{content.primary_photo_copyright}</p>
    </div>
  );
};

function CaseStudyView(props) {
  const { content } = props;

  return (
    <div className="case-study-view">
      <div className="ui container">
        <div className="ui grid">
          <div className="row">
            <div className="nine wide column left-col">
              <div className="ui label">Case Study</div>
              <h1>{content.title}</h1>
              <PrimaryPhoto {...props} />

              <HTMLField
                value={content.long_description}
                className="long_description"
              />
              <h4>Challenges</h4>
              <HTMLField value={content.challenges} className="challenges" />
              <h4>Objectives</h4>
              <HTMLField value={content.objectives} className="objectives" />
              <hr />
              <h4>Reference information</h4>

              {content?.websites?.length > 0 && (
                <LinksList title="Websites" value={content.websites} />
              )}

              <h5>Source</h5>
              <HTMLField value={content.source} />
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

export default CaseStudyView;
