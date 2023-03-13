import React from 'react';
import {
  HTMLField,
  // ContentMetadata,
  // LinksList,
  // PublishedModifiedInfo,
  // ShareInfo,
} from '@eeacms/volto-cca-policy/helpers';
import { Grid } from 'semantic-ui-react';
// import { Fragment } from 'react';

function C3SIndicatorView(props) {
  const { content } = props;

  return (
    <div className="c3sindicator-view">
      <div className="ui container">
        <Grid columns="12">
          <div className="row">
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={12}
              className="col-full"
            >
              <h1>{content.title}</h1>
              <HTMLField
                value={content.long_description}
                className="long_description"
              />
            </Grid.Column>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default C3SIndicatorView;
