import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import MissiongFundingCCAView from './MissionFundingCCAView';
import config from '@plone/volto/registry';

config.blocks = {
  blocksConfig: {
    title: {
      view: () => <div>Title Block Component</div>,
    },
  },
};

const mockStore = configureStore();

describe('MissiongFundingCCAView', () => {
  it('should render the component', () => {
    const data = {
      content: {
        contributors: [],
        country: [
          {
            title: 'Albania',
            token: 'AL',
          },
          {
            title: 'Armenia',
            token: 'AM',
          },
        ],
        description: 'Summary',
        eligible_entities: [
          {
            title: 'Social, cultural, educational bodies',
            token: 'B_SOCIAL_CULTURAL',
          },
          {
            title: 'NGOs',
            token: 'D_NGOS',
          },
        ],
        funding_rate: 'funding rate',
        funding_type: {
          'content-type': 'text/html',
          data: '<p>type of funding</p>',
          encoding: 'utf8',
        },
        further_info: 'further info',
        general_info: '/sandbox',
        is_blended: true,
        is_consortium_required: false,
        objective: {
          'content-type': 'text/html',
          data: '<p></p>',
          encoding: 'utf8',
        },
        publication_page: 'https://google.com',
        rast_steps: [
          {
            title: 'Step 1. Preparing the ground for adaptation',
            token: 'STEP_1',
          },
          {
            title: 'Step 4. Assessing and selecting adaptation options',
            token: 'STEP_4',
          },
        ],
        regions: 'region here',
        sectors: [
          {
            title: 'Biodiversity',
            token: 'BIODIVERSITY',
          },
          {
            title: 'Coastal areas',
            token: 'COASTAL',
          },
        ],
        title: 'Title here',
      },
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
          <MissiongFundingCCAView {...data} />
        </MemoryRouter>
      </Provider>,
    );
    expect(
      container.querySelector('.mission-funding-cca-view'),
    ).toBeInTheDocument();
  });
});
