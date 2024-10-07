import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import CaseStudyExplorerEdit from './CaseStudyExplorerEdit';
import { useCases } from './hooks';
import * as utils from './utils';

const mockStore = configureStore();

jest.mock('./CaseStudyExplorerView', () => (props) => (
  <div>Mock Case Study Explorer View {JSON.stringify(props)}</div>
));
jest.mock('./CaseStudyMap', () => () => <div>Mock Case Study Map</div>);
jest.mock('./CaseStudyFilters', () => () => <div>Mock Case Study Filters</div>);

jest.mock('./hooks', () => ({
  useCases: jest.fn(),
}));

jest.mock('./utils', () => ({
  filterCases: jest.fn(),
  getFilters: jest.fn(),
}));

const store = mockStore({
  userSession: { token: '1234' },
  intl: {
    locale: 'en',
    messages: {},
  },
});

describe('CaseStudyExplorerEdit', () => {
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

    utils.getFilters.mockReturnValue({
      impacts: { 1: 'Impact 1' },
      sectors: { 1: 'Sector 1' },
      elements: { 1: 'Element 1' },
      measures: {},
    });

    utils.filterCases.mockImplementation((cases, activeFilters) => {
      return activeFilters.sectors.length ? cases : [];
    });
  });

  it('renders the CaseStudyExplorerEdit component', () => {
    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CaseStudyExplorerEdit />
        </MemoryRouter>
      </Provider>,
    );

    expect(getByText(/Mock Case Study Explorer View/i)).toBeInTheDocument();
    expect(getByText(/"mode":"edit"/i)).toBeInTheDocument(); // Check for the mode prop
  });
});
