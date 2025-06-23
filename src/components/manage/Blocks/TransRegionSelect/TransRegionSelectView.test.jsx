import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-intl-redux';
import configureStore from 'redux-mock-store';
import TransRegionSelectView from './TransRegionSelectView';

const mockStore = configureStore();

describe('TransRegionSelectView', () => {
  it('renders in view mode with regions and countries', () => {
    const store = mockStore({
      intl: {
        locale: 'en',
        messages: {},
      },
    });

    const mockProps = {
      data: {
        title: 'Transnational Region',
      },
      metadata: {
        title: 'Sample Region',
        '@components': {
          transnationalregion: {
            regions: [
              { title: 'Region A', url: '/region-a' },
              { title: 'Region B', url: '/region-b' },
            ],
            countries: [
              [
                ['Country X', '/country-x'],
                ['Country Y', '/country-y'],
              ],
            ],
          },
        },
      },
    };

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TransRegionSelectView {...mockProps} />
        </MemoryRouter>
      </Provider>,
    );

    // Dropdown should appear
    expect(screen.getByText('Choose a region')).toBeInTheDocument();

    // Title should render
    expect(screen.getByText('Transnational Region')).toBeInTheDocument();

    // Countries should be rendered as links
    expect(screen.getByText('Country X,')).toBeInTheDocument();
    expect(screen.getByText('Country Y')).toBeInTheDocument();

    // Dropdown options should exist
    expect(screen.getByText('Region A')).toBeInTheDocument();
    expect(screen.getByText('Region B')).toBeInTheDocument();
  });

  it('renders edit mode correctly', () => {
    const store = mockStore({
      intl: {
        locale: 'en',
        messages: {},
      },
    });

    const mockProps = {
      mode: 'edit',
      data: {
        region: 'Region A',
      },
    };

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <TransRegionSelectView {...mockProps} />
        </MemoryRouter>
      </Provider>,
    );

    expect(container).toHaveTextContent('TransRegionSelectView: Region A');
  });
});
