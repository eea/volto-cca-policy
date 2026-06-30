import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-intl-redux';
import View from './View';

jest.mock('./CountryTabPane', () => (props) => (
  <div data-testid={`country-tab-pane-${props._index}`}>
    CountryTabPane {props.contents}
  </div>
));

const mockStore = configureStore();

const renderView = (properties) => {
  const store = mockStore({
    userSession: { token: '1234' },
    intl: {
      locale: 'en',
      messages: {},
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <View properties={properties} />
      </MemoryRouter>
    </Provider>,
  );
};

describe('View', () => {
  it('renders the component', () => {
    const { container } = renderView({
      language: 'en',
      '@components': {
        countryprofile: {
          html: {
            menu: [],
            content: [],
          },
        },
      },
    });

    expect(container).toBeTruthy();
  });

  it('renders non-English warning message', () => {
    renderView({
      language: 'ro',
      '@components': {
        countryprofile: {
          html: {
            menu: [],
            content: [],
          },
        },
      },
    });

    expect(
      screen.getByText(
        'Officially reported governmental information is only available in English',
      ),
    ).toBeInTheDocument();
  });

  it('renders top message', () => {
    renderView({
      language: 'en',
      '@components': {
        countryprofile: {
          html: {
            menu: [],
            content: [],
            message_top: 'This is the top message',
          },
        },
      },
    });

    expect(screen.getByText('This is the top message')).toBeInTheDocument();
  });

  it('renders updated date', () => {
    renderView({
      language: 'en',
      '@components': {
        countryprofile: {
          html: {
            menu: [],
            content: [],
            updated: '2024-01-01',
          },
        },
      },
    });

    expect(
      screen.getByText('Reported updated until: 2024-01-01'),
    ).toBeInTheDocument();
  });

  it('renders and opens top accordion', () => {
    renderView({
      language: 'en',
      '@components': {
        countryprofile: {
          html: {
            menu: [],
            content: [],
            top_accordeon: [
              {
                title: 'Accordion title',
                value: '<p>Accordion content</p>',
              },
            ],
          },
        },
      },
    });

    expect(screen.getByText('Accordion title')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Accordion content')).toBeInTheDocument();
  });

  it('renders tabs and CountryTabPane', () => {
    renderView({
      language: 'en',
      '@components': {
        countryprofile: {
          html: {
            menu: ['Tab one', 'Tab two'],
            content: ['Content one', 'Content two'],
          },
        },
      },
    });

    expect(screen.getByText('Tab one')).toBeInTheDocument();
    expect(screen.getByText('Tab two')).toBeInTheDocument();
    expect(screen.getByTestId('country-tab-pane-0')).toHaveTextContent(
      'Content one',
    );
  });
});
