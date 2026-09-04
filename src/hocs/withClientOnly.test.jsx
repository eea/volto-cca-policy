import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import withClientOnly from './withClientOnly';

describe('withClientOnly', () => {
  it('renders the wrapped component after mount', () => {
    const Component = (props) => (
      <div data-testid="wrapped-content">{props.text}</div>
    );
    const ClientOnlyComponent = withClientOnly(Component);

    render(<ClientOnlyComponent text="Client Hello" />);

    expect(screen.getByTestId('wrapped-content')).toHaveTextContent(
      'Client Hello',
    );
  });
});
