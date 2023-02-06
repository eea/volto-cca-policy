import React from 'react';
import { HTMLField, ContentMetadata } from '@eeacms/volto-cca-policy/helpers';

function InformationPortalView(props) {
  const { content } = props;

  return (
    <div className="tool-view">
      <div className="ui container">
        <div className="ui grid">
          <div className="row">
            <div className="nine wide column left-col">
              <div className="ui label">Information Portal</div>
              <h1>{content.title}</h1>
              <h4>Description</h4>
              <HTMLField
                value={content.long_description}
                className="long_description"
              />

              <h4>Reference information</h4>
              {content?.websites?.length > 0 && (
                <>
                  <h5>Websites</h5>

                  {content.websites
                    .map((url) => (
                      <>
                        {url}
                        <br />
                      </>
                    ))
                    .map((url) => (
                      <a key={url} href={url}>
                        {url}
                      </a>
                    ))}
                </>
              )}
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

export default InformationPortalView;
