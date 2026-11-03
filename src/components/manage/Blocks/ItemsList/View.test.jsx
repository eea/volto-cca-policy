import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import View from './View';

jest.mock('@plone/volto/components/manage/UniversalLink/UniversalLink', () => {
  const React = require('react');
  return ({ children, href, item, ...props }) => (
    <a href={href || item?.['@id']} {...props}>
      {children}
    </a>
  );
});

jest.mock('@plone/volto/components/theme/Image/Image', () => {
  const React = require('react');
  return ({ src, alt, className }) => (
    <span
      data-testid="volto-image"
      data-src={src}
      data-alt={alt}
      className={className}
    />
  );
});

describe('ItemsList View', () => {
  it('renders headings, column items, custom icon paths and linked titles', () => {
    render(
      <View
        id="items-list"
        data={{
          title: 'Block title',
          description_top: 'Intro',
          description_bottom: 'Outro',
          listing_mode: 'columns',
          columns: 9,
          icon_size: 32,
          items: [
            {
              title: 'First item',
              description: 'A longer description',
              href: { '@id': '/first' },
              custom_icon_path: '/icons/first.svg',
              custom_hover_icon_path: '/icons/first-hover.svg',
              hover_color: '#123456',
            },
          ],
        }}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Block title' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Intro')).toBeInTheDocument();
    expect(screen.getByText('Outro')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'First item' })).toHaveAttribute(
      'href',
      '/first',
    );
    expect(screen.getByText('A longer description')).toBeInTheDocument();
    expect(screen.getAllByTestId('volto-image')[0]).toHaveAttribute(
      'data-src',
      '/icons/first.svg',
    );
    expect(screen.getAllByTestId('volto-image')[1]).toHaveAttribute(
      'data-src',
      '/icons/first-hover.svg',
    );
    expect(screen.getAllByTestId('volto-image')[0].parentElement).toHaveStyle({
      '--items-list-icon-size': '32px',
      '--items-list-hover-color': '#123456',
    });
    expect(document.querySelector('.items-list-items')).toHaveStyle({
      '--items-list-columns': '6',
    });
  });

  it('renders Remix icons and does not link titles in edit mode', () => {
    render(
      <View
        mode="edit"
        data={{
          listing_mode: 'columns',
          items: [
            {
              title: 'Editable item',
              href: '/target',
              icon: 'ri-home-line',
              hover_icon: 'ri-home-fill',
            },
          ],
        }}
      />,
    );

    expect(screen.getByText('Editable item').tagName).toBe('SPAN');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(document.querySelector('.ri-home-line')).toBeInTheDocument();
    expect(
      document.querySelector('.hover-icon.ri-home-fill'),
    ).toBeInTheDocument();
    expect(document.querySelector('section')).toHaveClass('is-editing');
  });

  it('renders inline items as links in view and as non-link items in edit mode', () => {
    const data = {
      items: [
        { title: 'Linked item', href: ['/linked'], icon: 'home-line' },
        { title: 'Plain item' },
      ],
    };
    const { rerender } = render(<View data={data} />);

    expect(screen.getByRole('link', { name: 'Linked item' })).toHaveAttribute(
      'href',
      '/linked',
    );
    expect(screen.getByText('Linked item')).toHaveClass(
      'items-list-item-title',
    );
    expect(screen.getByTitle('Plain item')).toBeInTheDocument();
    expect(screen.getByText('Plain item')).toHaveClass('items-list-item-title');
    expect(
      document.querySelector('.items-list-item.is-inline-item'),
    ).toBeInTheDocument();

    rerender(<View data={data} mode="edit" />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(document.querySelector('.items-list-items')).toHaveClass(
      'is-inline',
    );
  });

  it('supports the legacy object browser image value and an empty block', () => {
    const { rerender } = render(
      <View
        data={{
          items: [
            {
              custom_icon: {
                '@id': '/content/icon',
                scales: {
                  image: { download: '/content/icon/@@images/image.svg' },
                },
              },
            },
          ],
        }}
      />,
    );

    expect(screen.getByTestId('volto-image')).toHaveAttribute(
      'data-src',
      '/content/icon/@@images/image.svg',
    );

    rerender(<View />);
    expect(document.querySelector('.items-list-block')).toBeInTheDocument();
  });
});
