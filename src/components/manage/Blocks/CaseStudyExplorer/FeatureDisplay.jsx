import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon } from 'semantic-ui-react';

export default function FeatureDisplay({ feature, onClose }) {
  return feature ? (
    <div id="csepopup">
      <div
        className="close"
        role="button"
        onClick={onClose}
        tabIndex={-1}
        onKeyDown={onClose}
      >
        <Icon className="ri-close-circle-line" />
      </div>
      <p>
        <strong>
          <a className="dbitem" href={feature.url} target="_blank">
            {feature.title}
          </a>
        </strong>
      </p>

      {feature.image && (
        <span className="img">
          <center>
            <img src={feature.image} alt={feature.title} />
          </center>
        </span>
      )}

      {feature.adaptations && (
        <p>
          <span className="blue">
            <FormattedMessage
              id="Adaptation sectors"
              defaultMessage="Adaptation sectors"
            />
            {': '}
          </span>
          <span>{feature.adaptations}</span>
        </p>
      )}

      {feature.impacts && (
        <p>
          <span className="blue">
            <FormattedMessage
              id="Climate impacts"
              defaultMessage="Climate impacts"
            />
            {': '}
          </span>
          <span>{feature.impacts}</span>
        </p>
      )}

      {feature.adaptation_options_links && (
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
      )}
    </div>
  ) : null;
}
