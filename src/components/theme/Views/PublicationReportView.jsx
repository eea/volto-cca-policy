import React from 'react';
import {
  ContentMetadata,
  PublishedModifiedInfo,
  DocumentsList,
  ShareInfo,
  ReferenceInfo,
  BannerTitle,
} from '@eeacms/volto-cca-policy/helpers';
import { Segment } from 'semantic-ui-react';

function PublicationReportView(props) {
  const { content } = props;
  const { cca_files } = content;

  return (
    <div className="db-item-view publication-report-view">
      <BannerTitle content={content} type="Publications and Report" />

      <div className="ui container">
        <ReferenceInfo content={content} />
        <PublishedModifiedInfo {...props} />
        <ShareInfo {...props} />

        <div className="content-box">
          <div className="content-box-inner">
            <Segment>
              <ContentMetadata {...props} />
            </Segment>
            {cca_files && cca_files.length > 0 && (
              <Segment>
                <DocumentsList {...props} />
              </Segment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicationReportView;
