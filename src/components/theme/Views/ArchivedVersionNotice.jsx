import React from 'react';
import { Link } from 'react-router-dom';
import { Message } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { flattenToAppURL } from '@plone/volto/helpers';

function ArchivedVersionNotice({ content }) {
  if (content?.review_state !== 'archived') return null;

  const relatedItems = content?.relatedItems || [];
  const latestVersion = relatedItems.find(
    (item) => item.review_state === 'published',
  );

  if (!latestVersion) return null;

  const latestUrl = flattenToAppURL(latestVersion['@id']);

  return (
    <Message info className="archived-version-notice">
      <Message.Content>
        <FormattedMessage
          id="You are viewing an archived version."
          defaultMessage="You are viewing an archived version."
        />{' '}
        <Link to={latestUrl}>
          <FormattedMessage
            id="View latest version"
            defaultMessage="View latest version"
          />
        </Link>
      </Message.Content>
    </Message>
  );
}

export default ArchivedVersionNotice;
