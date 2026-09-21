import React from 'react';
import { Icon } from 'semantic-ui-react';

/**
 * Renders the "Suggested next steps" callout box in the CCA chatbot
 * catalogue presentation.
 */
function SuggestedNextSteps({ title = 'Suggested next steps', children }) {
  return (
    <div className="cca-suggested-next-steps">
      <div className="cca-suggested-next-steps-header">
        <Icon className="ri-list-check-2" aria-hidden="true" />
        <span className="cca-suggested-next-steps-title">{title}</span>
      </div>
      <div className="cca-suggested-next-steps-content">{children}</div>
    </div>
  );
}

export default SuggestedNextSteps;
