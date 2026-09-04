import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import SuggestedNextSteps from './SuggestedNextSteps';

describe('SuggestedNextSteps component', () => {
  it('renders default title and icon', () => {
    const { container } = render(
      <SuggestedNextSteps>
        <ol>
          <li>Step one</li>
        </ol>
      </SuggestedNextSteps>,
    );

    expect(screen.getByText('Suggested next steps')).toBeInTheDocument();
    expect(screen.getByText('Step one')).toBeInTheDocument();

    const icon = container.querySelector('.ri-list-check-2');
    expect(icon).toBeInTheDocument();
  });

  it('renders custom title when provided', () => {
    render(
      <SuggestedNextSteps title="How to use them">
        <p>Follow instructions.</p>
      </SuggestedNextSteps>,
    );

    expect(screen.getByText('How to use them')).toBeInTheDocument();
    expect(screen.getByText('Follow instructions.')).toBeInTheDocument();
  });
});
