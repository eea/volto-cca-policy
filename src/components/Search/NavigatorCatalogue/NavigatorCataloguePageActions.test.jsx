import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import NavigatorCataloguePageActions from './NavigatorCataloguePageActions';

jest.mock('react-redux', () => ({
  useSelector: (selector) => selector({ intl: { locale: 'de' } }),
}));
jest.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));
jest.mock('semantic-ui-react', () => ({
  Button: ({
    as: Component = 'button',
    children,
    icon,
    inverted,
    labelPosition,
    primary,
    secondary,
    ...props
  }) => (
    <Component
      className={[
        'ui button',
        inverted && 'inverted',
        icon && 'icon',
        labelPosition && `${labelPosition} labeled`,
        primary && 'primary',
        secondary && 'secondary',
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </Component>
  ),
  Icon: ({ className }) => <i className={className} />,
}));

describe('NavigatorCataloguePageActions', () => {
  it('shows language-aware About and FAQ actions', () => {
    render(
      <IntlProvider locale="en">
        <NavigatorCataloguePageActions />
      </IntlProvider>,
    );

    const about = screen.getByRole('link', { name: 'About' });
    const faq = screen.getByRole('link', { name: 'FAQ' });

    expect(about).toHaveAttribute('href', '/de/navigator/about');
    expect(about).toHaveAttribute('target', '_blank');
    expect(about).toHaveAttribute('rel', 'noopener noreferrer');
    expect(about).toHaveClass('secondary', 'inverted');
    expect(about.querySelector('.ri-information-line')).toBeInTheDocument();
    expect(faq).toHaveAttribute('href', '/de/navigator/navigator-faq');
    expect(faq).toHaveAttribute('target', '_blank');
    expect(faq).toHaveAttribute('rel', 'noopener noreferrer');
    expect(faq).toHaveClass('primary', 'inverted');
    expect(faq.querySelector('.ri-question-line')).toBeInTheDocument();
  });
});
