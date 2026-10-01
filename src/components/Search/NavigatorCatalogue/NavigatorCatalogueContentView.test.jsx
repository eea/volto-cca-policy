import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import NavigatorCatalogueContentView from './NavigatorCatalogueContentView';
import {
  useSearchContext,
  useSearchDriver,
  useViews,
} from '@eeacms/search/lib/hocs';

jest.mock('@elastic/react-search-ui', () => ({
  Sorting: ({ sortOptions, onChange }) => (
    <select
      aria-label="Sort results"
      onChange={(event) => onChange(event.target.value)}
    >
      {sortOptions.map((option) => (
        <option
          key={`${option.value}|${option.direction}`}
          value={`${option.value}|||${option.direction}`}
        >
          {option.name}
        </option>
      ))}
    </select>
  ),
}));

jest.mock('semantic-ui-react', () => {
  const Menu = ({ children }) => <nav>{children}</nav>;
  Menu.Item = ({ children }) => <button type="button">{children}</button>;
  return {
    Grid: Object.assign(({ children }) => <div>{children}</div>, {
      Column: ({ children }) => <div>{children}</div>,
    }),
    Icon: () => null,
    Menu,
  };
});

jest.mock('jotai', () => ({
  ...jest.requireActual('jotai'),
  useAtomValue: () => false,
}));

jest.mock(
  '@eeacms/search/components/ResultsPerPageSelector/ResultsPerPageSelector',
  () => () => null,
);
jest.mock('@eeacms/search/components/Paging/Paging', () => () => null);
jest.mock('@eeacms/search/components', () => ({
  ActiveFilterList: () => null,
  Component: () => null,
  DownloadButton: () => null,
  DropdownFacetsList: () => null,
  SectionTabs: () => null,
  SortingDropdownWithLabel: () => null,
}));
jest.mock('@eeacms/search/components/Result/NoResults', () => ({
  NoResults: () => null,
}));
jest.mock('@eeacms/search/lib/hocs', () => ({
  useSearchContext: jest.fn(),
  useSearchDriver: jest.fn(),
  useViews: jest.fn(),
}));
jest.mock('@eeacms/search/state', () => ({
  loadingFamily: jest.fn(() => 'loading'),
}));
jest.mock('@eeacms/search/registry', () => ({
  __esModule: true,
  default: {
    resolve: {
      ListingView: { component: ({ children }) => <div>{children}</div> },
      MapView: { component: ({ children }) => <div>{children}</div> },
    },
  },
}));
jest.mock('@eeacms/volto-cca-policy/components', () => ({
  CompareToolsPanel: () => null,
}));

const appConfig = {
  appName: 'navigatorCatalogueSearch',
  defaultSort: 'title.index|asc',
  resultViews: [
    { id: 'listing', factories: { view: 'ListingView' } },
    { id: 'map', factories: { view: 'MapView' } },
  ],
  sortOptions: [
    { name: { id: 'Relevance' }, value: '', direction: '' },
    { name: { id: 'Title a-z' }, value: 'title.index', direction: 'asc' },
    { name: { id: 'Title z-a' }, value: 'title.index', direction: 'desc' },
  ],
  showFilters: false,
  showFacets: false,
  showClusters: false,
  showSorting: true,
  showLandingPage: false,
};

const renderCatalogue = () =>
  render(
    <IntlProvider locale="en">
      <NavigatorCatalogueContentView
        appConfig={appConfig}
        children={[]}
        wasInteracted={true}
      />
    </IntlProvider>,
  );

describe('NavigatorCatalogueContentView sorting', () => {
  let driver;
  let searchContext;

  beforeEach(() => {
    jest.clearAllMocks();
    driver = { setSort: jest.fn() };
    searchContext = {
      searchTerm: '',
      sortField: '',
      sortDirection: '',
      totalResults: 0,
      wasSearched: false,
    };
    useSearchContext.mockImplementation(() => searchContext);
    useSearchDriver.mockReturnValue(driver);
    useViews.mockReturnValue({
      activeViewId: 'listing',
      setActiveViewId: jest.fn(),
    });
  });

  it('starts with title A-Z when there is no active sort', () => {
    renderCatalogue();

    expect(driver.setSort).toHaveBeenCalledWith('title.index', 'asc');
  });

  it('preserves an active relevance sort', () => {
    searchContext = {
      ...searchContext,
      searchTerm: 'climate adaptation',
      sortField: '',
      sortDirection: '',
    };

    renderCatalogue();

    expect(driver.setSort).not.toHaveBeenCalled();
  });

  it('restores title A-Z when the keyword is cleared', () => {
    searchContext = {
      ...searchContext,
      searchTerm: 'climate adaptation',
      sortField: '',
      sortDirection: '',
    };
    const { rerender } = renderCatalogue();
    driver.setSort.mockClear();

    searchContext = {
      ...searchContext,
      searchTerm: '',
      sortField: '',
      sortDirection: '',
    };
    rerender(
      <IntlProvider locale="en">
        <NavigatorCatalogueContentView
          appConfig={appConfig}
          children={[]}
          wasInteracted={true}
        />
      </IntlProvider>,
    );

    expect(driver.setSort).toHaveBeenCalledWith('title.index', 'asc');
  });

  it('applies the selected sorting option', () => {
    renderCatalogue();
    driver.setSort.mockClear();

    fireEvent.change(screen.getByRole('combobox', { name: 'Sort results' }), {
      target: { value: 'title.index|||desc' },
    });

    expect(driver.setSort).toHaveBeenCalledWith('title.index', 'desc');
  });
});
