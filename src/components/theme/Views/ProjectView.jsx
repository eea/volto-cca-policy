import React from 'react';
import {
  HTMLField,
  ContentMetadata,
  ExternalLink,
  PublishedModifiedInfo,
} from '@eeacms/volto-cca-policy/helpers';

function ProjectView(props) {
  const { content } = props;
  return (
    <div className="project-view">
      <div className="ui container">
        <div className="ui grid">
          <div className="row">
            <div className="nine wide column left-col">
              <div className="ui label">Project</div>
              <h1>
                {content.title} ({content.acronym})
              </h1>
              <h4>Description</h4>
              <HTMLField
                value={content.long_description}
                className="long_description"
              />
              <h4>Project information</h4>
              <h5>Lead</h5>
              <p>{content.lead}</p>
              <h5>Partners</h5>
              <HTMLField value={content.partners} className="partners" />
              {content.funding && (
                <>
                  <h5>Source of funding</h5>
                  <p>{content.funding}</p>
                </>
              )}

              <h4>Reference information</h4>

              {content?.websites?.length > 0 && (
                <>
                  <h5>Websites</h5>
                  <ul>
                    {content.websites.map((url, index) => (
                      <li key={index}>
                        <ExternalLink url={url} text={url} />
                      </li>
                    ))}
                  </ul>
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

export default ProjectView;
