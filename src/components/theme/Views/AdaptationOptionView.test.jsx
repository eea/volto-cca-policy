import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import AdaptationOptionView from './AdaptationOptionView';

jest.mock('@eeacms/volto-cca-policy/components', () => ({
  AccordionList: ({ accordions }) => (
    <div data-testid="accordion-list">
      <div data-testid="accordion-count">{accordions.length}</div>

      {accordions.map((a, i) => (
        <div key={i} data-testid={`accordion-${i}`}>
          <div data-testid="accordion-title">{a.title}</div>
          <div data-testid="accordion-content">{a.content}</div>
        </div>
      ))}
    </div>
  ),
  PortalMessage: () => <div data-testid="portal-message" />,
  ShareInfoButton: () => <div data-testid="share-info" />,
}));

jest.mock('@eeacms/volto-cca-policy/helpers', () => ({
  HTMLField: ({ value, className }) => (
    <div data-testid={className ? `html-${className}` : 'html-field'}>
      {value?.data ?? value ?? ''}
    </div>
  ),
  ContentMetadata: () => <div data-testid="content-metadata" />,
  PublishedModifiedInfo: () => <div data-testid="published-modified" />,
  BannerTitle: () => <div data-testid="banner-title" />,
  LinksList: ({ value }) => (
    <div data-testid="links-list">{(value || []).join(',')}</div>
  ),
}));

jest.mock('@eeacms/volto-eea-design-system/ui', () => ({
  Callout: ({ children }) => <div data-testid="callout">{children}</div>,
}));

jest.mock('@plone/volto/components/theme/View/RenderBlocks', () => () => (
  <div data-testid="render-blocks" />
));

jest.mock('@plone/volto/components', () => ({
  UniversalLink: ({ href, children }) => <a href={href}>{children}</a>,
}));

jest.mock('semantic-ui-react', () => ({
  ...jest.requireActual('semantic-ui-react'),
}));

jest.mock('@eeacms/volto-cca-policy/utils', () => ({
  getFilteredBlocks: jest.fn(() => ({
    blocks: {},
    blocks_layout: { items: [] },
  })),
}));

const mockStore = configureStore();

const renderWithStore = (content = {}) => {
  const store = mockStore({
    userSession: { token: '1234' },
    intl: { locale: 'en', messages: {} },
  });

  const defaultContent = {
    title: 't',
    long_description: { data: '<p>Long</p>' },
    relevant_synergies: [],
    relevant_eu_policies_items: [],
    websites: [],
    ...content,
  };

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <AdaptationOptionView content={defaultContent} />
      </MemoryRouter>
    </Provider>,
  );
};

describe('AdaptationOptionView - coverage', () => {
  test('renders callout when description is non-empty and not "None"', () => {
    renderWithStore({
      description: 'Hello',
    });

    expect(screen.getByTestId('callout')).toHaveTextContent('Hello');
  });

  test('does not render callout when description is "None"', () => {
    renderWithStore({
      description: 'None',
    });

    expect(screen.queryByTestId('callout')).not.toBeInTheDocument();
  });

  test('renders EU policies list and filters invalid items', () => {
    renderWithStore({
      relevant_eu_policies_items: [
        { id: '1', title: 'Policy 1', url: 'https://example.com/p1' },
        { id: '2', title: null, url: 'https://example.com/bad' },
        { id: '3', title: 'No URL', url: null },
      ],
    });

    expect(screen.getByText('Policy 1')).toBeInTheDocument();
    expect(screen.queryByText('No URL')).not.toBeInTheDocument();
  });

  test('renders synergies section with multiple titles', () => {
    renderWithStore({
      relevant_synergies: [
        {
          token: 'reducing_energy_demand',
          title: 'Reducing energy demand',
        },
        {
          token: 'carbon_capture_and_storage',
          title: 'Carbon capture and storage',
        },
      ],
    });

    expect(
      screen.getByText('Reducing energy demand, Carbon capture and storage'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Relevant synergies with mitigation'),
    ).toBeInTheDocument();
  });

  test('renders synergies section when item token is no_relevant_synergies (current component behavior)', () => {
    renderWithStore({
      relevant_synergies: [
        {
          token: 'no_relevant_synergies',
          title: 'No relevant synergies with mitigation',
        },
      ],
    });

    expect(
      screen.getByText('Relevant synergies with mitigation'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('No relevant synergies with mitigation'),
    ).toBeInTheDocument();
  });

  test('does not render synergies section when the array is empty', () => {
    renderWithStore({
      relevant_synergies: [],
    });

    expect(
      screen.queryByText('Relevant synergies with mitigation'),
    ).not.toBeInTheDocument();
  });

  test('renders related resources when enabled', () => {
    renderWithStore({
      show_related_resources: true,
    });

    expect(screen.getByTestId('render-blocks')).toBeInTheDocument();
  });

  test('accordion includes optional items when fields exist', () => {
    renderWithStore({
      category: 'Cat',
      stakeholder_participation: { data: '<p>Stake</p>' },
      success_limitations: { data: '<p>Limits</p>' },
      cost_benefit: { data: '<p>Cost</p>' },
      legal_aspects: { data: '<p>Legal</p>' },
      implementation_time: { data: '<p>Time</p>' },
      lifetime: { data: '<p>Life</p>' },
      source: { data: '<p>Source</p>' },
      websites: ['https://my-website.com'],
    });

    expect(screen.getByTestId('accordion-list')).toBeInTheDocument();
    expect(
      Number(screen.getByTestId('accordion-count').textContent),
    ).toBeGreaterThan(2);

    expect(screen.getByTestId('links-list')).toHaveTextContent(
      'https://my-website.com',
    );
  });

  test('accordion baseline path (only description + references)', () => {
    renderWithStore({
      long_description: { data: '<p>Only long</p>' },
      source: { data: '<p>Source</p>' },
    });

    expect(screen.getByTestId('accordion-count')).toHaveTextContent('2');
    expect(screen.getAllByTestId('accordion-title')[0]).toHaveTextContent(
      'Description',
    );
    expect(screen.getAllByTestId('accordion-title')[1]).toHaveTextContent(
      'References',
    );
  });
});
