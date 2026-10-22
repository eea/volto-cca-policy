import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { useAtom } from 'jotai';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useSearchContext, useSearchDriver } from '@eeacms/search/lib/hocs';
import NavigatorGuideContentView from './NavigatorGuideContentView';
import useGuideFacetOptions from './useGuideFacetOptions';

jest.mock('jotai', () => ({
  ...jest.requireActual('jotai'),
  useAtom: jest.fn(),
}));
jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('react-router-dom', () => ({ useHistory: jest.fn() }));
jest.mock('@eeacms/search/lib/hocs', () => ({
  useSearchContext: jest.fn(),
  useSearchDriver: jest.fn(),
}));
jest.mock('./useGuideFacetOptions', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const renderGuide = (result, searchContext = {}) => {
  useSearchContext.mockReturnValue({
    filters: [{ field: 'cca_adaptation_sectors.keyword', values: ['Water'] }],
    facets: {},
    results: [result],
    totalResults: 1,
    isLoading: false,
    ...searchContext,
  });
  return render(
    <IntlProvider locale="en">
      <NavigatorGuideContentView
        appConfig={{
          previewResultsLimit: 3,
          defaultSort: 'title.index|asc',
        }}
      />
    </IntlProvider>,
  );
};

beforeEach(() => {
  useSearchDriver.mockReturnValue(undefined);
});

describe('NavigatorGuideContentView thumbnails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAtom.mockReturnValue([0, jest.fn()]);
    useSelector.mockReturnValue('en');
    useHistory.mockReturnValue({ push: jest.fn() });
    useGuideFacetOptions.mockReturnValue({});
  });

  it('shows the result tool type icon', () => {
    const { container } = renderGuide({
      title: 'Guide tool',
      href: '/tools/guide-tool',
      tool_type: {
        raw: {
          token: 'MONITORING_EARLY_WARNING',
          title: 'Monitoring & early warning',
        },
      },
    });
    const thumbnail = container.querySelector('.navigator-tool-icon');

    expect(thumbnail).toHaveClass('medium');
    expect(thumbnail).toHaveAttribute('title', 'Monitoring & early warning');
    expect(
      thumbnail.querySelector('svg.navigator-tool-type-icon'),
    ).toBeInTheDocument();
    expect(thumbnail.querySelector('.ri-stack-line')).not.toBeInTheDocument();
  });

  it('keeps the stack placeholder when the result has no tool type', () => {
    const { container } = renderGuide({
      title: 'Guide tool',
      href: '/tools/guide-tool',
      image: '/legacy-thumbnail.jpg',
    });
    const thumbnail = container.querySelector('.navigator-tool-icon');

    expect(thumbnail.querySelector('svg')).not.toBeInTheDocument();
    expect(thumbnail.querySelector('.ri-stack-line')).toBeInTheDocument();
  });
});

describe('NavigatorGuideContentView empty preview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAtom.mockReturnValue([0, jest.fn()]);
    useSelector.mockReturnValue('en');
    useHistory.mockReturnValue({ push: jest.fn() });
    useGuideFacetOptions.mockReturnValue({});
  });

  it('hides the result count while the preview empty state is visible', () => {
    const { container } = renderGuide(
      { title: 'Guide tool', href: '/tools/guide-tool' },
      { filters: [] },
    );

    expect(
      container.querySelector('.navigator-guide-preview-empty'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('.navigator-guide-result-count'),
    ).not.toBeInTheDocument();
  });
});

describe('NavigatorGuideContentView sorting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAtom.mockReturnValue([0, jest.fn()]);
    useSelector.mockReturnValue('en');
    useHistory.mockReturnValue({ push: jest.fn() });
    useGuideFacetOptions.mockReturnValue({});
  });

  it('starts with title A-Z when URL filters leave the sort unset', () => {
    const driver = { setSort: jest.fn() };
    useSearchDriver.mockReturnValue(driver);

    renderGuide(
      { title: 'Guide tool', href: '/tools/guide-tool' },
      { searchTerm: '', sortField: '', sortDirection: '' },
    );

    expect(driver.setSort).toHaveBeenCalledWith('title.index', 'asc');
  });

  it('preserves an active sort', () => {
    const driver = { setSort: jest.fn() };
    useSearchDriver.mockReturnValue(driver);

    renderGuide(
      { title: 'Guide tool', href: '/tools/guide-tool' },
      { sortField: 'title.index', sortDirection: 'desc' },
    );

    expect(driver.setSort).not.toHaveBeenCalled();
  });
});

