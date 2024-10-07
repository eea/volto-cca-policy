// Original: https://github.com/eea/volto-searchlib/blob/master/searchlib/components/Result/HorizontalCardItem.jsx
// We need custom href for results.
import React from 'react';
import { Label } from 'semantic-ui-react';
import {
  SegmentedBreadcrumb,
  StringList,
  DateTime,
} from '@eeacms/search/components';
import { useAppConfig } from '@eeacms/search/lib/hocs';

import ExternalLink from '@eeacms/search/components/Result/ExternalLink';
import ResultContext from '@eeacms/search/components/Result/ResultContext';
import ContentClusters from '@eeacms/search/components/Result/ContentClusters';

const healthURL = (href, is_observatory) => {
  if (is_observatory) {
    return href.replace(/\/metadata\//, '/observatory/++aq++metadata/');
  }
  return href;
};

const healthBreadcrumb = (href, is_observatory) => {
  // It's only cosmetic. We don't want to show ++aq...
  if (is_observatory) {
    return href.replace(/\/metadata\//, '/observatory/');
  }
  return href;
};

const ExtraContent = (props) => {
  const { result, is_mission, is_observatory } = props;
  let title = 'Climate-ADAPT';
  if (is_mission) {
    title = 'Mission Portal';
  }
  if (is_observatory) {
    title = 'Health Observatory';
  }
  return (
    <div>
      <div className="result-bottom">
        <div className="result-info">
          {/* <span className="result-info-title">Published: </span> */}
          <DateTime format="DATE_MED" value={result.issued} />
        </div>
        <div className="result-info">
          <span className="result-info-title">Topics: </span>
          <StringList value={result.tags} />
        </div>
      </div>
      <div>
        <div className="result-info result-source">
          <span className="result-info-title">Source: </span>
          <ExternalLink href={healthURL(result.href, is_observatory)}>
            <strong title={result.source} className="source">
              {title}
              {/* {firstWords(
                getTermDisplayValue({
                  vocab,
                  field: 'cluster_name',
                  term: result.source,
                }),
                8,
              )} */}
            </strong>
            <SegmentedBreadcrumb
              href={healthBreadcrumb(result.href, is_observatory)}
              short={true}
              maxChars={40}
            />
          </ExternalLink>
        </div>
      </div>
    </div>
  );
};

const ClusterHorizontalCardItem = (props) => {
  const { result } = props;
  const { registry } = useAppConfig();
  const clusters = result.clusterInfo;

  const UniversalCard = registry.resolve['UniversalCard'].component;

  let is_mission = false;
  let is_observatory = false;
  if (
    result.cca_include_in_mission.raw === 'true' ||
    result.href.includes('climate-adapt.eea.europa.eu/en/mission')
  ) {
    is_mission = true;
  }
  if (result.cca_include_in_search_observatory.raw === 'true') {
    is_observatory = true;
  }

  const item = {
    '@id': result.href,
    title: (
      <>
        <ExternalLink
          href={healthURL(result.href, is_observatory)}
          title={result.title}
        >
          {result.title}
          {result.isNew && <Label className="new-item">New</Label>}
          {result.isExpired && (
            <Label className="archived-item">Archived</Label>
          )}
        </ExternalLink>
      </>
    ),
    meta: <ContentClusters clusters={clusters} item={result} />,
    description: props.children ? props.children : <ResultContext {...props} />,
    preview_image_url: result.hasImage ? result.thumbUrl : undefined,
    extra: (
      <ExtraContent
        result={result}
        is_mission={is_mission}
        is_observatory={is_observatory}
      />
    ),
  };

  const itemModel = {
    hasImage: result.hasImage,
    hasDescription: true,
    imageOnRightSide: true,
    '@type': 'searchItem',
  };

  return <UniversalCard item={item} itemModel={itemModel} />;
};

export default ClusterHorizontalCardItem;
