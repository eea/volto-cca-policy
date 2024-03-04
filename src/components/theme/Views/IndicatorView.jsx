import React from 'react';
import {
  HTMLField,
  ContentMetadata,
  LinksList,
  PublishedModifiedInfo,
  ShareInfo,
  BannerTitle,
} from '@eeacms/volto-cca-policy/helpers';
import { Segment, Divider, Image } from 'semantic-ui-react';

function IndicatorView(props) {
  const { content } = props;
  const {
    long_description,
    websites,
    source,
    contributor_list,
    other_contributor,
    logo,
    map_graphs,
  } = content;

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
    <div className="db-item-view indicator-view">
      <BannerTitle content={{ ...content, image: '' }} type="Indicator" />

      <div className="ui container">
        {logo && (
          <Image
            src={logo?.scales?.mini?.download}
            alt={content.title}
            className="db-logo"
          />
        )}
        <h2>Description</h2>
        <HTMLField value={long_description} />

        {!!data_src(map_graphs) && (
          <iframe
            height="980"
            width="100%"
            src={`https://flo.uri.sh/${data_src(map_graphs)}/embed`}
            title="Interactive or visual content"
            class="flourish-embed-iframe"
            frameborder="0"
            scrolling="no"
            // style="width:100%;height:600px;"
            sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          ></iframe>
        )}

        <Divider />
        <h2>Reference information</h2>

        {websites && websites?.length > 0 && (
          <LinksList title="Websites:" value={websites} />
        )}

        <h5>Source:</h5>
        <HTMLField value={source} />
        {(contributor_list?.length > 0 || other_contributor?.length > 0) && (
          <>
            <h4>Contributor:</h4>
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
        <PublishedModifiedInfo {...props} />
        <ShareInfo {...props} />

        <div className="content-box">
          <div className="content-box-inner">
            <Segment>
              <ContentMetadata {...props} />
            </Segment>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IndicatorView;
