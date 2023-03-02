import React from 'react';
import {
  HTMLField,
  ContentMetadata,
  LinksList,
  PublishedModifiedInfo,
  DocumentsList,
  ShareInfo,
} from '@eeacms/volto-cca-policy/helpers';
import { Grid } from 'semantic-ui-react';

function PublicationReportView(props) {
  const { content } = props;
  return (
    <div className="publication-report-view">
      <div className="ui container">
        <Grid columns="12">
          <div className="row">
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={9}
              className="col-left"
            >
              <div className="ui label">Publications and Reports</div>
              <h1>{content.title}</h1>
              <h4>Description</h4>
              <HTMLField
                value={content.long_description}
                className="long_description"
              />
              <hr />

              <h4>Reference information</h4>

              {content?.websites?.length > 0 && (
                <LinksList title="Websites:" value={content.websites} />
              )}

              {content.source && (
                <>
                  <h4>Source:</h4>
                  <HTMLField value={content.source} className="source" />
                </>
              )}
              {content?.contributor_list?.length > 0 && (
                <>
                  <h4>Contributor:</h4>
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
              <ShareInfo {...props} />
            </Grid.Column>
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={3}
              className="col-right"
            >
              <div style={{}}>
                <DocumentsList {...props} />
                <ContentMetadata {...props} />
              </div>
            </Grid.Column>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default PublicationReportView;
