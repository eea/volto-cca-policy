import React from 'react';
import { HTMLField, ContentMetadata } from '@eeacms/volto-cca-policy/helpers';

function ToolView(props) {
  const { content } = props;
  const modification_date = new Date(content.modification_date).toLocaleString(
    'en-us',
    {
      month: 'long',
      year: 'numeric',
      day: 'numeric',
    },
  );

  return (
    <div className="tool-view">
      <div className="ui container">
        <div className="ui grid">
          <div className="row">
            <div className="nine wide column left-col">
              <div className="ui label">Tools</div>
              <h1>{content.title}</h1>
              <h4>Description</h4>
              <HTMLField
                value={content.long_description}
                className="long_description"
              />
              <hr />
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
                  )}
                </>
              )}
              {content.source && (
                <>
                  <h4>Source</h4>
                  <HTMLField value={content.source} className="source" />
                </>
              )}
              {content?.contributor_list?.length > 0 && (
                <>
                  <h4>Contributor</h4>
                  {content.contributor_list.map((item) =>
                    (
                      <>
                        {item.title}
                        <br />
                      </>
                    ).sort(),
                  )}
                </>
              )}
              <p>
                <br />
                <strong>Last Modified in Climate-ADAPT</strong>
                <span>{modification_date}</span>
              </p>
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

export default ToolView;
