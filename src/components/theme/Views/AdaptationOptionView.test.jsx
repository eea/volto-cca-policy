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
  RELEVANT_SYNERGIES: ['Synergy A', 'Synergy B'],
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

const mockStore = configureStore();

const renderWithStore = (ui) => {
  const store = mockStore({
    userSession: { token: '1234' },
    intl: { locale: 'en', messages: {} },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>,
  );
};

describe('AdaptationOptionView - coverage', () => {
  test('renders callout when description is non-empty and not "None"', () => {
    renderWithStore(
      <AdaptationOptionView
        content={{
          title: 't',
          description: 'Hello',
          long_description: { data: '<p>Long</p>' },
        }}
      />,
    );
    expect(screen.getByTestId('callout')).toHaveTextContent('Hello');
  });

  test('does not render callout when description is "None"', () => {
    renderWithStore(
      <AdaptationOptionView
        content={{
          title: 't',
          description: 'None',
          long_description: { data: '<p>Long</p>' },
        }}
      />,
    );
    expect(screen.queryByTestId('callout')).not.toBeInTheDocument();
  });

  test('renders EU policies list and filters invalid items', () => {
    renderWithStore(
      <AdaptationOptionView
        content={{
          title: 't',
          long_description: { data: '<p>Long</p>' },
          relevant_eu_policies_items: [
            { id: '1', title: 'Policy 1', url: 'https://example.com/p1' },
            { id: '2', title: null, url: 'https://example.com/bad' }, // filtered
            { id: '3', title: 'No URL', url: null }, // filtered
          ],
        }}
      />,
    );

    expect(screen.getByText('Policy 1')).toBeInTheDocument();
    expect(screen.queryByText('No URL')).not.toBeInTheDocument();
  });

  test('renders synergies "Yes" path and shows synergy labels', () => {
    renderWithStore(
      <AdaptationOptionView
        content={{
          title: 't',
          long_description: { data: '<p>Long</p>' },
          relevant_synergies: { token: 'Yes' },
        }}
      />,
    );

    expect(screen.getByText('Synergy A')).toBeInTheDocument();
    expect(screen.getByText('Synergy B')).toBeInTheDocument();
  });

  test('renders synergies "No" path', () => {
    renderWithStore(
      <AdaptationOptionView
        content={{
          title: 't',
          long_description: { data: '<p>Long</p>' },
          relevant_synergies: { token: 'No' },
        }}
      />,
    );

    expect(screen.getByText('No')).toBeInTheDocument();
  });

  test('renders related resources when enabled', () => {
    renderWithStore(
      <AdaptationOptionView
        content={{
          title: 't',
          long_description: { data: '<p>Long</p>' },
          show_related_resources: true,
        }}
      />,
    );

    expect(screen.getByTestId('render-blocks')).toBeInTheDocument();
  });

  test('accordion includes optional items when fields exist', () => {
    renderWithStore(
      <AdaptationOptionView
        content={{
          title: 't',
          long_description: { data: '<p>Long</p>' },
          ipcc_category: [
            { title: 'B', token: 'b' },
            { title: 'A', token: 'a' },
          ],
          category: 'Cat',
          stakeholder_participation: { data: '<p>Stake</p>' },
          success_limitations: { data: '<p>Limits</p>' },
          cost_benefit: { data: '<p>Cost</p>' },
          legal_aspects: { data: '<p>Legal</p>' },
          implementation_time: { data: '<p>Time</p>' },
          lifetime: { data: '<p>Life</p>' },
          source: { data: '<p>Source</p>' },
          websites: ['https://my-website.com'],
        }}
      />,
    );

    expect(screen.getByTestId('accordion-list')).toBeInTheDocument();
    expect(
      Number(screen.getByTestId('accordion-count').textContent),
    ).toBeGreaterThan(2);

    expect(screen.getByText('A, B')).toBeInTheDocument();

    expect(screen.getByTestId('links-list')).toHaveTextContent(
      'https://my-website.com',
    );
  });

  test('accordion baseline path (only description + references)', () => {
    renderWithStore(
      <AdaptationOptionView
        content={{
          title: 't',
          long_description: { data: '<p>Only long</p>' },
          source: { data: '<p>Source</p>' },
        }}
      />,
    );

    expect(screen.getByTestId('accordion-count')).toHaveTextContent('2');
    expect(screen.getAllByTestId('accordion-title')[0]).toHaveTextContent(
      'Description',
    );
    expect(screen.getAllByTestId('accordion-title')[1]).toHaveTextContent(
      'References',
    );
  });
});
