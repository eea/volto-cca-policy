import React from 'react';
import { FormattedMessage } from 'react-intl';

export default function FeatureDisplay({ feature }) {
  return feature ? (
    <div id="csepopup">
      <p>
        <strong>
          <a className="dbitem" href={feature.url} target="_blank">
            {feature.title}
          </a>
        </strong>
      </p>
      <span className="img">
        <center>
          <img src={feature.image} alt={feature.title} />
        </center>
      </span>
      <p style={{ marginBottom: '10px' }}>
        <span className="blue">
          <FormattedMessage
            id="Adaptation sectors"
            defaultMessage="Adaptation sectors"
          />
          {': '}
        </span>
        <span>{feature.adaptations}</span>
      </p>
      <p style={{ marginBottom: '10px' }}>
        <span className="blue">
          <FormattedMessage
            id="Climate impacts"
            defaultMessage="Climate impacts"
          />
          {': '}
        </span>
        <span>{feature.impacts}</span>
      </p>
      <p>
        <span className="blue">
          <FormattedMessage
            id="Adaptation options"
            defaultMessage="Adaptation options"
          />
          {': '}
        </span>
        <span
          dangerouslySetInnerHTML={{
            __html: feature.adaptation_options_links.replaceAll('<>', '; '),
          }}
        ></span>
      </p>
    </div>
  ) : null;
}
