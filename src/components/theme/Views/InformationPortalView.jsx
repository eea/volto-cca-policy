import React from 'react';
import { HTMLField, ContentMetadata } from '@eeacms/volto-cca-policy/helpers';

function InformationPortalView(props) {
  const { content } = props;

  return (
    <div className="tool-view">
      <div style={{}}>
        <ContentMetadata {...props} />
      </div>
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

          {content.websites.map((url) => (
            <a key={url} href={url}>
              {url}
            </a>
          ))}
        </>
      )}
    </div>
  );
}

export default InformationPortalView;
