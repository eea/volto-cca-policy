import React from 'react';
import {
  ContentMetadata,
  PublishedModifiedInfo,
  ReferenceInfo,
  BannerTitle,
} from '@eeacms/volto-cca-policy/helpers';
import { Segment, Image, Grid } from 'semantic-ui-react';
import cx from 'classnames';

function ToolView(props) {
  const { content } = props;
  const { logo, title } = content;

  return (
    <div
      className={cx('db-item-view tool-view', {
        'logo-right': logo,
      })}
    >
      <BannerTitle content={{ ...content, image: '' }} type="Tools" />

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
            </Grid.Column>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default ToolView;
