import React from 'react';
import { HTMLField, ContentMetadata } from '@eeacms/volto-cca-policy/helpers';

function VideoView(props) {
  const { content } = props;
  const share_eea = ['https://cmshare.eea.eu', 'shareit.eea.europa.eu'];
  const is_cmshare_video = share_eea.some((domain) =>
    content.embed_url.includes(domain),
  );

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
                <a href="{content.embed_url}" target="_blank">
                  See video outside Climate-ADAPT
                </a>
              )}

              {content?.websites?.length > 0 && (
                <>
                  <h5>Websites</h5>
                  <ul>
                    {content.websites.map((url, index) => (
                      <li key={index}>
                        <a href={url}>
                          <i
                            aria-hidden="true"
                            className="icon ri-share-box-fill"
                          />
                          {url}
                        </a>
                        <br />
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

              {content?.contributor_list?.length > 0 && (
                <>
                  <h4>Contributor</h4>
                  {content.contributor_list
                    .map((item) => item.title)
                    .sort()
                    .join('<br>')}
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
                    src={content.embed_url}
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
