import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import ExtendedToolView from './ExtendedToolView';
import { useCompareTools } from '../CompareTools/utils';
import { formatFunctionalityScore } from '../../Search/NavigatorCatalogue/utils';
import useClipboard from '@plone/volto/hooks/clipboard/useClipboard';

jest.mock('../CompareTools/utils', () => ({
  useCompareTools: jest.fn(),
}));

jest.mock('@plone/volto/hooks/clipboard/useClipboard', () => jest.fn());

jest.mock('@eeacms/volto-cca-policy/components', () => ({
  BooleanField: ({ label, value, yesLabel, noLabel }) => (
    <div>
      <span>{label}</span>
      <span>{value ? yesLabel : noLabel}</span>
    </div>
  ),
  CompareToolsPanel: () => <div data-testid="compare-tools-panel" />,
  ContentMetadata: () => <div data-testid="content-metadata" />,
  DocumentsList: () => <div data-testid="documents-list" />,
  HTMLField: ({ value }) =>
    value ? <div dangerouslySetInnerHTML={{ __html: value }} /> : null,
  ItemLogo: () => <div data-testid="item-logo" />,
  PortalMessage: () => <div data-testid="portal-message" />,
  TextField: ({ label, value }) =>
    value !== null && value !== undefined && value !== '' ? (
      <div>
        <span>{label}</span>
        <span>{String(value)}</span>
      </div>
    ) : null,

  VocabularyField: ({ label, values = [], asList }) =>
    values.length > 0 ? (
      <div>
        <span>{label}</span>
        {asList ? (
          <ul>
            {values.map((value, index) => (
              <li key={`${value}-${index}`}>{value}</li>
            ))}
          </ul>
        ) : (
          <span>{values.join(', ')}</span>
        )}
      </div>
    ) : null,
}));

jest.mock('@plone/volto/registry', () => ({
  blocks: {
    blocksConfig: {
      title: {
        view: ({ metadata }) => <h1>{metadata.title}</h1>,
      },
    },
  },
}));

