import React from 'react';
import { UniversalLink } from '@plone/volto/components';

// {
//   "feature": {
//     "OBJECTID": 39,
//     "CNTR_CODE": "PL",
//     "CNTR_NAME": "Poland",
//     "NUTS_ID": "PL9",
//     "NUTS_Name_Excel": "Mazovia (Mazowieckie)",
//     "NAME_LATN": "Makroregion województwo mazowieckie",
//     "NUTS_NAME": "Makroregion województwo mazowieckie",
//     "LEVEL_CODE": "NUTS 1",
//     "Comments": null,
//     "CNTR_FLAG": "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/4.1.4/flags/4x3/pl.svg",
//     "BIOGEO_REG_CODE": "Continental",
//     "BIOGEO_REG_NAME": "Continental Bio-geographical Region",
//     "_maxOverlap": 35559453062.672485,
//     "BIOGEO_NUTS_AREA": "100",
//     "SHAPE_Length": 1473687.3485873593,
//     "SHAPE_Area": 35559453062.672424
//   }
// }

const NutsRegion = ({ feature }) => {
  const fields = [
    ['Name', 'NUTS_NAME'],
    ['Country', 'CNTR_NAME'],
    ['NUTS level', 'LEVEL_CODE'],
    ['NUTS ID', 'NUTS_ID'],
    ['Bioregion', 'BIOGEO_REG_NAME'],
    ['Area', 'SHAPE_Area'],
  ];
  return <FieldsDisplay feature={feature} fields={fields} />;
};

const FieldsDisplay = ({ feature, fields }) => (
  <dl className="feature-info">
    {fields.map(([label, name]) => (
      <div key={name}>
        <dt>{label}</dt>
        <dd>{feature[name]}</dd>
      </div>
    ))}
  </dl>
);

// {
//   "feature": {
//     "OBJECTID": 61,
//     "CNTR_NAME": "Lithuania",
//     "CNTR_CODE": "LT",
//     "LEVEL_CODE": "LAU",
//     "GISCO_ID": "LT_27",
//     "LAU_ID": "27",
//     "LAU_NAME": "Panevėžio miesto savivaldybė",
//     "LAU_Name_Excel": "Panevėžys",
//     "Aggregated": "*",
//     "Value0": null,
//     "CNTR_FLAG": "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/4.1.4/flags/4x3/lt.svg"
//   }
// }

const City = ({ feature }) => {
  const fields = [
    ['Name', 'LAU_NAME'],
    ['Country', 'CNTR_NAME'],
    ['Level', 'LEVEL_CODE'],
    ['GISCO ID', 'GISCO_ID'],
  ];
  return <FieldsDisplay feature={feature} fields={fields} />;
};

export default function FeatureDisplay({ feature }) {
  console.log('Clicked feature', feature);
  return feature ? (
    <div>
      <strong>{feature.title}</strong>
      <span
        style={{
          backgroundColor: '#ddd',
          display: 'block',
          marginBottom: '10px',
        }}
      >
        <center>
          <img style={{ maxHeight: '133px' }} src={feature.image} />
        </center>
      </span>
      <p style={{ fontSize: '13px' }}>
        <p style={{ marginBottom: '10px' }}>
          <span style={{ color: '#069' }}>Adaptation sectors: </span>
          <span>{feature.adaptations}</span>
        </p>
        <p style={{ marginBottom: '10px' }}>
          <span style={{ color: '#069' }}>Climate impacts: </span>
          <span>{feature.impacts}</span>
        </p>
        <span style={{ color: '#069' }}>Adaptation options: </span>
        <span
          dangerouslySetInnerHTML={{
            __html: feature.adaptation_options_links.replace('<>', '; '),
          }}
        ></span>
      </p>
    </div>
  ) : null;
}