describe('NavigatorGuideContentView adaptation steps', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAtom.mockReturnValue([3, jest.fn()]);
    useSelector.mockReturnValue('en');
    useHistory.mockReturnValue({ push: jest.fn() });
    useGuideFacetOptions.mockReturnValue({
      'cca_adaptation_support_cycle_step.keyword': [
        'Step 2: Assess',
        'Step 1: Prepare',
      ],
    });
  });

  it('orders options alphabetically and requires every selected step', () => {
    const addFilter = jest.fn();
    renderGuide(
      { title: 'Guide tool', href: '/tools/guide-tool' },
      {
        filters: [],
        addFilter,
        facets: {
          'cca_adaptation_support_cycle_step.keyword': [
            {
              data: [
                { value: 'Step 2: Assess', count: 9 },
                { value: 'Step 1: Prepare', count: 1 },
              ],
            },
          ],
        },
      },
    );

    const labels = screen.getAllByText(/^Step [12]:/);
    expect(labels.map((label) => label.textContent)).toEqual([
      'Step 1: Prepare',
      'Step 2: Assess',
    ]);
    fireEvent.click(screen.getByText('Step 2: Assess'));
    expect(addFilter).toHaveBeenCalledWith(
      'cca_adaptation_support_cycle_step.keyword',
      'Step 2: Assess',
      'all',
    );
  });

  it('does not show an unrelated selected step on a preview tool', () => {
    const { container } = renderGuide(
      {
        title: 'Guide tool',
        href: '/tools/guide-tool',
        cca_adaptation_support_cycle_step: { raw: ['Step 1: Prepare'] },
      },
      {
        filters: [
          {
            field: 'cca_adaptation_support_cycle_step.keyword',
            values: ['Step 1: Prepare', 'Step 2: Assess'],
            type: 'all',
          },
        ],
      },
    );

    expect(
      container.querySelectorAll(
        '.navigator-guide-preview-tags .navigator-tag',
      ),
    ).toHaveLength(1);
    expect(
      container.querySelector('.navigator-guide-preview-tags'),
    ).toHaveTextContent('Step 1');
  });
});

describe('NavigatorGuideContentView geographic coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAtom.mockReturnValue([2, jest.fn()]);
    useSelector.mockReturnValue('en');
    useHistory.mockReturnValue({ push: jest.fn() });
    useGuideFacetOptions.mockReturnValue({
      cca_navigator_geographic_scope: ['Europe', 'Global', 'Others'],
      'cca_geographic_countries.keyword': ['Germany', 'Spain'],
      'cca_geographic_transnational_region.keyword': [
        'Alpine Space',
        'Baltic Sea Region',
      ],
    });
  });

  it('shows every coverage section without accordions', () => {
    renderGuide(
      { title: 'Guide tool', href: '/tools/guide-tool' },
      {
        filters: [],
        facets: {
          cca_navigator_geographic_scope: [
            {
              data: [
                { value: 'Europe', count: 8 },
                { value: 'Global', count: 5 },
                { value: 'Others', count: 2 },
              ],
            },
          ],
          'cca_geographic_countries.keyword': [
            {
              data: [
                { value: 'Germany', count: 4 },
                { value: 'Spain', count: 3 },
              ],
            },
          ],
          'cca_geographic_transnational_region.keyword': [
            {
              data: [
                { value: 'Alpine Space', count: 3 },
                { value: 'Baltic Sea Region', count: 2 },
              ],
            },
          ],
        },
      },
    );

    const broadCoverageGroup = screen.getByRole('group', {
      name: 'European-wide and global',
    });
    expect(broadCoverageGroup).toBeVisible();
    expect(
      within(broadCoverageGroup).queryByText('European-wide and global'),
    ).toBeNull();
    expect(within(broadCoverageGroup).getByText('Europe')).toBeVisible();
    expect(within(broadCoverageGroup).getByText('8')).toBeVisible();
    expect(screen.getByRole('group', { name: 'Countries' })).toBeVisible();
    expect(
      screen.getByRole('group', { name: 'Transnational regions' }),
    ).toBeVisible();
    const otherGroup = screen.getByRole('group', { name: 'Other' });
    expect(otherGroup).toBeVisible();
    expect(within(otherGroup).getAllByText('Other')).toHaveLength(1);
    expect(screen.queryByRole('button', { name: 'Countries' })).toBeNull();
    expect(screen.getByText('Select all that apply')).toBeVisible();
    expect(
      screen.queryByText(
        'Tools that have not been assigned to any of the coverage entries above.',
      ),
    ).not.toBeInTheDocument();
  });

  it('disables other coverage categories while keeping the active category enabled', () => {
    renderGuide(
      { title: 'Guide tool', href: '/tools/guide-tool' },
      {
        filters: [
          {
            field: 'cca_navigator_geographic_scope',
            values: ['Europe'],
            type: 'any',
          },
        ],
        facets: {
          cca_navigator_geographic_scope: [
            {
              data: [
                { value: 'Europe', count: 8 },
                { value: 'Global', count: 5 },
                { value: 'Others', count: 2 },
              ],
            },
          ],
          'cca_geographic_countries.keyword': [
            { data: [{ value: 'Germany', count: 4 }] },
          ],
          'cca_geographic_transnational_region.keyword': [
            { data: [{ value: 'Alpine Space', count: 3 }] },
          ],
        },
      },
    );

    const broadCoverageGroup = screen.getByRole('group', {
      name: 'European-wide and global',
    });
    const countriesGroup = screen.getByRole('group', { name: 'Countries' });
    const transnationalGroup = screen.getByRole('group', {
      name: 'Transnational regions',
    });
    const otherGroup = screen.getByRole('group', { name: 'Other' });

    expect(
      within(broadCoverageGroup).getByText('Europe').closest('label'),
    ).not.toHaveAttribute('aria-disabled');
    expect(
      within(broadCoverageGroup).getByText('Global').closest('label'),
    ).not.toHaveAttribute('aria-disabled');
    expect(
      within(countriesGroup).getByText('Germany').closest('label'),
    ).toHaveAttribute('aria-disabled', 'true');
    expect(
      within(transnationalGroup).getByText('Alpine Space').closest('label'),
    ).toHaveAttribute('aria-disabled', 'true');
    expect(
      within(otherGroup)
        .getByText('Other', { selector: 'span' })
        .closest('label'),
    ).toHaveAttribute('aria-disabled', 'true');
    expect(within(otherGroup).getByText('2')).toBeVisible();
  });

  it('labels the fallback option as Other', () => {
    renderGuide(
      { title: 'Guide tool', href: '/tools/guide-tool' },
      { filters: [] },
    );

    expect(screen.getAllByText('Other')).toHaveLength(1);
    expect(screen.queryByText('Others')).not.toBeInTheDocument();
  });
});

