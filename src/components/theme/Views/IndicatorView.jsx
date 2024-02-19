import React from 'react';
import {
  HTMLField,
  ContentMetadata,
  LinksList,
  PublishedModifiedInfo,
  ShareInfo,
} from '@eeacms/volto-cca-policy/helpers';
import { Grid } from 'semantic-ui-react';
import config from '@plone/volto/registry';

function IndicatorView(props) {
  const { content } = props;
  const {
    blocks: { blocksConfig },
  } = config;
  const TitleBlockView = blocksConfig?.title?.view;

  return (
    <div className="indicator-view">
      <TitleBlockView
        {...props}
        data={{
          info: [{ description: '' }],
          hideContentType: true,
          hideCreationDate: true,
          hideModificationDate: true,
          hidePublishingDate: true,
          hideDownloadButton: true,
          hideShareButton: false,
          subtitle: 'Indicator',
        }}
        metadata={content}
      />
      <div className="ui container">
        <Grid columns="12">
          <div className="row">
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={9}
              className="col-left"
            >
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

              <h5>Source:</h5>
              <HTMLField value={content.source} />
              {(content?.contributor_list?.length > 0 ||
                content?.other_contributor?.length > 0) && (
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
                  {content.other_contributor}
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
                <ContentMetadata {...props} />
              </div>
            </Grid.Column>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default IndicatorView;
