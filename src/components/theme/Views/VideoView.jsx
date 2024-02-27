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
                src={fixEmbedURL(content.embed_url)}
              >
                <track default kind="captions" srcLang="en" src="" />
              </video>
            </center>
          </div>
        )}

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

        <Divider />

        {content?.related_documents_presentations && (
          <>
            <h2 className="reference-title">
              Related documents and presentations
            </h2>
            <HTMLField value={content.related_documents_presentations} />
          </>
        )}

        {content?.websites?.length > 0 && (
          <h2 className="reference-title">Reference information</h2>
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
            <h5>Contributor:</h5>
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
