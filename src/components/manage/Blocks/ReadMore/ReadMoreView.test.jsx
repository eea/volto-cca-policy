import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ReadMoreView from './ReadMoreView';

describe('ReadMoreView', () => {
  /* eslint-disable no-console */
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn((...args) => {
      if (args[0]?.includes?.('unmountComponentAtNode')) return;
      originalError(...args);
    });
  });
  afterAll(() => {
    console.error = originalError;
  });
  /* eslint-enable no-console */

  it('renders with default labels and toggles on click', () => {
    const data = {
      label_closed: 'Show more',
      label_opened: 'Show less',
      label_position: 'left',
      height: '200px',
    };

    const { container } = render(<ReadMoreView data={data} mode="view" />);

    expect(screen.getByText('Show more')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Show less')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Show more')).toBeInTheDocument();

    expect(container).toBeTruthy();
  });
});
