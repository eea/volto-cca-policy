import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import NavigatorCatalogueCardItem from './NavigatorCatalogueCardItem';
import {
  getCompareToolTitle,
  getCompareToolUid,
  useCompareTools,
} from '../../theme/CompareTools/utils';

jest.mock('semantic-ui-react', () => {
  return {
    Checkbox: ({ checked, disabled, onChange }) => (
      <input
        aria-label="compare"
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event, { checked: event.target.checked })}
      />
    ),
    Icon: ({ className }) => <i className={className} />,
    Popup: ({ content, trigger }) => (
      <div>
        {trigger}
        {content}
      </div>
    ),
  };
});

jest.mock('@eeacms/search/components/Result/ExternalLink', () => ({
  __esModule: true,
  default: ({ children, href, title }) => (
    <a href={href} title={title}>
      {children}
    </a>
  ),
}));

jest.mock('@eeacms/search/components/Result/ResultContext', () => ({
  __esModule: true,
  default: () => <span>Tool description</span>,
}));

jest.mock('../../theme/CompareTools/utils', () => ({
  getCompareToolTitle: jest.fn((result) => result.title || ''),
  getCompareToolUid: jest.fn(
    (result) => result.cca_uid?.raw || result.cca_uid || '',
  ),
  useCompareTools: jest.fn(),
}));

const renderCard = (result) =>
  render(
    <IntlProvider locale="en">
      <NavigatorCatalogueCardItem result={result} />
    </IntlProvider>,
  );

