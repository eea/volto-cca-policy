import React from 'react';
import { FormattedMessage } from 'react-intl';
import { PrivacyProtection } from '@eeacms/volto-embed';
import { Container, Divider, Grid } from 'semantic-ui-react';
import {
  ShareInfoButton,
  PortalMessage,
} from '@eeacms/volto-cca-policy/components';
import { fixEmbedURL } from '@eeacms/volto-cca-policy/helpers';
import {
  buildFlourishUrl,
  flourishDataprotection,
  getDataSrcFromEmbedCode,
} from '@eeacms/volto-cca-policy/helpers/flourishUtils';
import {
  VIDEO,
  CONTENT_TYPE_LABELS,
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

const SHARE_EEA = ['https://cmshare.eea.eu', 'shareit.eea.europa.eu'];

const MaybeFlourishVisualization = ({ content }) => {
  const { map_graphs } = content;

  // https://helpcenter.flourish.studio/hc/en-us/articles/8761537208463-How-to-embed-Flourish-charts-in-your-CMS
  const flourishPath = getDataSrcFromEmbedCode(map_graphs);
  const flourishUrl = buildFlourishUrl(flourishPath);

  return !!flourishPath ? (
    <PrivacyProtection
      data={{
        url: flourishUrl,
        dataprotection: flourishDataprotection,
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
  const iframeRegex = /<iframe[^>]+src=["']([^"']+)["']/;
  const iframeMatch = htmlString.match(iframeRegex);
  if (iframeMatch) {
    return iframeMatch[1];
  }

  try {
    const url = new URL(htmlString);
    return url.href;
  } catch (e) {
    return null;
  }
}

const MaybeIframeVisualization = ({ content }) => {
  const { map_graphs, map_graphs_height } = content;
  const url = getFirstIframeSrc(map_graphs || '');
  const height = map_graphs_height || 800;
  const [isClient, setIsClient] = React.useState();

  React.useEffect(() => setIsClient(true), []);

  if (!(isClient && url)) return null;

  return (
    <PrivacyProtection
      data={{
        url: url,
        dataprotection: flourishDataprotection,
      }}
    >
      <iframe
        height={height}
        width="100%"
        src={url}
        title="Interactive or visual content"
        className="flourish-embed-iframe"
        sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      ></iframe>
    </PrivacyProtection>
  );
};

const BottomInfo = (props) => {
  const { content } = props;
  const { organisational_websites, organisational_contact_information } =
    content;

  return (
    <>
      <Divider />
      <ReferenceInfo content={content} />

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

      <ContentRelatedItems {...props} />
      <PublishedModifiedInfo {...props} />
      <ShareInfoButton {...props} />
    </>
  );
};

const DatabaseItemView = (props) => {
  const { content } = props;
  const type = content['@type'];
  const {
    title,
    acronym,
    embed_url,
    long_description,
    organisational_key_activities,
    related_documents_presentations,
  } = content;
  const item_title = acronym ? title + ' (' + acronym + ')' : title;
  const subtitle = CONTENT_TYPE_LABELS[type] ?? '';
  const hasVisualization = !!content?.map_graphs?.length;
  const isFullWidthVisualization =
    hasVisualization && content?.map_graphs_full_width;

  const is_cmshare_video = SHARE_EEA.some((domain) =>
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
          <Grid.Row>
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={8}
              className="col-left"
            >
              <ItemLogo {...props} />

              {type === VIDEO && is_cmshare_video && (
                <div className="video-wrapper">
                  <center>
                    <video
                      controls="controls"
                      preload="metadata"
                      width="100%"
                      height="480"
                      src={fixEmbedURL(embed_url, is_cmshare_video)}
                      type="video/mp4"
                    >
                      <track default kind="captions" srcLang="en" src="" />
                    </video>
                  </center>
                </div>
              )}

              <HTMLField value={long_description} />

              {type === VIDEO && !is_cmshare_video && (
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

              {hasVisualization && !isFullWidthVisualization && (
                <>
                  <MaybeFlourishVisualization {...props} />
                  <MaybeIframeVisualization {...props} />
                </>
              )}

              {!isFullWidthVisualization && <BottomInfo {...props} />}
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
          </Grid.Row>

          {isFullWidthVisualization && (
            <>
              <Grid.Row>
                <Grid.Column mobile={12} tablet={12} computer={12}>
                  <MaybeFlourishVisualization {...props} />
                  <MaybeIframeVisualization {...props} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column
                  mobile={12}
                  tablet={12}
                  computer={12}
                  className="col-left"
                >
                  <BottomInfo {...props} />
                </Grid.Column>
              </Grid.Row>
            </>
          )}
        </Grid>
      </Container>
    </div>
  );
};

export default DatabaseItemView;
