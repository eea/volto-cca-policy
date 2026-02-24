import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import CollectionStatsView from './CollectionStatsView';
import config from '@plone/volto/registry';
import applyConfig from './index';
import {
  ADAPTATION_OPTION,
  CASE_STUDY,
  GUIDANCE,
  INDICATOR,
  INFORMATION_PORTAL,
  ORGANISATION,
  ACE_PROJECT,
  PUBLICATION_REPORT,
  TOOL,
  VIDEO,
  C3S_INDICATOR,
  NEWS_ITEM,
  EVENT,
} from '@eeacms/volto-cca-policy/helpers/Constants';

const mockStore = configureStore();

applyConfig(config);

describe('CollectionStatsView', () => {
  it('should render the component', () => {
    const data = {
      id: 'id-1',
      data: {
        aggregateField: {
          label: 'Portal type',
          value: 'portal_type',
        },
        href: [
          {
            '@id': '/en/observatory/advanced-search',
            title: 'Resource catalogue',
          },
        ],
        query: {
          query: [
            {
              i: 'include_in_observatory',
              o: 'plone.app.querystring.operation.boolean.isTrue',
              v: '',
            },
            {
              i: 'path',
              o: 'plone.app.querystring.operation.string.absolutePath',
              v: '/en',
            },
            {
              i: 'review_state',
              o: 'plone.app.querystring.operation.selection.any',
              v: ['published'],
            },
          ],
          sort_order: 'ascending',
          queryParameterStyle: 'EEASemanticSearch',
          showLabel: true,
        },
      },
      path: '/some-location',
      pathname: '/some-location',
    };

    const store = mockStore({
      userSession: { token: '1234' },
      intl: {
        locale: 'en',
      },
      querystats: {
        'id-1': {
          items: {
            [EVENT]: 82,
            [NEWS_ITEM]: 116,
            [ACE_PROJECT]: 60,
            [ADAPTATION_OPTION]: 1,
            [C3S_INDICATOR]: 9,
            [CASE_STUDY]: 32,
            [GUIDANCE]: 21,
            [INDICATOR]: 14,
            [INFORMATION_PORTAL]: 27,
            [ORGANISATION]: 22,
            [PUBLICATION_REPORT]: 187,
            [TOOL]: 14,
            [VIDEO]: 17,
          },
        },
      },
    });

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CollectionStatsView {...data} />
        </MemoryRouter>
      </Provider>,
    );
    expect(container.querySelector('.collection-stats')).toBeInTheDocument();
  });
});