describe('NavigatorCatalogueCardItem', () => {
  const setSelected = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useCompareTools.mockReturnValue({
      isSelected: false,
      isLimitReached: false,
      setSelected,
    });
  });

  it('renders complete tool metadata and selects the tool for comparison', () => {
    const result = {
      cca_uid: { raw: 'tool-uid' },
      title: 'Climate planning tool',
      href: 'https://example.com/tool',
      tool_type: {
        raw: {
          token: 'CLIMATE_DATA_EXPLORER_ATLAS',
          title: 'Climate data explorer / atlas',
        },
      },
      publication_date: { raw: '2026-07-24' },
      cca_adaptation_sectors: {
        raw: ['Agriculture', 'Water', 'Health', 'Energy'],
      },
      cca_climate_impacts: {
        raw: ['Drought', 'Flooding', 'Heat', 'Wildfires'],
      },
      cca_keywords: {
        raw: ['Planning', 'Risk assessment', 'Resilience', 'Adaptation'],
      },
      cca_type_of_outputs: {
        raw: [
          'Maps and graphs',
          'Reports and decision support',
          'Datasets and indicators',
        ],
      },
      cca_geographic_countries: {
        raw: [{ title: 'Germany' }, 'France'],
      },
      cca_adaptation_support_cycle_step: {
        raw: [
          { title: 'Step 1: Preparing the ground' },
          { title: 'Step 2: Assessing risks' },
          { title: 'Step 3: Identifying options' },
          { title: 'Step 4: Assessing options' },
        ],
      },
      _result: {
        tool_provider: { raw: 'A provider with a long official name' },
      },
    };

    renderCard(result);

    expect(screen.getByText('Climate planning tool')).toHaveAttribute(
      'href',
      'https://example.com/tool',
    );
    expect(
      screen.getByText('A provider with a long official name'),
    ).toHaveAttribute('title', 'A provider with a long official name');
    expect(screen.getByText('24 Jul 26')).toBeInTheDocument();
    expect(screen.getByText('Agriculture')).toBeInTheDocument();
    expect(screen.getByText('Energy')).toBeInTheDocument();
    expect(screen.getByText('Wildfires')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Sector: Energy' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Hazard: Wildfires' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Planning')).toBeInTheDocument();
    expect(screen.getByText('Risk assessment')).toBeInTheDocument();
    expect(screen.getByText('Resilience')).toBeInTheDocument();
    expect(screen.getByText('Adaptation')).toBeInTheDocument();
    expect(screen.getByText('Step 1')).toHaveAttribute(
      'title',
      'Step 1: Preparing the ground',
    );
    expect(
      screen.getByRole('button', {
        name: 'Cycle: Step 4: Assessing options',
      }),
    ).toHaveTextContent('+ 1');
    expect(
      screen.getByRole('button', {
        name: 'Cycle: Step 4: Assessing options',
      }),
    ).toHaveAttribute('title', 'Step 4: Assessing options');
    expect(screen.getByText('Step 4: Assessing options')).toBeInTheDocument();
    expect(screen.getByTitle('Germany, France')).toHaveTextContent(
      'Geographic coverage: Germany, France',
    );
    expect(screen.queryByText(/Type of outputs:/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('compare'));
    expect(setSelected).toHaveBeenCalledWith(true);
    expect(getCompareToolUid).toHaveBeenCalledWith(result);
    expect(getCompareToolTitle).toHaveBeenCalledWith(result);
    expect(useCompareTools).toHaveBeenCalledWith({
      uid: 'tool-uid',
      title: 'Climate planning tool',
      href: 'https://example.com/tool',
      tool_type: {
        token: 'CLIMATE_DATA_EXPLORER_ATLAS',
        title: 'Climate data explorer / atlas',
      },
    });
  });

  it('shows the cycle steps from the field used by the catalogue filter', () => {
    renderCard({
      title: 'Climate planning tool',
      href: 'https://example.com/tool',
      cca_adaptation_support_cycle_step: {
        raw: ['Step 2: Assessing risks'],
      },
      adaptation_support_cycle_step: {
        raw: [{ title: 'Step 1: Preparing the ground' }],
      },
    });

    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.queryByText('Step 1')).not.toBeInTheDocument();
  });

  it('falls back to broad geographic coverage', () => {
    renderCard({
      title: 'European tool',
      href: '/tool',
      cca_navigator_geographic_scope: { raw: ['Europe'] },
      cca_geographic_characterisation: { raw: ['Global'] },
    });

    expect(screen.getByTitle('Europe')).toHaveTextContent(
      'Geographic coverage: Europe',
    );
  });

  it('renders sparse results and disables comparison without a UID', () => {
    useCompareTools.mockReturnValue({
      isSelected: true,
      isLimitReached: true,
      setSelected,
    });

    renderCard({ title: '', href: '/tool' });

    expect(screen.getByText('[Tool name]')).toBeInTheDocument();
    expect(screen.queryByText('License:')).not.toBeInTheDocument();
    expect(screen.getByLabelText('compare')).toBeDisabled();
    expect(screen.getByLabelText('compare')).toBeChecked();
  });

  it('supports scalar and explicitly empty raw metadata', () => {
    renderCard({
      cca_uid: 'tool-uid',
      title: 'Scalar metadata tool',
      href: '/tool',
      cca_adaptation_sectors: 'Water',
      cca_climate_impacts: { raw: null },
      cca_license_status: { raw: '' },
      adaptation_support_cycle_step: { raw: null },
    });

    expect(screen.getByText('Water')).toBeInTheDocument();
    expect(screen.queryByText('License:')).not.toBeInTheDocument();
  });

  it('safely handles invalid, array, or malformed publication dates without throwing RangeError', () => {
    // Malformed/invalid date string that would throw RangeError: Invalid time value
    const { rerender } = renderCard({
      title: 'Invalid date tool',
      publication_date: 'N/A',
    });
    expect(screen.getByText('Invalid date tool')).toBeInTheDocument();
    expect(screen.queryByText('N/A')).not.toBeInTheDocument();

    // Array publication date
    rerender(
      <IntlProvider locale="en">
        <NavigatorCatalogueCardItem
          result={{
            title: 'Array date tool',
            publication_date: { raw: ['2026-07-24'] },
          }}
        />
      </IntlProvider>,
    );
    expect(screen.getByText('24 Jul 26')).toBeInTheDocument();

    // Malformed object publication date
    rerender(
      <IntlProvider locale="en">
        <NavigatorCatalogueCardItem
          result={{
            title: 'Object date tool',
            publication_date: { raw: { invalid: true } },
          }}
        />
      </IntlProvider>,
    );
    expect(screen.getByText('Object date tool')).toBeInTheDocument();
  });

  it('safely handles non-string adaptationSupportCycleSteps without throwing', () => {
    renderCard({
      title: 'Numeric cycle tool',
      adaptation_support_cycle_step: { raw: [123, null, { title: 456 }] },
    });
    expect(screen.getByText('Numeric cycle tool')).toBeInTheDocument();
  });

  describe('tool type icon rendering and fallback', () => {
    it('renders the circle icon from the Elasticsearch tool type', () => {
      const { container } = renderCard({
        title: 'Tool with a category',
        href: '/tools/my-tool',
        tool_type: {
          raw: {
            token: 'HAZARD_RISK_MAP_VIEWER',
            title: 'Hazard & risk map viewer',
          },
        },
      });

      const icon = container.querySelector('.navigator-tool-icon');
      expect(icon).toHaveClass('large');
      expect(icon).toHaveAttribute('title', 'Hazard & risk map viewer');
      expect(
        icon.querySelector('svg.navigator-tool-type-icon'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('.navigator-tool-icon .ri-file-line'),
      ).not.toBeInTheDocument();
    });

    it('keeps the placeholder when the item has no tool type', () => {
      const { container } = renderCard({
        title: 'Tool without category',
        image: '/legacy-thumbnail.jpg',
      });

      expect(
        container.querySelector('.navigator-tool-icon svg'),
      ).not.toBeInTheDocument();
      expect(
        container.querySelector('.navigator-tool-icon .ri-file-line'),
      ).toBeInTheDocument();
    });
  });
});
