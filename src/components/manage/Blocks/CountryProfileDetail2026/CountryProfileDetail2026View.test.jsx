import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CountryProfileDetail2026View from './CountryProfileDetail2026View';

jest.mock('semantic-ui-react', () => ({
  TabPane: ({ children }) => <div>{children}</div>,
  Tab: ({ panes, activeIndex, onTabChange }) => (
    <div>
      {panes.map((pane, index) => (
        <button
          key={index}
          onClick={(event) => {
            if (typeof pane.menuItem === 'object') {
              pane.menuItem.onClick?.(event);
            } else {
              onTabChange?.(null, { panes, activeIndex: index });
            }
          }}
        >
          {typeof pane.menuItem === 'string'
            ? pane.menuItem
            : pane.menuItem.content}
        </button>
      ))}
      {panes[activeIndex]?.render?.()}
    </div>
  ),
}));

jest.mock('./MenuProfile', () => () => <div>Summary component</div>);
jest.mock('./MenuNationalCircumstances', () => () => (
  <div>National component</div>
));
jest.mock('./MenuAssesment', () => () => <div>Assessment component</div>);
jest.mock('./MenuLegalPolicy', () => () => <div>Legal component</div>);
jest.mock('./MenuStrategiesPlansGoals', () => () => (
  <div>Strategies component</div>
));
jest.mock('./MenuMonitorEvaluation', () => () => (
  <div>Monitoring component</div>
));
jest.mock('./MenuGoodPractices', () => () => <div>Practices component</div>);
jest.mock('./MenuSubNational', () => () => <div>Subnational component</div>);

describe('CountryProfileDetail2026View', () => {
  it('creates static tabs and expands the selected tab submenu', () => {
    render(
      <CountryProfileDetail2026View
        properties={{
          title: 'France',
          '@components': { countryprofile2026: { json: { profile: true } } },
        }}
      />,
    );

    expect(screen.getByText('Summary component')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Monitoring and evaluation'));
    expect(screen.getByText('Monitoring component')).toBeInTheDocument();
    expect(screen.getByText('Steps to review')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Steps to review'));
    expect(window.location.hash).toBe('#steps_review');
  });

  it('renders dynamic menus and handles submenu scroll/hash fallback', () => {
    render(
      <CountryProfileDetail2026View
        properties={{
          '@components': {
            countryprofile2026: {
              menu: ['Custom tab'],
              content: [[{ value: '<p>Dynamic tab content</p>' }]],
            },
          },
        }}
      />,
    );

    expect(screen.getByText('Custom tab')).toBeInTheDocument();
    expect(screen.getByText('Dynamic tab content')).toBeInTheDocument();
  });
});
