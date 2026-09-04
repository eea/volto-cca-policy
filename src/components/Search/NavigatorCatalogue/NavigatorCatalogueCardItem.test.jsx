import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import NavigatorCatalogueCardItem, {
  getToolThumbnailUrl,
} from './NavigatorCatalogueCardItem';
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
      publication_date: { raw: '2026-07-24' },
      cca_adaptation_sectors: {
        raw: ['Agriculture', 'Water', 'Health', 'Energy'],
      },
      cca_climate_impacts: {
        raw: ['Drought', 'Flooding', 'Heat', 'Wildfires'],
      },
      cca_license_status: {
        raw: [
          'Open data with attribution requirements',
          { title: 'Restricted' },
        ],
      },
      adaptation_support_cycle_step: {
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
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.queryByText('Step 4')).not.toBeInTheDocument();
    expect(
      screen.getByTitle('Open data with attribution requirements, Restricted'),
    ).toHaveTextContent(
      'License: Open data with attribution requirements, Restricted',
    );
    expect(screen.getByText('Type: Tool')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('compare'));
    expect(setSelected).toHaveBeenCalledWith(true);
    expect(getCompareToolUid).toHaveBeenCalledWith(result);
    expect(getCompareToolTitle).toHaveBeenCalledWith(result);
    expect(useCompareTools).toHaveBeenCalledWith({
      uid: 'tool-uid',
      title: 'Climate planning tool',
      href: 'https://example.com/tool',
    });
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

  describe('thumbnail rendering and fallback', () => {
    it('renders thumbnail image and smoothly transitions from placeholder on load', () => {
      const { container } = renderCard({
        title: 'Tool with image',
        href: '/tools/my-tool',
      });

      const img = container.querySelector('.navigator-tool-icon img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/tools/my-tool/@@images/image/thumb');
      expect(img).toHaveStyle({ display: 'none' });
      expect(
        container.querySelector('.navigator-tool-icon .ri-file-line'),
      ).toBeInTheDocument();

      // Fire load event on image
      fireEvent.load(img);

      expect(img).not.toHaveStyle({ display: 'none' });
      expect(
        container.querySelector('.navigator-tool-icon .ri-file-line'),
      ).not.toBeInTheDocument();
    });

    it('falls back to placeholder icon when image fails to load', () => {
      const { container } = renderCard({
        title: 'Tool with broken image',
        href: '/tools/broken-tool',
      });

      const img = container.querySelector('.navigator-tool-icon img');
      expect(img).toBeInTheDocument();

      // Fire error event on image (e.g. 404 from backend)
      fireEvent.error(img);

      expect(
        container.querySelector('.navigator-tool-icon img'),
      ).not.toBeInTheDocument();
      expect(
        container.querySelector('.navigator-tool-icon .ri-file-line'),
      ).toBeInTheDocument();
    });

    it('renders placeholder icon directly when item has no image or href', () => {
      const { container } = renderCard({
        title: 'Tool without image',
        image: null,
      });

      expect(
        container.querySelector('.navigator-tool-icon img'),
      ).not.toBeInTheDocument();
      expect(
        container.querySelector('.navigator-tool-icon .ri-file-line'),
      ).toBeInTheDocument();
    });
  });

  describe('getToolThumbnailUrl', () => {
    it('returns null for empty or invalid results', () => {
      expect(getToolThumbnailUrl(null)).toBeNull();
      expect(getToolThumbnailUrl(undefined)).toBeNull();
      expect(getToolThumbnailUrl({})).toBeNull();
      expect(getToolThumbnailUrl({ image: null })).toBeNull();
      expect(getToolThumbnailUrl({ image: false })).toBeNull();
    });

    it('resolves direct image string URL', () => {
      expect(
        getToolThumbnailUrl({ image: '/metadata/tools/tool/image.png' }),
      ).toBe('/metadata/tools/tool/image.png');
    });

    it('resolves image scales from Dexterity image field', () => {
      expect(
        getToolThumbnailUrl({
          image: {
            scales: {
              thumb: { download: '/image-128.jpeg' },
              tile: { download: '/image-64.jpeg' },
            },
          },
        }),
      ).toBe('/image-128.jpeg');

      expect(
        getToolThumbnailUrl({
          image: {
            scales: {
              tile: { download: '/image-64.jpeg' },
            },
          },
        }),
      ).toBe('/image-64.jpeg');

      expect(
        getToolThumbnailUrl({
          image: {
            download: '/image-original.jpeg',
          },
        }),
      ).toBe('/image-original.jpeg');
    });

    it('resolves thumbUrl when not portal_depiction fallback', () => {
      expect(
        getToolThumbnailUrl({
          thumbUrl: '/custom-thumb.jpg',
        }),
      ).toBe('/custom-thumb.jpg');

      // portal_depiction is ignored, falls back to href scale
      expect(
        getToolThumbnailUrl({
          thumbUrl:
            'https://www.eea.europa.eu/portal_depiction/tool/image_preview',
          href: '/tools/sample-tool',
        }),
      ).toBe('/tools/sample-tool/@@images/image/thumb');
    });

    it('constructs scale traversal URL from href, @id, or about', () => {
      expect(
        getToolThumbnailUrl({
          href: '/tools/sample-tool/',
        }),
      ).toBe('/tools/sample-tool/@@images/image/thumb');

      expect(
        getToolThumbnailUrl({
          '@id': '/tools/sample-tool',
        }),
      ).toBe('/tools/sample-tool/@@images/image/thumb');

      expect(
        getToolThumbnailUrl({
          about: { raw: '/tools/sample-tool' },
        }),
      ).toBe('/tools/sample-tool/@@images/image/thumb');
    });
  });
});
