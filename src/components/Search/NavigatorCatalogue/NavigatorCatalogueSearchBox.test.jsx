import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import NavigatorCatalogueSearchBox from './NavigatorCatalogueSearchBox';

jest.mock('@eeacms/search/components/SearchBox/SearchBoxView', () => () => (
  <h2 className="searchApp-headline">Catalogue headline</h2>
));
jest.mock('./NavigatorCataloguePageActions', () => () => (
  <div className="navigator-catalogue-page-actions" />
));

describe('NavigatorCatalogueSearchBox', () => {
  it('shows the page actions above the catalogue headline', () => {
    const { container } = render(<NavigatorCatalogueSearchBox />);

    const actions = container.querySelector(
      '.navigator-catalogue-page-actions',
    );

    expect(container.firstElementChild).toBe(actions);
    expect(actions.nextElementSibling).toHaveClass('searchApp-headline');
  });
});
