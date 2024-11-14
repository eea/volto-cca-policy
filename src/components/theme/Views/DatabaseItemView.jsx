import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { PrivacyProtection } from '@eeacms/volto-embed';
import { Container, Divider, Grid } from 'semantic-ui-react';
import {
  ShareInfoButton,
  PortalMessage,
} from '@eeacms/volto-cca-policy/components';
import {
  isObservatoryMetadataURL,
  fixEmbedURL,
} from '@eeacms/volto-cca-policy/helpers';
import {
  TOOL,
  GUIDANCE,
  INDICATOR,
  INFORMATION_PORTAL,
  PUBLICATION_REPORT,
  ORGANISATION,
  VIDEO,
} from '@eeacms/volto-cca-policy/helpers/Constants';
import {
  HTMLField,
  ReferenceInfo,
  ContentMetadata,
  PublishedModifiedInfo,
  ItemLogo,
  ContentRelatedItems,
  DocumentsList,
  ExternalLink,
  BannerTitle,
} from '@eeacms/volto-cca-policy/helpers';

const share_eea = ['https://cmshare.eea.eu', 'shareit.eea.europa.eu'];

const dataprotection = {
  enabled: true,
  privacy_cookie_key: 'flourish',
  privacy_statement: [
    {
      children: [
        {
          text:
            'This map is hosted by a third party [Flourish]. ' +
            'By showing the external content you accept the terms ' +
            'and conditions of www.flourish.studio. This includes ' +
            'their cookie policies, which we have no control over.',
        },
      ],
      type: 'p',
    },
  ],
};

const MaybeFlourishVisualization = ({ content }) => {
  const { map_graphs } = content;

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
  const flourishPath = data_src(map_graphs);
  const flourishUrl = map_graphs
    ? `https://flo.uri.sh/${flourishPath}/embed`
    : null;

  return !!flourishPath ? (
    <PrivacyProtection
      data={{
        url: flourishUrl,
        dataprotection: dataprotection,
      }}
    >
      <iframe
        height="980"
        width="100%"
        src={flourishUrl}
        title="Interactive or visual content"
        className="flourish-embed-iframe"
        sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      ></iframe>
    </PrivacyProtection>
  ) : null;
};

function getFirstIframeSrc(htmlString) {
  const regex = /<iframe[^>]+src=["']([^"']+)["']/;
  const match = htmlString.match(regex);
  return match ? match[1] : null;
}

const MaybeIframeVisualization = ({ content }) => {
  const { map_graphs } = content;

  const url = getFirstIframeSrc(map_graphs);

  const [isClient, setIsClient] = React.useState();

  React.useEffect(() => setIsClient(true), []);

  if (!isClient && url) return null;

  // <div dangerouslySetInnerHTML={{ __html: map_graphs }} />
  return (
    <PrivacyProtection
      data={{
        url: url,
        dataprotection: dataprotection,
      }}
    >
      <iframe
        height="980"
        width="100%"
        src={url}
        title="Interactive or visual content"
        className="flourish-embed-iframe"
        sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      ></iframe>
    </PrivacyProtection>
  );
};

const DatabaseItemView = (props) => {
  const { content } = props;
  const type = content['@type'];
  const location = useLocation();
  const isObservatoryItem = isObservatoryMetadataURL(location.pathname);
  const {
    title,
    acronym,
    embed_url,
    long_description,
    organisational_websites,
    organisational_key_activities,
    organisational_contact_information,
    related_documents_presentations,
  } = content;
  const item_title = acronym ? title + ' (' + acronym + ')' : title;

  let subtitle;
  switch (type) {
    case TOOL:
      subtitle = 'Tools';
      break;
    case PUBLICATION_REPORT:
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
    case VIDEO:
      subtitle = 'Video';
      break;
    default:
      subtitle = '';
  }

  const is_cmshare_video = share_eea.some((domain) =>
    content?.embed_url?.includes(domain),
  );

  return (
    <div className="db-item-view">
      <BannerTitle
        content={{ ...content, image: '', title: item_title }}
        data={{
          info: [{ description: '' }],
          hideContentType: true,
          hideCreationDate: true,
          hideModificationDate: true,
          hidePublishingDate: true,
          hideDownloadButton: false,
          hideShareButton: false,
          subtitle: subtitle,
        }}
      />

      <Container>
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

              {type === VIDEO && (
                <>
                  {is_cmshare_video && (
                    <div className="video-wrapper">
                      <center>
                        <video
                          controls="controls"
                          preload="metadata"
                          width="100%"
                          height="480"
                          src={fixEmbedURL(embed_url, is_cmshare_video)}
                        >
                          <track default kind="captions" srcLang="en" src="" />
                        </video>
                      </center>
                    </div>
                  )}
                </>
              )}

              <HTMLField value={long_description} />

              {type === VIDEO && (
                <>
                  {!is_cmshare_video && (
                    <div className="external-video">
                      <ExternalLink
                        url={embed_url}
                        text={
                          <FormattedMessage
                            id="See video outside Climate-ADAPT"
                            defaultMessage="See video outside Climate-ADAPT"
                          />
                        }
                      />
                    </div>
                  )}
                </>
              )}

              {related_documents_presentations && (
                <>
                  <Divider />
                  <h2 className="reference-title">
                    <FormattedMessage
                      id="Related documents and presentations"
                      defaultMessage="Related documents and presentations"
                    />
                  </h2>
                  <HTMLField value={related_documents_presentations} />
                </>
              )}

              {isObservatoryItem && (
                <>
                  {organisational_key_activities && (
                    <>
                      <h3>
                        <FormattedMessage
                          id="Key activities within climate change and health"
                          defaultMessage="Key activities within climate change and health"
                        />
                      </h3>
                      <HTMLField value={organisational_key_activities} />
                    </>
                  )}
                </>
              )}

              <MaybeFlourishVisualization {...props} />
              <MaybeIframeVisualization {...props} />

              <Divider />

              <ReferenceInfo content={content} />

              {isObservatoryItem && (
                <>
                  {organisational_websites && (
                    <>
                      <h5>
                        <FormattedMessage
                          id="Links to further information"
                          defaultMessage="Links to further information"
                        />
                      </h5>
                      <HTMLField value={organisational_websites} />
                    </>
                  )}

                  {organisational_contact_information && (
                    <>
                      <h5>
                        <FormattedMessage
                          id="Contact information for the Observatory"
                          defaultMessage="Contact information for the Observatory"
                        />
                      </h5>
                      <HTMLField value={organisational_contact_information} />
                    </>
                  )}
                </>
              )}

              <ContentRelatedItems {...props} />
              <PublishedModifiedInfo {...props} />
              <ShareInfoButton {...props} />
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
      </Container>
    </div>
  );
};

export default DatabaseItemView;
