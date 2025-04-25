import React from 'react';
import { render, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionPagesTab from './ActionPagesTab';

// Mocking components used inside
jest.mock('@eeacms/volto-eea-design-system/ui', () => ({
  Callout: ({ children }) => <div>{children}</div>,
}));

jest.mock('./../AccordionList', () => ({ variation, accordions }) => (
  <div>
    {accordions.map((item, index) => (
      <div key={index}>
        <div>{item.title}</div>
        <div>{item.content}</div>
      </div>
    ))}
  </div>
));

describe('ActionPagesTab', () => {
  const mockResult = {
    action_text: [
      {
        Title: 'Adaptation Actions',
        Abstract: 'This is an overview of adaptation actions.',
        Abstract_Line: 'Summary line here.',
      },
    ],
    actions: [
      {
        Action_Id: 'A-002',
        Order: 2,
        Action: 'Second action',
        More_Details_Label: 'Details 2',
        Climate_Hazards: ['Flood', 'Heatwave'],
        Hazards_Addressed_Label: 'Hazards addressed',
        Sectors: ['Health', 'Infrastructure'],
        Sectors_Label: 'Affected sectors',
        Co_Benefits: ['Biodiversity', 'Air quality'],
        Co_Benefits_Label: 'Co-benefits',
        Funding_Sources: 'EU Funds',
        Funding_Sources_Label: 'Funding source:',
      },
      {
        Action_Id: 'A-001',
        Order: 1,
        Action: 'First action',
        More_Details_Label: 'Details 1',
        Climate_Hazards: ['Drought'],
        Hazards_Addressed_Label: 'Hazards addressed',
        Sectors: ['Agriculture'],
        Sectors_Label: 'Affected sectors',
        Co_Benefits: ['Water retention'],
        Co_Benefits_Label: 'Co-benefits',
        Funding_Sources: 'National Funds',
        Funding_Sources_Label: 'Funding source:',
      },
    ],
  };

  it('renders action tab content correctly', () => {
    const { getByText, getAllByText } = render(
      <ActionPagesTab result={mockResult} />,
    );

    expect(getByText('Adaptation Actions')).toBeInTheDocument();
    expect(
      getByText('This is an overview of adaptation actions.'),
    ).toBeInTheDocument();
    expect(getByText('Summary line here.')).toBeInTheDocument();

    const sections = getAllByText(/^\d+\./).map((el) =>
      el.closest('.section-wrapper'),
    );

    // First action
    const firstAction = within(sections[0]);
    expect(firstAction.getByText('First action')).toBeInTheDocument();
    expect(firstAction.getByText('Hazards addressed')).toBeInTheDocument();
    expect(firstAction.getByText('Drought')).toBeInTheDocument();
    expect(firstAction.getByText('Funding source:')).toBeInTheDocument();
    expect(firstAction.getByText('National Funds')).toBeInTheDocument();

    // Second action
    const secondAction = within(sections[1]);
    expect(secondAction.getByText('Second action')).toBeInTheDocument();
    expect(secondAction.getByText('Hazards addressed')).toBeInTheDocument();
    expect(secondAction.getByText('Flood')).toBeInTheDocument();
    expect(secondAction.getByText('EU Funds')).toBeInTheDocument();
  });
});
