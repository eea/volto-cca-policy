import React from 'react';
import { HTMLField, ContentMetadata } from '@eeacms/volto-cca-policy/helpers';

function PublicationReportView(props) {
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
    </div>
  );
}

export default PublicationReportView;
