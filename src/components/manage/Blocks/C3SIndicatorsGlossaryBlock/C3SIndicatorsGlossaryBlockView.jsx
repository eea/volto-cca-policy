import React from 'react';

export default function C3SIndicatorsGlossaryBlockView(props) {
  const { metadata, properties, mode = 'view' } = props;
  const content = metadata || properties;
  const { c3s_indicators_glossary_table } = content?.['@components'] || {};

  return (
    <div className="block c3sindicators-glossary-block">
      <div
        className="glossary-table"
        dangerouslySetInnerHTML={{
          __html: c3s_indicators_glossary_table || 'No content',
        }}
      />
    </div>
  );
}
