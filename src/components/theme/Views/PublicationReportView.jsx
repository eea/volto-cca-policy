import React from 'react';
import {
  ContentMetadata,
  PublishedModifiedInfo,
  DocumentsList,
  ShareInfo,
  ReferenceInfo,
  BannerTitle,
} from '@eeacms/volto-cca-policy/helpers';
import { Segment, Image, Grid } from 'semantic-ui-react';
import cx from 'classnames';

function PublicationReportView(props) {
  const { content } = props;
  const { cca_files, logo, title } = content;

  return (
    <div
      className={cx('db-item-view publication-report-view', {
        'logo-right': logo,
      })}
    >
      <BannerTitle
        content={{ ...content, image: '' }}
        type="Publications and Report"
      />

      <div className="ui container">
        <Grid columns="12">
          <div className="row">
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={8}
              className="col-left"
            >
              <ReferenceInfo content={content} />
              <PublishedModifiedInfo {...props} />
              <ShareInfo {...props} />
              {logo && (
                <Image
                  src={logo?.scales?.mini?.download}
                  alt={title}
                  className="db-logo"
                />
              )}
            </Grid.Column>

            <Grid.Column
              mobile={12}
              tablet={12}
              computer={4}
              className="col-right"
            >
              <Segment>
                <ContentMetadata {...props} />
              </Segment>
              {cca_files && cca_files.length > 0 && (
                <Segment>
                  <DocumentsList {...props} />
                </Segment>
              )}
            </Grid.Column>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default PublicationReportView;
