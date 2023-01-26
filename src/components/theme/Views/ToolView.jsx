import React from 'react';
import { HTMLField, ContentMetadata } from '@eeacms/volto-cca-policy/helpers';

function ToolView(props) {
  const { content } = props;

  console.log(content);

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
      <h5>Websites</h5>
      {content.websites.map((url) => (
        <a key={url} href={url}>
          {url}
        </a>
      ))}
      <h5>Source</h5>
      <HTMLField value={content.source} />
    </div>
  );
}

export default ToolView;
