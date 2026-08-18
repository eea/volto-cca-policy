import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import ExtendedToolView from './ExtendedToolView';
import { useCompareTools } from '../CompareTools/utils';
import useClipboard from '@plone/volto/hooks/clipboard/useClipboard';

jest.mock('../CompareTools/utils', () => ({
  useCompareTools: jest.fn(),
}));

jest.mock('@plone/volto/hooks/clipboard/useClipboard', () => jest.fn());

jest.mock(
  '@plone/volto/components/manage/UniversalLink/UniversalLink',
  () =>
    ({ href, children }) => <a href={href}>{children}</a>,
);

jest.mock('@eeacms/volto-cca-policy/components', () => ({
  CompareToolsPanel: () => <div data-testid="compare-tools-panel" />,
  ExtendedToolGeographicMetadata: ({ content }) => (
    <div data-testid="geographic-metadata">{content.spatial_layer}</div>
  ),
  HTMLField: ({ value }) =>
    value ? <div dangerouslySetInnerHTML={{ __html: value }} /> : null,
  MetadataItemList: ({ value = [], asList }) => {
    const items = value.map((item) => item.title || item);

    return asList ? (
      <ul className="metadata-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    ) : (
      <p>{items.join(', ')}</p>
    );
  },
  PortalMessage: () => <div data-testid="portal-message" />,
  TextField: ({ label, value }) => (
    <>
      <h5>{label}</h5>
      <p>{value}</p>
    </>
  ),
}));

const toggle = jest.fn();
const copyShareUrl = jest.fn();
const setIsLinkCopied = jest.fn();

const renderComponent = (content = {}) =>
  render(
    <IntlProvider locale="en" messages={{}}>
      <ExtendedToolView content={content} />
    </IntlProvider>,
  );

