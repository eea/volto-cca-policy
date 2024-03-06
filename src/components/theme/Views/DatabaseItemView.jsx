import React from 'react';
import {
  TOOL,
  GUIDANCE,
  INDICATOR,
  INFORMATION_PORTAL,
  PUBICATION_REPORT,
} from '@eeacms/volto-cca-policy/helpers/Constants';
import {
  HTMLField,
  ReferenceInfo,
  ContentMetadata,
  PublishedModifiedInfo,
  LogoWrapper,
  ShareInfo,
  DocumentsList,
  BannerTitle,
} from '@eeacms/volto-cca-policy/helpers';
import { PortalMessage } from '@eeacms/volto-cca-policy/components';
import { Divider, Image, Grid } from 'semantic-ui-react';

const DatabaseItemView = (props) => {
  const { content } = props;
  const type = content['@type'];
  const { logo, title, long_description, map_graphs } = content;

  let subtitle;
  switch (type) {
    case TOOL:
      subtitle = 'Tools';
      break;
    case PUBICATION_REPORT:
      subtitle = 'Publications and Report';
      break;
    case GUIDANCE:
      subtitle = 'Guidance Document';
      break;
    case INDICATOR:
      subtitle = 'Indicator';
      break;
    case INFORMATION_PORTAL:
      subtitle = 'Information Portal';
      break;
    default:
      subtitle = '';
  }

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
    <div className="db-item-view">
      <BannerTitle content={{ ...content, image: '' }} type={subtitle} />

      <div className="ui container">
        <PortalMessage content={content} />
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
              <DocumentsList {...props} />
            </Grid.Column>
          </div>
        </Grid>
      </div>
    </div>
  );
};

export default DatabaseItemView;
