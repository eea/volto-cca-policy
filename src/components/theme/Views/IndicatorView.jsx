import React from 'react';
import {
  HTMLField,
  ContentMetadata,
  ReferenceInfo,
  PublishedModifiedInfo,
  ShareInfo,
  BannerTitle,
  LogoWrapper,
} from '@eeacms/volto-cca-policy/helpers';
import { Divider, Image, Grid } from 'semantic-ui-react';

function IndicatorView(props) {
  const { content } = props;
  const { long_description, logo, title, map_graphs } = content;

  // https://helpcenter.flourish.studio/hc/en-us/articles/8761537208463-How-to-embed-Flourish-charts-in-your-CMS
  const data_src = (map_graphs) => {
    if (typeof map_graphs === 'string') {
      const regex = /data-src="([^"]*)"/;
      const match = regex.exec(map_graphs);

      if (match && match.length > 1) {
        const dataSrcValue = match[1];
        return dataSrcValue;
      }
    }
    return null;
  };

  return (
    <div className="db-item-view indicator-view">
      <BannerTitle content={{ ...content, image: '' }} type="Indicator" />

      <div className="ui container">
        <Grid columns="12">
          <div className="row">
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={8}
              className="col-left"
            >
              <LogoWrapper logo={logo}>
                <h2>Description</h2>
                {logo && (
                  <Image
                    src={logo?.scales?.mini?.download}
                    alt={title}
                    className="db-logo"
                  />
                )}
              </LogoWrapper>
              <HTMLField value={long_description} />

              {!!data_src(map_graphs) && (
                <iframe
                  height="980"
                  width="100%"
                  src={`https://flo.uri.sh/${data_src(map_graphs)}/embed`}
                  title="Interactive or visual content"
                  className="flourish-embed-iframe"
                  frameBorder="0"
                  scrolling="no"
                  // style="width:100%;height:600px;"
                  sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
                ></iframe>
              )}

              <Divider />
              <ReferenceInfo content={content} />
              <PublishedModifiedInfo {...props} />
              <ShareInfo {...props} />
            </Grid.Column>
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={4}
              className="col-right"
            >
              <ContentMetadata {...props} />
            </Grid.Column>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default IndicatorView;