describe('NavigatorGuideContentView climate hazards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAtom.mockReturnValue([1, jest.fn()]);
    useSelector.mockReturnValue('en');
    useHistory.mockReturnValue({ push: jest.fn() });
    useGuideFacetOptions.mockReturnValue({});
  });

  it('uses the hazard tag style for a selected climate hazard', () => {
    const { container } = renderGuide(
      {
        title: 'Guide tool',
        href: '/tools/guide-tool',
        cca_climate_impacts: { raw: ['Flooding'] },
      },
      {
        filters: [
          { field: 'cca_climate_impacts.keyword', values: ['Flooding'] },
        ],
      },
    );

    expect(
      container.querySelector('.navigator-guide-preview-tags .hazard'),
    ).toHaveTextContent('Flooding');
  });
});

describe('NavigatorGuideContentView actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSelector.mockReturnValue('en');
    useSearchDriver.mockReturnValue(undefined);
    useGuideFacetOptions.mockReturnValue({
      'cca_adaptation_sectors.keyword': ['Water'],
    });
  });

  it('removes a selected option from the current step', () => {
    const removeFilter = jest.fn();
    useAtom.mockReturnValue([0, jest.fn()]);
    useHistory.mockReturnValue({ push: jest.fn() });

    renderGuide(
      { title: 'Guide tool', href: '/tools/guide-tool' },
      {
        removeFilter,
        facets: {
          'cca_adaptation_sectors.keyword': [
            { data: [{ value: 'Water', count: 4 }] },
          ],
        },
      },
    );

    fireEvent.click(screen.getByText('Water'));

    expect(removeFilter).toHaveBeenCalledWith(
      'cca_adaptation_sectors.keyword',
      'Water',
      'all',
    );
  });

  it('opens catalogue results with only supported Guide filters', () => {
    const history = { push: jest.fn() };
    useAtom.mockReturnValue([0, jest.fn()]);
    useHistory.mockReturnValue(history);

    renderGuide(
      { title: 'Guide tool', href: '/tools/guide-tool' },
      {
        filters: [
          {
            field: 'cca_adaptation_sectors.keyword',
            values: ['Water'],
            type: 'all',
          },
          { field: 'unrelated.keyword', values: ['Ignored'], type: 'any' },
        ],
      },
    );

    fireEvent.click(screen.getByRole('button', { name: 'Skip to results' }));

    expect(history.push).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/en/navigator/tool-catalogue',
        search: expect.any(String),
      }),
    );
    expect(history.push.mock.calls[0][0].search).not.toContain('unrelated');
  });
});
