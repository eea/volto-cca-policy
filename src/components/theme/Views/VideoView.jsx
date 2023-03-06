import React from 'react';
import {
  HTMLField,
  ContentMetadata,
  ExternalLink,
  LinksList,
  ShareInfo,
} from '@eeacms/volto-cca-policy/helpers';
import { Grid } from 'semantic-ui-react';

function VideoView(props) {
  const { content } = props;
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
    <div className="video-view">
      <div className="ui container">
        <Grid columns="12">
          <div className="row">
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={9}
              className="col-left"
            >
              <div className="ui label">Video</div>
              <h1>{content.title}</h1>
              <HTMLField
                value={content.long_description}
                className="long_description"
              />
              {!is_cmshare_video && (
                <div className="external-video">
                  <ExternalLink
                    url={content.embed_url}
                    text="See video outside Climate-ADAPT"
                  />
                </div>
              )}

              {content?.related_documents_presentations && (
                <>
                  <h4 className="reference-title">
                    Related documents and presentations
                  </h4>
                  <HTMLField value={content.related_documents_presentations} />
                </>
              )}

              {content?.websites?.length > 0 && (
                <h4 className="reference-title">Reference information</h4>
              )}

              {content?.websites?.length > 0 && (
                <LinksList title="Websites" value={content.websites} />
              )}

              {content?.source && (
                <>
                  <h5>Source</h5>
                  <HTMLField value={content.source} />
                </>
              )}

              {(content?.contributor_list?.length > 0 ||
                content?.other_contributor?.length > 0) && (
                <>
                  <h4>Contributor:</h4>
                  {content.contributor_list
                    .map((item) => (
                      <>
                        {item.title}
                        <br />
                      </>
                    ))
                    .sort()}
                  {content.other_contributor}
                </>
              )}

              {is_cmshare_video && (
                <center>
                  <video
                    controls="controls"
                    preload="metadata"
                    width="640px"
                    height="360"
                    src={fixEmbedURL(content.embed_url)}
                  >
                    <track default kind="captions" srcLang="en" src="" />
                  </video>
                </center>
              )}

              <ShareInfo {...props} />
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

export default VideoView;
