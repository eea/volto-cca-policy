import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import EventCardsListingView from './EventCardsListingView';

const mockStore = configureStore();

jest.mock('@plone/volto/components', () => ({
  ConditionalLink: ({ children }) => <div>{children}</div>,
  UniversalLink: ({ children }) => <button>{children}</button>,
}));

jest.mock('@plone/volto/components/theme/View/EventDatesInfo', () => ({
  When: () => <span>EventDatesInfo</span>,
}));

jest.mock('@eeacms/volto-cca-policy/helpers', () => ({
  capitalizeFirstLetter: (str) => str.charAt(0).toUpperCase() + str.slice(1),
}));

jest.mock('@plone/volto/registry', () => ({
  settings: { apiPath: '/api' },
}));

jest.mock('semantic-ui-react', () => {
  const Card = ({ children }) => <div className="card">{children}</div>;
  Card.Content = ({ children }) => (
    <div className="card-content">{children}</div>
  );
  const Grid = ({ children, stackable, columns }) => <div>{children}</div>;
  Grid.Row = ({ children, columns }) => <div>{children}</div>;
  Grid.Column = ({ children, width, mobile, tablet, computer, className }) => (
    <div>{children}</div>
  );
  return {
    Card,
    Icon: ({ className, name }) => <i className={className || name} />,
    Label: ({ children }) => <span>{children}</span>,
    Image: ({ src, alt, title }) => <img src={src} alt={alt} title={title} />,
    Grid,
  };
});

jest.mock('@eeacms/volto-cca-policy/constants', () => ({
  CCA_EVENT: 'Event',
}));

describe('EventCardsListingView', () => {
  it('renders event cards with all event details', () => {
    const items = [
      {
        UID: 'event-1',
        '@id': '/en/events/event-1',
        '@type': 'Event',
        title: 'Summer Conference 2025',
        start: '2025-06-20T10:00:00',
        end: '2025-06-20T12:00:00',
        location: 'Brussels Convention Center',
        description: 'A conference about climate adaptation',
        subjects: ['Climate', 'Adaptation'],
        contact_email: 'contact@example.com',
        event_url: 'https://external-event.com',
      },
    ];

    const store = mockStore({
      intl: { locale: 'en', messages: {} },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <EventCardsListingView items={items} isEditMode={false} />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Summer Conference 2025')).toBeInTheDocument();
    expect(screen.getByText('EventDatesInfo')).toBeInTheDocument();
    expect(screen.getByText('Brussels Convention Center')).toBeInTheDocument();
    expect(
      screen.getByText('A conference about climate adaptation'),
    ).toBeInTheDocument();
    expect(screen.getByText('Climate')).toBeInTheDocument();
    expect(screen.getByText('Adaptation')).toBeInTheDocument();
    expect(screen.getByText('contact@example.com')).toBeInTheDocument();
  });

  it('renders event card without location, description, and contact email', () => {
    const items = [
      {
        UID: 'event-2',
        '@id': '/en/events/event-2',
        '@type': 'Event',
        title: 'Minimal Event',
        start: '2025-07-15T14:00:00',
        end: '2025-07-15T16:00:00',
      },
    ];

    const store = mockStore({
      intl: { locale: 'en', messages: {} },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <EventCardsListingView items={items} isEditMode={true} />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Minimal Event')).toBeInTheDocument();
    expect(screen.getByText('EventDatesInfo')).toBeInTheDocument();

    expect(screen.queryByText('Brussels Convention Center')).toBeNull();
    expect(screen.queryByText('contact@example.com')).toBeNull();
  });

  it('renders multiple event cards with subjects and EEA logo for non-mission events', () => {
    const items = [
      {
        UID: 'event-3',
        '@id': '/en/events/event-3',
        '@type': 'Event',
        title: 'Event 1',
        start: '2025-08-01T09:00:00',
        subjects: ['Tag1'],
      },
      {
        UID: 'event-4',
        '@id': '/en/events/event-4',
        '@type': 'Event',
        title: 'Event 2',
        start: '2025-08-02T11:00:00',
        subjects: ['Tag2', 'Tag3'],
      },
    ];

    const store = mockStore({
      intl: { locale: 'en', messages: {} },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <EventCardsListingView items={items} isEditMode={false} />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Event 2')).toBeInTheDocument();
    expect(screen.getByText('Tag1')).toBeInTheDocument();
    expect(screen.getByText('Tag2')).toBeInTheDocument();
    expect(screen.getByText('Tag3')).toBeInTheDocument();

    const images = screen.getAllByAltText('European Environment Agency');
    expect(images.length).toBeGreaterThan(0);
  });
});
