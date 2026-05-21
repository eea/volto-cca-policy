import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';

function VersionsGroup({ content }) {
  const relatedItems = content?.relatedItems || [];
  const currentId = content?.['@id'];
  const currentState = content?.review_state;

  // Find the latest (published) version
  const latestFromRelated = relatedItems.find(
    (item) => item.review_state === 'published',
  );

  // The latest version is either the current object (if published)
  // or the published item found in relatedItems
  const latestVersion =
    currentState === 'published'
      ? { '@id': currentId, title: content?.title, created: content?.created }
      : latestFromRelated;

  // Collect archived versions:
  // - If current is published: archived copies are in relatedItems
  // - If current is archived: include current object + any archived copies in relatedItems
  let archivedVersions = relatedItems.filter(
    (item) => item.review_state === 'archived',
  );

  if (currentState === 'archived') {
    // Ensure the current archived copy is included in the list
    const currentInList = archivedVersions.some(
      (item) => item['@id'] === currentId,
    );
    if (!currentInList) {
      archivedVersions = [
        ...archivedVersions,
        {
          '@id': currentId,
          title: content?.title,
          created: content?.created,
        },
      ];
    }
  }

  // Sort by creation date ascending
  archivedVersions.sort((a, b) => new Date(a.created) - new Date(b.created));

  // Build the full version list: latest first, then archived copies
  const versions = [];
  if (latestVersion) {
    versions.push({ ...latestVersion, isLatest: true });
  }
  versions.push(...archivedVersions.map((v) => ({ ...v, isLatest: false })));

  if (versions.length <= 1) return null;

  return (
    <div className="versions-group">
      <h5>
        <FormattedMessage id="Versions" defaultMessage="Versions" />
      </h5>
      <ul>
        {versions.map((version) => {
          const url = flattenToAppURL(version['@id']);
          const isCurrent = version['@id'] === currentId;
          return (
            <li key={version['@id']}>
              {isCurrent ? (
                <strong>
                  {version.title}
                  {version.isLatest && (
                    <span>
                      {' '}
                      (
                      <FormattedMessage id="latest" defaultMessage="latest" />)
                    </span>
                  )}
                </strong>
              ) : (
                <Link to={url}>
                  {version.title}
                  {version.isLatest && (
                    <span>
                      {' '}
                      (
                      <FormattedMessage id="latest" defaultMessage="latest" />)
                    </span>
                  )}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default VersionsGroup;
