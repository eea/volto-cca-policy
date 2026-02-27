import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';

import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import FilterAceContentView from './FilterAceContentView';

const mockStore = configureStore();

jest.mock('semantic-ui-react', () => ({
  ...jest.requireActual('semantic-ui-react'),
  Icon: () => <div>Icon</div>,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: () => <div>Link</div>,
}));

jest.mock(
  '@plone/volto/components/manage/Blocks/Listing/ListingBody',
  () => () => <div>ListingBody</div>,
);

jest.mock('react-select', () => (props) => <div>Select</div>);

jest.mock('@plone/volto/components/manage/Widgets/SelectStyling', () => ({
  Option: () => <div>Option</div>,
  DropdownIndicator: () => <div>DropdownIndicator</div>,
  selectTheme: () => ({}),
  customSelectStyles: {},
}));

jest.mock('@plone/volto/registry', () => ({
  blocks: {
    blocksConfig: {
      listing: {
        variations: [
          { id: 'simpleListing', isDefault: true },
          { id: 'simpleCards' },
        ],
      },
    },
  },
}));

describe('FilterAceContentView', () => {
  it('renders default variation and snapshot matches', () => {
    const data = {
      title: 'Test title',
      variation: 'simpleListing',
      nr_items: 5,
      button_label: 'View all items',
      search_type: [],
      funding_programme: [],
    };

    const store = mockStore({
      userSession: { token: '1234' },
      intl: { locale: 'en', messages: {} },
      vocabularies: {
        'eea.climateadapt.aceitems_climateimpacts': {
          loaded: true,
          items: [{ value: 'imp1', label: 'Impact 1' }],
        },
        'eea.climateadapt.aceitems_sectors': {
          loaded: true,
          items: [{ value: 'sec1', label: 'Sector 1' }],
        },
        'eea.climateadapt.aceitems_elements': {
          loaded: true,
          items: [{ value: 'ele1', label: 'Element 1' }],
        },
        'eea.climateadapt.aceitems_key_type_measures_short': {
          loaded: true,
          items: [{ value: 'me1', label: 'Measure 1' }],
        },
      },
    });

    const component = renderer.create(
      <Provider store={store}>
        <MemoryRouter>
          <FilterAceContentView data={data} id="block-1" path="/" />
        </MemoryRouter>
      </Provider>,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });

  it('renders simpleCards variation (Grid branch)', () => {
    const data = {
      title: 'Cards title',
      variation: 'simpleCards',
      nr_items: 3,
      button_label: 'See cards',
      search_type: [],
      funding_programme: [],
    };

    const store = mockStore({
      userSession: { token: 'abcd' },
      intl: { locale: 'en', messages: {} },
      vocabularies: {
        'eea.climateadapt.aceitems_climateimpacts': {
          loaded: true,
          items: [{ value: 'imp2', label: 'Impact 2' }],
        },
        'eea.climateadapt.aceitems_sectors': {
          loaded: true,
          items: [{ value: 'sec2', label: 'Sector 2' }],
        },
        'eea.climateadapt.aceitems_elements': {
          loaded: true,
          items: [{ value: 'ele2', label: 'Element 2' }],
        },
        'eea.climateadapt.aceitems_key_type_measures_short': {
          loaded: true,
          items: [{ value: 'me2', label: 'Measure 2' }],
        },
      },
    });

    const component = renderer.create(
      <Provider store={store}>
        <MemoryRouter>
          <FilterAceContentView data={data} id="block-2" path="/foo" />
        </MemoryRouter>
      </Provider>,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});
