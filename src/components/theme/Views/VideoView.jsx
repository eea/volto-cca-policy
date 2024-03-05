import React from 'react';
import {
  HTMLField,
  ReferenceInfo,
  ContentMetadata,
  ExternalLink,
  ShareInfo,
  BannerTitle,
} from '@eeacms/volto-cca-policy/helpers';
import { Divider, Image, Grid } from 'semantic-ui-react';

function VideoView(props) {
  const { content } = props;
  const {
    logo,
    title,
    embed_url,
    long_description,
    related_documents_presentations,
  } = content;

  const share_eea = ['https://cmshare.eea.eu', 'shareit.eea.europa.eu'];
  const is_cmshare_video = share_eea.some((domain) =>
    content.embed_url.includes(domain),
  );

  const fixEmbedURL = (url) => {
    const suffix = '/download';
    if (is_cmshare_video && !url.includes(suffix)) {
      return url + suffix;
    }
    return url;
  };

  return (
    <div className="db-item-view video-view">
      <BannerTitle content={{ ...content, image: '' }} type="Video" />

      <div className="ui container">
        <Grid columns="12">
          <div className="row">
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={8}
              className="col-left"
            >
              {is_cmshare_video && (
                <div className="video-wrapper">
                  <center>
                    <video
                      controls="controls"
                      preload="metadata"
                      width="100%"
                      height="480"
                      src={fixEmbedURL(embed_url)}
                    >
                      <track default kind="captions" srcLang="en" src="" />
                    </video>
                  </center>
                </div>
              )}

              <HTMLField value={long_description} />

              {!is_cmshare_video && (
                <div className="external-video">
                  <ExternalLink
                    url={embed_url}
                    text="See video outside Climate-ADAPT"
                  />
                </div>
              )}

              <Divider />

              {related_documents_presentations && (
                <>
                  <h2 className="reference-title">
                    Related documents and presentations
                  </h2>
                  <HTMLField value={related_documents_presentations} />
                </>
              )}

              <ReferenceInfo content={content} />
              <ShareInfo {...props} />
            </Grid.Column>
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={4}
              className="col-right"
            >
              <ContentMetadata {...props} />

              {logo && (
                <Image
                  src={logo?.scales?.mini?.download}
                  alt={title}
                  className="db-logo"
                />
              )}
            </Grid.Column>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default VideoView;
