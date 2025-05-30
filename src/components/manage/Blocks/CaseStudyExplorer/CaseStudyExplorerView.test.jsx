import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import CaseStudyExplorerView from './CaseStudyExplorerView';
import { useCases } from './hooks';
import * as utils from './utils';

const mockStore = configureStore();

jest.mock('./CaseStudyMap', () => () => <div>Mock Case Study Map</div>);
jest.mock('./CaseStudyFilters', () => () => <div>Mock Case Study Filters</div>);

jest.mock('./hooks', () => ({
  useCases: jest.fn(),
}));

jest.mock('./utils', () => ({
  filterCases: jest.fn(),
  getFilters: jest.fn(),
}));

jest.mock('@plone/volto/helpers', () => ({
  addAppURL: jest.fn((url) => url),
}));

const store = mockStore({
  userSession: { token: '1234' },
  intl: {
    locale: 'en',
    messages: {},
  },
});

// Define the __SERVER__ variable for testing
global.__SERVER__ = false; // Set it to false to avoid server-side return

describe('CaseStudyExplorerView', () => {
  const mockCasesData = {
    features: [
      {
        properties: {
          title: 'Case Study 1',
          image: 'image1.jpg',
          sectors_str: 'Sector1',
          impacts_str: 'Impact1',
          adaptation_options_links: 'link1',
          url: 'https://example.com/case-study-1',
          origin_adaptecca: 20,
          sectors: '1,2',
          impacts: '1',
          elements: '1',
        },
        geometry: {
          coordinates: [-123.3656, 48.4284],
        },
      },
    ],
    filters: {
      measures: [],
    },
  };

  beforeEach(() => {
    useCases.mockReturnValue(mockCasesData);
    utils.filterCases.mockImplementation((cases, filters) => cases);
    utils.getFilters.mockReturnValue({
      impacts: { 1: 'Impact 1' },
      sectors: { 1: 'Sector 1' },
      elements: { 1: 'Element 1' },
      measures: {},
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the CaseStudyExplorerView with case studies', () => {
    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CaseStudyExplorerView />
        </MemoryRouter>
      </Provider>,
    );

    expect(getByText('Mock Case Study Map')).toBeInTheDocument();
    expect(getByText('Mock Case Study Filters')).toBeInTheDocument();
  });
});
