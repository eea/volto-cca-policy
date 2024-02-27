import React from 'react';
import {
  HTMLField,
  ContentMetadata,
  ExternalLink,
  LinksList,
  ShareInfo,
  BannerTitle,
} from '@eeacms/volto-cca-policy/helpers';
import { Divider, Segment } from 'semantic-ui-react';

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
      <BannerTitle content={content} type="Video" />

      <div className="ui container">
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

        {websites?.length > 0 && (
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

        {(contributor_list?.length > 0 || other_contributor?.length > 0) && (
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

        <div class="content-box">
          <div class="content-box-inner">
            <Segment>
              <ContentMetadata {...props} />
            </Segment>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoView;
