import React from 'react';

export default function FeatureDisplay({ feature }) {
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
          <img
            style={{ maxHeight: '133px' }}
            src={feature.image}
            alt={feature.title}
          />
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