jest.mock('../../Search/NavigatorCatalogue/utils', () => ({
  formatFunctionalityScore: jest.fn((value) => `Formatted score: ${value}`),
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

  it('renders the title and acronym', () => {
    renderComponent({
      title: 'Climate Tool',
      acronym: 'CT',
    });

    expect(
      screen.getByRole('heading', {
        name: 'Climate Tool (CT)',
      }),
    ).toBeInTheDocument();
  });

  it('renders the title without an acronym', () => {
    renderComponent({
      title: 'Climate Tool',
    });

    expect(
      screen.getByRole('heading', {
        name: 'Climate Tool',
      }),
    ).toBeInTheDocument();
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
    });

    expect(
      screen.queryByRole('button', {
        name: /add to comparison/i,
      }),
    ).not.toBeInTheDocument();
  });

  it('renders English and the additional available language', () => {
    renderComponent({
      title: 'Climate Tool',
      tool_available_english: true,
      tool_available_language: 'French',
    });

    expect(screen.getByText('English, French')).toBeInTheDocument();
  });

  it('renders only English when no additional language is provided', () => {
    renderComponent({
      title: 'Climate Tool',
      tool_available_english: true,
    });

    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('renders only the additional language when English is unavailable', () => {
    renderComponent({
      title: 'Climate Tool',
      tool_available_english: false,
      tool_available_language: 'Romanian',
    });

    expect(screen.getByText('Romanian')).toBeInTheDocument();
    expect(screen.queryByText(/English,/)).not.toBeInTheDocument();
  });

  it('does not render an available-language value when none exists', () => {
    renderComponent({
      title: 'Climate Tool',
      tool_available_english: false,
      tool_available_language: '',
    });

    expect(screen.queryByText('Available language')).not.toBeInTheDocument();
  });

  it('formats the functionality score', () => {
    renderComponent({
      title: 'Climate Tool',
      functionality: 4,
    });

    expect(formatFunctionalityScore).toHaveBeenCalledWith(4);
    expect(screen.getByText('Formatted score: 4')).toBeInTheDocument();
  });

  it('formats a functionality score of zero', () => {
    renderComponent({
      title: 'Climate Tool',
      functionality: 0,
    });

    expect(formatFunctionalityScore).toHaveBeenCalledWith(0);
    expect(screen.getByText('Formatted score: 0')).toBeInTheDocument();
  });

  it('does not format an undefined functionality score', () => {
    renderComponent({
      title: 'Climate Tool',
    });

    expect(formatFunctionalityScore).not.toHaveBeenCalled();
  });

  it('does not format a null functionality score', () => {
    renderComponent({
      title: 'Climate Tool',
      functionality: null,
    });

    expect(formatFunctionalityScore).not.toHaveBeenCalled();
  });

  it('renders the supported text fields', () => {
    renderComponent({
      title: 'Climate Tool',
      tool_provider: 'Example Provider',
      spatial_resolution: 'Regional',
      underlying_data_maintenance: 'Updated yearly',
      strengths_and_possible_limitations: 'Easy to use',
    });

    expect(screen.getByText('Example Provider')).toBeInTheDocument();
    expect(screen.getByText('Regional')).toBeInTheDocument();
    expect(screen.getByText('Updated yearly')).toBeInTheDocument();
    expect(screen.getByText('Easy to use')).toBeInTheDocument();
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

  it('renders HTML descriptions', () => {
    renderComponent({
      title: 'Climate Tool',
      long_description: '<p>Long tool description</p>',
      description: '<p>Short tool description</p>',
    });

    expect(screen.getByText('Long tool description')).toBeInTheDocument();
    expect(screen.getByText('Short tool description')).toBeInTheDocument();
  });

  it('renders boolean fields with Yes values', () => {
    renderComponent({
      title: 'Climate Tool',
      only_interactive_support_tool: true,
      adaptation_cycle_step: true,
      updating_cycle_of_the_tool: true,
      language_accessibility: true,
      free_access: true,
    });

    expect(screen.getAllByText('Yes')).toHaveLength(5);
  });

  it('renders boolean fields with No values', () => {
    renderComponent({
      title: 'Climate Tool',
      only_interactive_support_tool: false,
      adaptation_cycle_step: false,
      updating_cycle_of_the_tool: false,
      language_accessibility: false,
      free_access: false,
    });

    expect(screen.getAllByText('No')).toHaveLength(5);
  });

  it('renders vocabulary fields', () => {
    renderComponent({
      title: 'Climate Tool',
      intended_user_groups: ['Policy makers', 'Researchers'],
      place_of_implementation: ['Europe'],
      type_of_data: ['Climate data'],
      data_sources: ['Satellite'],
      license_status: ['Open source'],
      user_support_provisions: ['Documentation'],
      tool_validation_use: ['Validated'],
      number_of_users_tool: ['More than 1,000'],
      tool_provider_mode: ['Public provider'],
      adaptation_support_cycle_step: ['Assessing risks'],
      type_of_outputs: ['Maps'],
      temporality_of_data: ['Historical'],
    });

    expect(screen.getByText('Policy makers, Researchers')).toBeInTheDocument();
    expect(screen.getByText('Europe')).toBeInTheDocument();
    expect(screen.getByText('Climate data')).toBeInTheDocument();
    expect(screen.getByText('Satellite')).toBeInTheDocument();
    expect(screen.getByText('Open source')).toBeInTheDocument();
    expect(screen.getByText('Documentation')).toBeInTheDocument();
    expect(screen.getByText('Validated')).toBeInTheDocument();
    expect(screen.getByText('More than 1,000')).toBeInTheDocument();
    expect(screen.getByText('Public provider')).toBeInTheDocument();
    expect(screen.getByText('Assessing risks')).toBeInTheDocument();
    expect(screen.getByText('Maps')).toBeInTheDocument();
    expect(screen.getByText('Historical')).toBeInTheDocument();
  });

  it('renders accessibility and usability as a vocabulary value', () => {
    renderComponent({
      title: 'Climate Tool',
      accessibility_and_usability: 'Easy to use',
    });

    expect(screen.getByText('Easy to use')).toBeInTheDocument();
  });

  it('renders supporting components', () => {
    renderComponent({
      title: 'Climate Tool',
    });

    expect(screen.getByTestId('item-logo')).toBeInTheDocument();
    expect(screen.getByTestId('compare-tools-panel')).toBeInTheDocument();
    expect(screen.getByTestId('portal-message')).toBeInTheDocument();
    expect(screen.getByTestId('content-metadata')).toBeInTheDocument();
    expect(screen.getByTestId('documents-list')).toBeInTheDocument();
  });
});
