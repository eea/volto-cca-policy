import React from 'react';
import {
  ContentMetadata,
  PublishedModifiedInfo,
  ReferenceInfo,
  BannerTitle,
} from '@eeacms/volto-cca-policy/helpers';
import { Grid } from 'semantic-ui-react';

function ToolView(props) {
  const { content } = props;

  return (
    <div className="tool-view">
      <BannerTitle content={content} type="Tools" />

      <div className="ui container">
        <Grid columns="12">
          <div className="row">
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={9}
              className="col-left"
            >
              <ReferenceInfo content={content} />

              <PublishedModifiedInfo {...props} />
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

export default ToolView;
