import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import SimpleCardsListingView from './SimpleCardsListingView';

const mockStore = configureStore();

jest.mock('@plone/volto/components', () => ({
  ConditionalLink: ({ children }) => <div>{children}</div>,
}));

describe('SimpleCardsListingView', () => {
  it('renders card titles and placeholders when no image', () => {
    const items = [
      { '@id': '/item-1', title: 'Item One' },
      { '@id': '/item-2', title: 'Item Two' },
    ];

    const store = mockStore({
      intl: { locale: 'en', messages: {} },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <SimpleCardsListingView items={items} isEditMode={false} />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Item One')).toBeInTheDocument();
    expect(screen.getByText('Item Two')).toBeInTheDocument();

    // Should render two placeholders for images
    expect(document.querySelectorAll('.no-image-placeholder').length).toBe(2);
  });

  it('renders image src and applies objectFit based on presence of image vs logo', () => {
    const items = [
      {
        '@id': '/item-img',
        title: 'With Image',
        image: { scales: { preview: { download: '/img1.jpg' } } },
      },
      {
        '@id': '/item-logo',
        title: 'With Logo',
        logo: { scales: { preview: { download: '/logo1.png' } } },
      },
    ];

    const store = mockStore({
      intl: { locale: 'en', messages: {} },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <SimpleCardsListingView items={items} isEditMode={false} />
        </MemoryRouter>
      </Provider>,
    );

    // Check images are present with correct src and alt
    const imgWithImage = screen.getByAltText('With Image');
    const imgWithLogo = screen.getByAltText('With Logo');

    expect(imgWithImage).toBeInTheDocument();
    expect(imgWithImage).toHaveAttribute('src', '/img1.jpg');
    // objectFit style is 'cover' when image present
    expect(imgWithImage.style.objectFit).toBe('cover');

    expect(imgWithLogo).toBeInTheDocument();
    expect(imgWithLogo).toHaveAttribute('src', '/logo1.png');
    // objectFit style is 'contain' when logo present
    expect(imgWithLogo.style.objectFit).toBe('contain');
  });
});
