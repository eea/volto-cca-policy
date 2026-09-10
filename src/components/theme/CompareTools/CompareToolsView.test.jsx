import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';
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
          navigatorCatalogueSearch: {},
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

describe('CompareToolsView', () => {
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
    const results = [
      {
        cca_uid: { raw: 'one' },
        title: 'Tool one',
        href: '/tool-one',
        image: {
          scales: { thumb: { download: '/uploaded-compare-thumb.jpg' } },
        },
        functionality: { raw: 4 },
        cca_type_of_outputs: { raw: ['Maps and graphs'] },
        cca_adaptation_support_cycle_step: {
          raw: [
            {
              title:
                'Step 2: Assessing Climate Change Risks and Vulnerabilities',
            },
          ],
        },
      },
      {
        cca_uid: { raw: 'two' },
        title: 'Tool two',
        href: '/tool-two',
        image: null,
      },
    ];
    results.comparisonOptions = {
      cca_type_of_outputs: ['Reports and decision support', 'Maps and graphs'],
      cca_adaptation_support_cycle_step: [
        'Step 10: Additional step from the catalogue',
        'Step 2: Assessing Climate Change Risks and Vulnerabilities',
        'Step 1: Preparing the Ground for Adaptation',
      ],
    };
    fetchResultsByUid.mockResolvedValue(results);
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
    const functionalityScore = screen.getByLabelText('4/6');
    expect(functionalityScore.children).toHaveLength(6);
    expect(
      functionalityScore.querySelectorAll('.functionality-dot.filled'),
    ).toHaveLength(4);
    const cycleHeader = screen.getByRole('rowheader', {
      name: 'Adaptation support cycle step',
    });
    expect(cycleHeader).toHaveAttribute('scope', 'rowgroup');
    expect(cycleHeader).toHaveAttribute('rowspan', '3');
    const cycleRows = within(cycleHeader.closest('tbody')).getAllByRole('row');
    expect(cycleRows).toHaveLength(3);
    expect(
      within(cycleRows[2]).getAllByText(
        'Step 10: Additional step from the catalogue',
      ),
    ).toHaveLength(2);
    expect(
      within(cycleRows[1]).getAllByText(
        'Step 2: Assessing Climate Change Risks and Vulnerabilities',
      ),
    ).toHaveLength(2);
    expect(within(cycleRows[1]).getAllByLabelText('Available')).toHaveLength(1);
    expect(
      within(cycleRows[1]).getAllByLabelText('Not available'),
    ).toHaveLength(1);
    expect(
      within(cycleRows[0]).getAllByLabelText('Not available'),
    ).toHaveLength(2);
    const outputRow = screen
      .getByRole('rowheader', { name: 'Output type' })
      .closest('tr');
    expect(within(outputRow).getAllByText('Maps and graphs')).toHaveLength(2);
    expect(within(outputRow).getAllByLabelText('Available')).toHaveLength(1);
    expect(within(outputRow).getAllByLabelText('Not available')).toHaveLength(
      1,
    );
  });

  it('falls back to selected tool values when aggregations are empty', async () => {
    const results = await fetchResultsByUid();
    results.comparisonOptions = {};
    render(
      <IntlProvider locale="en">
        <CompareToolsView />
      </IntlProvider>,
    );
    await screen.findByRole('table', { name: 'Compare tools' });
    const cycleHeader = screen.getByRole('rowheader', {
      name: 'Adaptation support cycle step',
    });
    expect(cycleHeader).toHaveAttribute('rowspan', '1');
    expect(
      within(cycleHeader.closest('tbody')).getAllByText(
        'Step 2: Assessing Climate Change Risks and Vulnerabilities',
      ),
    ).toHaveLength(2);
    expect(
      screen.queryByText('Step 1: Preparing the Ground for Adaptation'),
    ).not.toBeInTheDocument();
  });

  it('shows the uploaded tool result image and keeps the file icon for a missing image', async () => {
    render(
      <IntlProvider locale="en">
        <CompareToolsView />
      </IntlProvider>,
    );
    const table = await screen.findByRole('table', { name: 'Compare tools' });
    const [thumbnail, missingThumbnail] = table.querySelectorAll(
      '.navigator-tool-icon',
    );
    const img = thumbnail.querySelector('img');

    expect(thumbnail).toHaveClass('medium');
    expect(img).toHaveAttribute('src', '/uploaded-compare-thumb.jpg');
    expect(img).toHaveStyle({ display: 'none' });
    expect(thumbnail.querySelector('.ri-file-line')).toBeInTheDocument();
    expect(missingThumbnail.querySelector('img')).not.toBeInTheDocument();
    expect(missingThumbnail.querySelector('.ri-file-line')).toBeInTheDocument();

    fireEvent.load(img);

    expect(img.style.display).toBe('');
    expect(thumbnail.querySelector('.ri-file-line')).not.toBeInTheDocument();
  });

  it('falls back to the file icon when the image fails', async () => {
    render(
      <IntlProvider locale="en">
        <CompareToolsView />
      </IntlProvider>,
    );
    const table = await screen.findByRole('table', { name: 'Compare tools' });
    const thumbnail = table.querySelector('.navigator-tool-icon');

    fireEvent.error(thumbnail.querySelector('img'));

    expect(thumbnail.querySelector('img')).not.toBeInTheDocument();
    expect(thumbnail.querySelector('.ri-file-line')).toBeInTheDocument();
  });
});
