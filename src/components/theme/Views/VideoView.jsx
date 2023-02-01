import React from 'react';
import {
  HTMLField,
  ContentMetadata,
  ExternalLink,
} from '@eeacms/volto-cca-policy/helpers';

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
        <div className="ui grid">
          <div className="row">
            <div className="nine wide column left-col">
              <div className="ui label">Video</div>
              <h1>{content.title}</h1>
              <HTMLField
                value={content.long_description}
                className="long_description"
              />
              {!is_cmshare_video && (
                <ExternalLink
                  url={content.embed_url}
                  text="See video outside Climate-ADAPT"
                />
              )}

              {content?.websites?.length > 0 && (
                <>
                  <h5>Websites</h5>
                  <ul>
                    {content.websites.map((url, index) => (
                      <li key={index}>
                        <ExternalLink url={url} text={url} />
                      </li>
                    ))}
                  </ul>
                </>
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
                  <h4>Contributor</h4>
                  {content.contributor_list
                    .map((item) => item.title)
                    .sort()
                    .join('<br />')}
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
            </div>
            <div className="three wide column right-col">
              <div style={{}}>
                <ContentMetadata {...props} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoView;
