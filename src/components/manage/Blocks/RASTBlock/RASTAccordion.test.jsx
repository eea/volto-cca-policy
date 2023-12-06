import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import RASTAccordion from './RASTAccordion';

describe('RASTAccordion', () => {
  it('should render the component', () => {
    const data = {
      datasets: [],
      activeMenu: 1,
    };

    const { container } = render(
      <Provider store={global.store}>
        <RASTAccordion {...data} />
      </Provider>,
    );
    expect(container.querySelector('.accordion')).toBeInTheDocument();
  });
});
