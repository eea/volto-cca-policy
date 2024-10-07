import React from 'react';
const mockStore = configureStore();

describe('CaseStudyFilters', () => {
  it('should render the component', () => {
    const data = {
      metadata: [
        { url: 'https://www.europa.eu', title: 'Europa' },
        { url: 'https://www.copernicus.eu/en', title: 'Copernicus' },
      ],
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
          <C3SIndicatorsListingBlockView {...data} />
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toBeTruthy();
  });
});
