import { render } from '@testing-library/react';
import PortalMessage from './PortalMessage';
import { IntlProvider } from 'react-intl';
import '@testing-library/jest-dom';

const renderWithIntl = (ui) =>
  render(<IntlProvider locale="en">{ui}</IntlProvider>);

describe('PortalMessage', () => {
  it('renders the message component when content is archived', () => {
    const content = { review_state: 'archived' };
    const { container } = renderWithIntl(<PortalMessage content={content} />);

    const messageEl = container.querySelector('.ui.message');
    expect(messageEl).toBeInTheDocument();
  });

  it('renders nothing when content is not archived', () => {
    const content = { review_state: 'published' };
    const { container } = renderWithIntl(<PortalMessage content={content} />);

    expect(container).toBeEmptyDOMElement();
  });
});
