import React from 'react';

export default function C3SIndicatorsOverviewBlockView(props) {
  const { metadata, properties, mode = 'view' } = props;
  const content = metadata || properties;
  const { c3s_indicators_overview } = content?.['@components'] || {};

  if (!c3s_indicators_overview) {
    if (mode === 'edit') {
      return <div>C3SIndicatorsOverviewBlockView</div>;
    } else {
      return null;
    }
  }

  return (
    <div className="block c3sindicators-overview-block">
      <div
        className="description"
        dangerouslySetInnerHTML={{
          __html: c3s_indicators_overview,
        }}
      />
    </div>
  );
}
