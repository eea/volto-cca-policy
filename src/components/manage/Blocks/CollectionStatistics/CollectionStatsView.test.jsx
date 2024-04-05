import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import CollectionStatsView from './CollectionStatsView';
import config from '@plone/volto/registry';
import applyConfig from './index';

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
        messages: {},
      },
      querystats: {
        'id-1': {
          items: {
            Event: 82,
            'News Item': 116,
            'eea.climateadapt.aceproject': 60,
            'eea.climateadapt.adaptationoption': 1,
            'eea.climateadapt.c3sindicator': 9,
            'eea.climateadapt.casestudy': 32,
            'eea.climateadapt.guidancedocument': 21,
            'eea.climateadapt.indicator': 14,
            'eea.climateadapt.informationportal': 27,
            'eea.climateadapt.organisation': 22,
            'eea.climateadapt.publicationreport': 187,
            'eea.climateadapt.tool': 14,
            'eea.climateadapt.video': 17,
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