describe('ExtendedToolView', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useCompareTools.mockReturnValue({
      isSelected: false,
      isLimitReached: false,
      toggle,
    });
    useClipboard.mockReturnValue([false, copyShareUrl, setIsLinkCopied]);
  });

  it('renders the title', () => {
    renderComponent({
      title: 'Climate Tool',
    });

    expect(
      screen.getByRole('heading', {
        name: 'Climate Tool',
      }),
    ).toBeInTheDocument();
  });

  it('renders related tools returned by the expander', async () => {
    renderComponent({
      title: 'Climate Tool',
      sectors: [
        { token: 'COASTAL', title: 'Coastal areas' },
        { token: 'WATERMANAGEMENT', title: 'Water management' },
      ],
      climate_impacts: [
        { token: 'DROUGHT', title: 'Droughts' },
        { token: 'WILDFIRES', title: 'Wildfires' },
      ],
      adaptation_support_cycle_step: [
        { token: 'STEP_1', title: 'Step 1: Preparing the ground' },
        { token: 'STEP_2', title: 'Step 2: Assessing risks' },
      ],
      '@components': {
        relatedtools: {
          items: [
            {
              '@id': '/tools/coastal-planner',
              title: 'Coastal planner',
              tool_provider: 'Climate agency',
              shared: {
                sectors: ['COASTAL', 'WATERMANAGEMENT'],
                climate_impacts: ['DROUGHT', 'WILDFIRES'],
                adaptation_support_cycle_step: ['STEP_1', 'STEP_2'],
              },
            },
          ],
        },
      },
    });

    const section = screen
      .getByRole('heading', { name: 'Related tools' })
      .closest('.extended-tool-related');
    const related = within(section);

    expect(
      related.getByText(/tools sharing a sector, hazard or cycle step/i),
    ).toBeInTheDocument();
    expect(related.getByText('Coastal areas')).toHaveClass('sector');
    expect(related.getByText('Droughts')).toHaveClass('hazard');
    expect(related.getByText('Step 1')).toHaveClass('adaptation-stage');
    expect(
      [...section.querySelectorAll('.navigator-tag:not(.more)')].map(
        (tag) => tag.textContent,
      ),
    ).toEqual(['Coastal areas', 'Droughts', 'Step 1']);
    expect(related.queryByText('Water management')).not.toBeInTheDocument();
    expect(related.queryByText('Wildfires')).not.toBeInTheDocument();
    expect(related.queryByText('Step 2')).not.toBeInTheDocument();
    const moreTags = related.getAllByRole('button');
    expect(moreTags).toHaveLength(3);
    expect(moreTags[0]).toHaveClass('sector', 'more');
    expect(moreTags[0]).toHaveAccessibleName('Water management');
    expect(moreTags[1]).toHaveClass('hazard', 'more');
    expect(moreTags[1]).toHaveAccessibleName('Wildfires');
    expect(moreTags[2]).toHaveClass('adaptation-stage', 'more');
    expect(moreTags[2]).toHaveAccessibleName('Step 2: Assessing risks');
    fireEvent.mouseOver(moreTags[0]);
    expect(await screen.findByText('Water management')).toBeInTheDocument();
    expect(related.getByRole('link', { name: /view/i })).toHaveAttribute(
      'href',
      '/tools/coastal-planner',
    );
  });

  it('shows one tag and a category-specific remainder for one category', () => {
    renderComponent({
      title: 'Climate Tool',
      sectors: [
        { token: 'COASTAL', title: 'Coastal areas' },
        { token: 'HEALTH', title: 'Health' },
        { token: 'TRANSPORT', title: 'Transport' },
        { token: 'WATERMANAGEMENT', title: 'Water management' },
      ],
      '@components': {
        relatedtools: {
          items: [
            {
              '@id': '/tools/coastal-planner',
              title: 'Coastal planner',
              shared: {
                sectors: ['COASTAL', 'HEALTH', 'TRANSPORT', 'WATERMANAGEMENT'],
              },
            },
          ],
        },
      },
    });

    expect(screen.getByText('Coastal areas')).toHaveClass('sector');
    expect(screen.queryByText('Health')).not.toBeInTheDocument();
    expect(screen.queryByText('Transport')).not.toBeInTheDocument();
    expect(screen.queryByText('Water management')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /health/i })).toHaveTextContent(
      '+ 3',
    );
  });

  it('hides the related tools section when the expander returns no items', () => {
    renderComponent({
      title: 'Climate Tool',
      '@components': { relatedtools: { items: [] } },
    });

    expect(
      screen.queryByRole('heading', { name: 'Related tools' }),
    ).not.toBeInTheDocument();
  });

  it('renders the open-tool button when a hyperlink is provided', () => {
    renderComponent({
      title: 'Climate Tool',
      hyperlink: 'https://example.com/tool',
    });

    const openToolButton = screen.getByRole('button', {
      name: /open tool/i,
    });

    expect(openToolButton).toHaveAttribute('href', 'https://example.com/tool');
    expect(openToolButton).toHaveAttribute('target', '_blank');
    expect(openToolButton).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not render the open-tool button without a hyperlink', () => {
    renderComponent({
      title: 'Climate Tool',
    });

    expect(
      screen.queryByRole('button', {
        name: /open tool/i,
      }),
    ).not.toBeInTheDocument();
  });

  it('adds the tool to comparison when the button is clicked', () => {
    renderComponent({
      UID: 'tool-uid',
      '@id': '/tools/climate-tool',
      title: 'Climate Tool',
      hyperlink: 'https://example.com/tool',
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: /add to comparison/i,
      }),
    );

    expect(toggle).toHaveBeenCalledTimes(1);
  });

  it('copies the current page link when the share button is clicked', () => {
    renderComponent({
      UID: 'tool-uid',
      '@id': '/tools/climate-tool',
      title: 'Climate Tool',
      hyperlink: 'https://example.com/tool',
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: /share/i,
      }),
    );

    expect(useClipboard).toHaveBeenCalledWith('/tools/climate-tool');
    expect(copyShareUrl).toHaveBeenCalledTimes(1);
  });

  it('shows confirmation after the link is copied', () => {
    useClipboard.mockReturnValue([true, copyShareUrl, setIsLinkCopied]);

    renderComponent({
      UID: 'tool-uid',
      '@id': '/tools/climate-tool',
      title: 'Climate Tool',
      hyperlink: 'https://example.com/tool',
    });

    expect(
      screen.getByRole('button', {
        name: /link copied/i,
      }),
    ).toBeInTheDocument();
  });

  it('resets the copied confirmation after six seconds', () => {
    jest.useFakeTimers();
    useClipboard.mockReturnValue([true, copyShareUrl, setIsLinkCopied]);

    renderComponent({
      UID: 'tool-uid',
      '@id': '/tools/climate-tool',
      title: 'Climate Tool',
      hyperlink: 'https://example.com/tool',
    });

    jest.advanceTimersByTime(6000);

    expect(setIsLinkCopied).toHaveBeenCalledWith(false);
    jest.useRealTimers();
  });

  it('passes the correct tool data to useCompareTools', () => {
    renderComponent({
      UID: 'tool-uid',
      '@id': '/tools/climate-tool',
      title: 'Climate Tool',
      hyperlink: 'https://example.com/tool',
    });

    expect(useCompareTools).toHaveBeenCalledWith({
      uid: 'tool-uid',
      title: 'Climate Tool',
      href: '/tools/climate-tool',
    });
  });

  it('disables the comparison button when the tool is selected', () => {
    useCompareTools.mockReturnValue({
      isSelected: true,
      isLimitReached: false,
      toggle,
    });

    renderComponent({
      UID: 'tool-uid',
      '@id': '/tools/climate-tool',
      title: 'Climate Tool',
      hyperlink: 'https://example.com/tool',
    });

    const button = screen.getByRole('button', {
      name: /add to comparison/i,
    });

    expect(button).toBeDisabled();
  });

  it('disables the comparison button when the comparison limit is reached', () => {
    useCompareTools.mockReturnValue({
      isSelected: false,
      isLimitReached: true,
      toggle,
    });

    renderComponent({
      UID: 'tool-uid',
      '@id': '/tools/climate-tool',
      title: 'Climate Tool',
      hyperlink: 'https://example.com/tool',
    });

    const button = screen.getByRole('button', {
      name: /add to comparison/i,
    });

    expect(button).toBeDisabled();
  });

  it('does not call toggle when the comparison button is disabled', () => {
    useCompareTools.mockReturnValue({
      isSelected: true,
      isLimitReached: false,
      toggle,
    });

    renderComponent({
      UID: 'tool-uid',
      '@id': '/tools/climate-tool',
      title: 'Climate Tool',
      hyperlink: 'https://example.com/tool',
    });

    const button = screen.getByRole('button', {
      name: /add to comparison/i,
    });

    fireEvent.click(button);

    expect(toggle).not.toHaveBeenCalled();
  });

  it('does not render the comparison button without a UID', () => {
    renderComponent({
      title: 'Climate Tool',
      hyperlink: 'https://example.com/tool',
    });

    expect(
      screen.queryByRole('button', {
        name: /add to comparison/i,
      }),
    ).not.toBeInTheDocument();
  });

  it('renders the tool provider', () => {
    renderComponent({
      title: 'Climate Tool',
      tool_provider: 'Example Provider',
    });

    expect(screen.getByText('Example Provider')).toBeInTheDocument();
  });

  it('does not render removed coder fields', () => {
    renderComponent({
      title: 'Climate Tool',
      coder_1: 'Coder One',
      coder_2: 'Coder Two',
    });

    expect(screen.queryByText('Coder1')).not.toBeInTheDocument();
    expect(screen.queryByText('Coder One')).not.toBeInTheDocument();
    expect(screen.queryByText('Coder2')).not.toBeInTheDocument();
    expect(screen.queryByText('Coder Two')).not.toBeInTheDocument();
  });

  it('renders the long HTML description', () => {
    renderComponent({
      title: 'Climate Tool',
      long_description: '<p>Long tool description</p>',
    });

    expect(screen.getByText('Long tool description')).toBeInTheDocument();
  });

  it('renders tool usage information in labelled rows', () => {
    const { container } = renderComponent({
      title: 'Climate Tool',
      tool_input: '<p>A coastal location</p>',
      tool_output: '<p>A hazard profile</p>',
      use_it_to: '<p>Screen a coastline</p>',
    });

    expect(
      screen.getByRole('heading', { name: 'What you can do with it' }),
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll('.extended-tool-information-row'),
    ).toHaveLength(3);
    expect(screen.getByText('A coastal location')).toBeInTheDocument();
    expect(screen.getByText('A hazard profile')).toBeInTheDocument();
    expect(screen.getByText('Screen a coastline')).toBeInTheDocument();
  });

  it('does not render removed detail fields', () => {
    renderComponent({
      title: 'Climate Tool',
      place_of_implementation: ['Europe'],
      data_sources: ['Satellite'],
      license_status: ['Open source'],
      user_support_provisions: ['Documentation'],
      tool_validation_use: ['Validated'],
      number_of_users_tool: ['More than 1,000'],
      functionality: 4,
      underlying_data_maintenance: 'Updated yearly',
      strengths_and_possible_limitations: 'Easy to use',
    });

    expect(screen.queryByText('Europe')).not.toBeInTheDocument();
    expect(screen.queryByText('Satellite')).not.toBeInTheDocument();
    expect(screen.queryByText('Open source')).not.toBeInTheDocument();
    expect(screen.queryByText('Documentation')).not.toBeInTheDocument();
    expect(screen.queryByText('Validated')).not.toBeInTheDocument();
    expect(screen.queryByText('More than 1,000')).not.toBeInTheDocument();
    expect(screen.queryByText('4')).not.toBeInTheDocument();
    expect(screen.queryByText('Updated yearly')).not.toBeInTheDocument();
    expect(screen.queryByText('Easy to use')).not.toBeInTheDocument();
  });

  it('renders accessibility and usability as a vocabulary value', () => {
    renderComponent({
      title: 'Climate Tool',
      accessibility_and_usability: 'Easy to use',
    });

    expect(screen.getByText('Easy to use')).toBeInTheDocument();
  });

  it('renders metadata except spatial coverage', () => {
    renderComponent({
      title: 'Climate Tool',
      spatial_layer: 'Global',
      spatial_resolution: 'Regional',
      adaptation_support_cycle_step: [
        { title: 'Step 2: Risk & vulnerability assessment' },
        { title: 'Step 3: Identifying adaptation options' },
      ],
      climate_impacts: [{ title: 'Drought' }, { title: 'Flooding' }],
      sectors: [{ title: 'Agriculture' }, { title: 'Health' }],
      type_of_outputs: [{ title: 'Maps' }, { title: 'Charts' }],
      temporality_of_data: [{ title: 'Historical' }, { title: 'Projections' }],
      tool_available_english: true,
      tool_available_language: [{ title: 'French' }, 'Romanian'],
      intended_user_groups: [{ title: 'Policy makers' }, 'Researchers'],
      accessibility_and_usability: 'Easy to use',
    });

    expect(
      screen.getByRole('heading', { name: 'Metadata' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Geographic coverage' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('geographic-metadata')).toHaveTextContent(
      'Global',
    );
    expect(
      screen.getByRole('heading', { name: 'Spatial resolution' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Regional')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: 'Support of Adaptation Policy Cycle',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Step 2: Risk & vulnerability assessment'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Step 3: Identifying adaptation options'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Climate impacts' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Drought, Flooding')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Adaptation sectors' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Agriculture, Health')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Type of outputs' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Maps, Charts')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Temporality of data' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Historical, Projections')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Language' }),
    ).toBeInTheDocument();
    expect(screen.getByText('English, French, Romanian')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'User Group' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Policy makers, Researchers')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Accessibility and usability' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Easy to use')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Spatial coverage' }),
    ).not.toBeInTheDocument();
  });

  it('renders supporting components', () => {
    renderComponent({
      title: 'Climate Tool',
    });

    expect(screen.getByTestId('compare-tools-panel')).toBeInTheDocument();
    expect(screen.getByTestId('portal-message')).toBeInTheDocument();
  });
});
