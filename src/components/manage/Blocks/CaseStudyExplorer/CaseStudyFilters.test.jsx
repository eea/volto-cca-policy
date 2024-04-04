import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import CaseStudyFilters from './CaseStudyFilters';

const mockStore = configureStore();

describe('CaseStudyFilters', () => {
  it('should render the component', () => {
    const data = {
      impacts: [{ DROUGHT: 'Drought' }],
      sectors: [{ HEALTH: 'Health' }],
      measures: [{ Measure1: [{ M11: 'm11', M12: 'm12' }] }],
    };

    const store = mockStore({
      userSession: { token: '1234' },
      intl: {
        locale: 'en',
        messages: {},
      },
    });

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CaseStudyFilters {...data} />
        </MemoryRouter>
      </Provider>,
    );
    expect(container.querySelector('.subcategory')).toBeInTheDocument();
  });
});
