import React from 'react';
import {
  HTMLField,
  ContentMetadata,
  ExternalLink,
  LinksList,
  ShareInfo,
  BannerTitle,
} from '@eeacms/volto-cca-policy/helpers';
import { Divider, Segment, Image, Grid } from 'semantic-ui-react';

function VideoView(props) {
  const { content } = props;
  const {
    source,
    websites,
    embed_url,
    contributor_list,
    long_description,
    other_contributor,
    related_documents_presentations,
    logo,
    title,
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

              {websites && websites?.length > 0 && (
                <>
                  <h2 className="reference-title">Reference information</h2>
                  <LinksList title="Websites" value={websites} />
                </>
              )}

              {source && (
                <>
                  <h5>Source</h5>
                  <HTMLField value={source} />
                </>
              )}

              {(contributor_list?.length > 0 ||
                other_contributor?.length > 0) && (
                <>
                  <h5>Contributor:</h5>
                  {contributor_list
                    .map((item) => (
                      <>
                        {item.title}
                        <br />
                      </>
                    ))
                    .sort()}
                  {other_contributor}
                </>
              )}

              <ShareInfo {...props} />
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
