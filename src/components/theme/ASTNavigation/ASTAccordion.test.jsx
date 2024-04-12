import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import ASTAccordion from './ASTAccordion';

const mockStore = configureStore();

describe('ASTAccordion', () => {
  it('should render the component', () => {
    const data = {
      astItems: [
        {
          '@id': '/en/knowledge/tools/adaptation-support-tool/step-0-0',
          title: 'The Adaptation Support Tool - Getting started',
        },
        {
          '@id': '/en/knowledge/tools/adaptation-support-tool/step-0-3',
          title: 'Using the Adaptation Support Tool',
        },
        {
          '@id': '/en/knowledge/tools/adaptation-support-tool/step-0-1',
          title: 'Climate Impacts in Europe',
        },
        {
          '@id': '/en/knowledge/tools/adaptation-support-tool/step-0-2',
          title: 'Adaptation to climate change',
        },
      ],
      location: {
        pathname: '/en/knowledge/tools/adaptation-support-tool',
      },
      currentLanguage: 'en',
      isAdaptationSupportTool: jest.fn(),
      isUrbanAdaptationSupportTool: jest.fn(),
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
          <ASTAccordion {...data} />
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toBeTruthy();
  });
});
