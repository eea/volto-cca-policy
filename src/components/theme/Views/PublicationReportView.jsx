import React from 'react';
import {
  HTMLField,
  ContentMetadata,
  LinksList,
  PublishedModifiedInfo,
} from '@eeacms/volto-cca-policy/helpers';

function PublicationReportView(props) {
  const { content } = props;
  return (
    <div className="publication-report-view">
      <div className="ui container">
        <div className="ui grid">
          <div className="row">
            <div className="nine wide column left-col">
              <div className="ui label">Publications and Reports</div>
              <h1>{content.title}</h1>
              <h4>Description</h4>
              <HTMLField
                value={content.long_description}
                className="long_description"
              />

              <h4>Reference information</h4>

              {content?.websites?.length > 0 && (
                <LinksList title="Websites" value={content.websites} />
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
                  {content.contributor_list
                    .map((item) => (
                      <>
                        {item.title}
                        <br />
                      </>
                    ))
                    .sort()}
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

export default PublicationReportView;
