import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import { AccordionList } from '@eeacms/volto-cca-policy/components';

function ArchivedVersionListing({ content }) {
  const { archived_versions } = content;

  const items = archived_versions?.map((version) => (
    <div key={version['@id']}>
      <Link to={flattenToAppURL(version['@id'])}>
        {version.title || flattenToAppURL(version['@id'])}
      </Link>
    </div>
  ));

  if (!items?.length) {
    return null;
  }

  return (
    <AccordionList
      variation="secondary"
      accordions={[
        {
          title: (
            <FormattedMessage
              id="Previous versions of this indicator"
              defaultMessage="Previous versions of this indicator"
            />
          ),
          content: items,
        },
      ]}
    />
  );
}

export default ArchivedVersionListing;
