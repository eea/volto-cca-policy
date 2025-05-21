import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import EventAccordionListingView from './EventAccordionListingView';

const mockStore = configureStore();

jest.mock('@plone/volto/components', () => ({
  ConditionalLink: ({ children }) => <div>{children}</div>,
}));

jest.mock('@plone/volto/components/theme/View/EventDatesInfo', () => ({
  When: () => <div>Event Date Info</div>,
}));

describe('EventAccordionListingView', () => {
  let store;
  const items = [
    {
      UID: 'event-123',
      title: 'Test Event One',
      description: 'Details about Event One',
      start: '2025-05-20T10:00:00',
      end: '2025-05-20T12:00:00',
      location: 'Hall A',
      whole_day: false,
      open_end: false,
      '@id': '/event-1',
    },
    {
      UID: 'event-456',
      title: 'Test Event Two',
      description: 'Details about Event Two',
      start: '2025-06-10T09:00:00',
      end: '2025-06-10T11:00:00',
      location: 'Room B',
      whole_day: false,
      open_end: false,
      '@id': '/event-2',
    },
  ];

  beforeEach(() => {
    store = mockStore({
      intl: {
        locale: 'en',
        messages: {},
      },
    });
  });

  it('renders all event titles', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <EventAccordionListingView items={items} isEditMode={false} />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Test Event One')).toBeInTheDocument();
    expect(screen.getByText('Test Event Two')).toBeInTheDocument();
  });

  it('toggles accordion content on title click', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <EventAccordionListingView items={items} isEditMode={false} />
        </MemoryRouter>
      </Provider>,
    );

    const title = screen.getByText('Test Event One');
    expect(title.closest('.title')).toHaveClass('title');
    expect(title.closest('.title')).not.toHaveClass('active');

    fireEvent.click(title);

    expect(title.closest('.title')).toHaveClass('active');

    expect(screen.getByText('Details about Event One')).toBeInTheDocument();

    fireEvent.click(title);
    expect(title.closest('.title')).not.toHaveClass('active');
  });

  it('renders Learn more buttons', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <EventAccordionListingView items={items} isEditMode={false} />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getAllByText('Learn more')).toHaveLength(2);
  });
});
