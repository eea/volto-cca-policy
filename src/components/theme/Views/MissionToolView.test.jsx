import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import MissionToolView from './MissionToolView';
import config from '@plone/volto/registry';

config.blocks = {
  blocksConfig: {
    title: {
      view: () => <div>Title Block Component</div>,
    },
  },
};

const mockStore = configureStore();

describe('MissionToolView', () => {
  it('should render the component', () => {
    const data = {
      content: {
        contributors: [],
        description: 'Summary',
        objective: {
          'content-type': 'text/html',
          data: '<p></p>',
          encoding: 'utf8',
        },
        short_description: {
          'content-type': 'text/html',
          data: '<p></p>',
          encoding: 'utf8',
        },
        free_keywords: {
          'content-type': 'text/html',
          data: '<p></p>',
          encoding: 'utf8',
        },
        readiness_for_use: [
          {
            title: 'Tool tested in several case studies',
            token: 'Tool tested in several case studies',
          },
          {
            title: 'Tool broadly used',
            token: 'Tool broadly used',
          },
        ],
        application: {
          'content-type': 'text/html',
          data: '<p></p>',
          encoding: 'utf8',
        },
        strengths_weaknesses: {
          'content-type': 'text/html',
          data: '<p></p>',
          encoding: 'utf8',
        },
        input: {
          'content-type': 'text/html',
          data: '<p></p>',
          encoding: 'utf8',
        },
        output: {
          'content-type': 'text/html',
          data: '<p></p>',
          encoding: 'utf8',
        },
        replicability: {
          'content-type': 'text/html',
          data: '<p></p>',
          encoding: 'utf8',
        },
        materials: {
          'content-type': 'text/html',
          data: '<p></p>',
          encoding: 'utf8',
        },
        website: {
          'content-type': 'text/html',
          data: '<p></p>',
          encoding: 'utf8',
        },
        contact: {
          'content-type': 'text/html',
          data: '<p></p>',
          encoding: 'utf8',
        },
        associated_project: {
          'content-type': 'text/html',
          data: '<p></p>',
          encoding: 'utf8',
        },
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
        geographical_scale: [
          {
            title: 'Item 1',
            token: 'Item 1',
          },
          {
            title: 'Item 2',
            token: 'Item 2',
          },
        ],
        geographical_area: {
          'content-type': 'text/html',
          data: '<p></p>',
          encoding: 'utf8',
        },
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

    const component = renderer.create(
      <Provider store={store}>
        <MemoryRouter>
          <MissionToolView {...data} />
        </MemoryRouter>
      </Provider>,
    );

    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});
