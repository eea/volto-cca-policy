import React from 'react';
import {
  TOOL,
  GUIDANCE,
  INDICATOR,
  INFORMATION_PORTAL,
  PUBICATION_REPORT,
  ORGANISATION,
} from '@eeacms/volto-cca-policy/helpers/Constants';
import {
  HTMLField,
  ReferenceInfo,
  ContentMetadata,
  PublishedModifiedInfo,
  ItemLogo,
  ShareInfo,
  ContentRelatedItems,
  DocumentsList,
  BannerTitle,
} from '@eeacms/volto-cca-policy/helpers';
import {
  PortalMessage,
  TranslationDisclaimer,
} from '@eeacms/volto-cca-policy/components';
import { isObservatoryMetadataURL } from '@eeacms/volto-cca-policy/helpers';
import { Divider, Grid } from 'semantic-ui-react';
import { useLocation } from 'react-router-dom';

const DatabaseItemView = (props) => {
  const { content } = props;
  const type = content['@type'];
  const location = useLocation();
  const isObservatoryItem = isObservatoryMetadataURL(location.pathname);
  const {
    title,
    acronym,
    map_graphs,
    long_description,
    organisational_websites,
    organisational_key_activities,
    organisational_contact_information,
  } = content;
  const item_title = acronym ? title + ' (' + acronym + ')' : title;

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
    case ORGANISATION:
      subtitle = 'Organisation';
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
      <BannerTitle
        content={{ ...content, image: '', title: item_title }}
        type={subtitle}
      />
      <TranslationDisclaimer />

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
              <ItemLogo {...props}></ItemLogo>
              <HTMLField value={long_description} />

              {isObservatoryItem && (
                <>
                  {organisational_key_activities && (
                    <>
                      <h3>Key activities within climate change and health</h3>
                      <HTMLField value={organisational_key_activities} />
                    </>
                  )}
                </>
              )}

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

              {isObservatoryItem && (
                <>
                  {organisational_websites && (
                    <>
                      <h5>Links to further information</h5>
                      <HTMLField value={organisational_websites} />
                    </>
                  )}

                  {organisational_contact_information && (
                    <>
                      <h5>Contact information for the Observatory</h5>
                      <HTMLField value={organisational_contact_information} />
                    </>
                  )}
                </>
              )}

              <ContentRelatedItems {...props} />
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
