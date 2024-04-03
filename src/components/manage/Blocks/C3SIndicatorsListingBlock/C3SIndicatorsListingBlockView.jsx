import React from 'react';
import { UniversalLink } from '@plone/volto/components';

export default function C3SIndicatorsListingBlockView(props) {
  const { metadata, properties, mode = 'view' } = props;
  const content = metadata || properties;
  const { c3s_indicators_listing } = content?.['@components'] || {};

  if (!c3s_indicators_listing) {
    if (mode === 'edit') {
      return <div>C3SIndicatorsListingBlockView</div>;
    } else {
      return null;
    }
  }

  const { description, items } = c3s_indicators_listing;

  return (
    <div className="block c3sindicators-listing-block">
      <div
        className="description"
        dangerouslySetInnerHTML={{
          __html: description,
        }}
      />
      <ul>
        {items?.map((item, index) => (
          <li key={index}>
            <UniversalLink href={item.url}>{item.title}</UniversalLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
