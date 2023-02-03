import React from 'react';
import { HTMLField, ContentMetadata } from '@eeacms/volto-cca-policy/helpers';

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
                <>
                  <h5>Websites</h5>

                  {content.websites.map((url) => (
                    <a key={url} href={url}>
                      {url}
                    </a>
                  ))}
                </>
              )}

              <h5>Source</h5>
              <HTMLField value={content.source} />
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
