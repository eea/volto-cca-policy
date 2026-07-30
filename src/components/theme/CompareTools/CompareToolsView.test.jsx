import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { useAtom } from 'jotai';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import CompareToolsView from './CompareToolsView';
import { fetchResultsByUid } from './utils';

jest.mock('jotai', () => ({
  ...jest.requireActual('jotai'),
  useAtom: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(),
  useLocation: jest.fn(),
}));

jest.mock('@plone/volto/helpers/Helmet/Helmet', () => () => null);
jest.mock('@plone/volto/helpers/BodyClass/BodyClass', () => () => null);
jest.mock('../BannerTitle/BannerTitle', () => () => null);
jest.mock(
  '@plone/volto/components/manage/UniversalLink/UniversalLink',
  () =>
    ({ children, href, ...props }) => (
      <a href={href} {...props}>
        {children}
      </a>
    ),
);
jest.mock('@plone/volto/registry', () => ({
  __esModule: true,
  default: {
    settings: {
      searchlib: {
        searchui: {
          navigatorCatalogueSearch: {
            landingPageURL: '/en/navigator/tool-catalogue',
          },
        },
      },
    },
  },
}));

jest.mock('./utils', () => ({
  MAX_COMPARE_TOOLS: 4,
  compareToolsAtom: {},
  fetchResultsByUid: jest.fn(),
  getCompareToolUid: (result) => result.cca_uid?.raw || '',
  getPathname: (url) => url?.split('?')[0] || '',
}));

describe('CompareToolsView accessibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAtom.mockReturnValue([[], jest.fn()]);
    useDispatch.mockReturnValue(jest.fn());
    useSelector.mockReturnValue('en');
    useHistory.mockReturnValue({ push: jest.fn() });
    useLocation.mockReturnValue({
      pathname: '/en/navigator/compare',
      search: '?uid=one&uid=two',
      hash: '',
      state: {},
    });
    fetchResultsByUid.mockResolvedValue([
      {
        cca_uid: { raw: 'one' },
        title: 'Tool one',
        href: '/tool-one',
      },
      {
        cca_uid: { raw: 'two' },
        title: 'Tool two',
        href: '/tool-two',
      },
    ]);
  });

  it('labels the table, row headers, and remove actions', async () => {
    render(
      <IntlProvider locale="en">
        <CompareToolsView />
      </IntlProvider>,
    );

    expect(
      await screen.findByRole('table', { name: 'Compare tools' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('rowheader', { name: 'Usability' }),
    ).toHaveAttribute('scope', 'row');
    expect(
      screen.getByRole('rowheader', { name: 'Functionality' }),
    ).toHaveAttribute('scope', 'row');
    expect(
      screen.getByRole('button', {
        name: 'Remove Tool one from comparison',
      }),
    ).toBeInTheDocument();
  });
});
