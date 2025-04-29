import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlanningTab from './PlanningTab';

jest.mock('@eeacms/volto-cca-policy/helpers', () => ({
  HTMLField: ({ value }) => (
    <div dangerouslySetInnerHTML={{ __html: value.data }} />
  ),
}));

jest.mock('@eeacms/volto-cca-policy/utils', () => ({
  formatTextToHTML: (text) => text,
  extractPlanNameAndURL: (str) => ({
    name: 'Plan Example',
    url: 'https://plan-link.com',
  }),
}));

describe('PlanningTab', () => {
  const mockResult = {
    planning_titles: [
      { Title: 'Planning Title', Abstract_Line: 'Abstract info' },
    ],
    planning_goals: [
      {
        Adaptation_Goal_Id: 'AG-001',
        Title: 'Goal Title 1',
        Title_Label: 'Goal 1 Label',
        More_Details_Label: 'Details',
        Climate_Hazards: ['Heat', 'Flood'],
        Climate_Hazards_Addressed_Label: 'Hazards',
        Comments_Label: 'Comments',
        Comments: 'Some comments',
        Description_Label: 'Description',
        Description: 'Detailed description',
        Climate_Action_Title: 'Action Title',
        Climate_Action_Abstract: 'Action abstract',
      },
      {
        Adaptation_Goal_Id: 'AG-002',
        Title: 'Goal Title 2',
        Title_Label: 'Goal 2 Label',
        More_Details_Label: 'Details',
        Climate_Hazards: ['Drought', 'Storm'],
        Climate_Hazards_Addressed_Label: 'Hazards',
        Comments_Label: 'Comments',
        Comments: 'Other comments',
        Description_Label: 'Description',
        Description: 'Another detailed description',
        Climate_Action_Title: 'Action Title',
        Climate_Action_Abstract: 'Another action abstract',
      },
    ],
    planning_climate_action: [
      {
        Sectors_Introduction: 'Intro to sectors',
        Description: 'Sector description',
        Year_Of_Approval_Label: 'Approval Year:',
        Approval_Year: '2023',
        End_Year_Of_Plan_Label: 'End Year:',
        End_Year: '2030',
        Name_Of_Plan_And_Hyperlink: 'http://example.com; https://plan-link.com',
        Further_Information_Link_Text: 'More Info',
        Attachment: 'http://attachment.com',
        Explore_Plan_Link_Text: 'Explore Plan',
        Sectors: ['Agriculture'],
      },
    ],
  };

  it('renders planning tab with basic data', () => {
    const { getByText } = render(<PlanningTab result={mockResult} />);

    expect(getByText('Planning Title')).toBeInTheDocument();
    expect(getByText('Abstract info')).toBeInTheDocument();

    expect(getByText('Goal Title 1')).toBeInTheDocument();
    expect(getByText('Goal Title 2')).toBeInTheDocument();

    expect(getByText('Action Title')).toBeInTheDocument();
    expect(getByText('Intro to sectors')).toBeInTheDocument();
    expect(getByText('Sector description')).toBeInTheDocument();

    expect(getByText(/Approval Year:/)).toBeInTheDocument();
    expect(getByText(/2023/)).toBeInTheDocument();
    expect(getByText(/End Year:/)).toBeInTheDocument();
    expect(getByText(/2030/)).toBeInTheDocument();
  });

  it('renders ItemsSection if there are sectors', () => {
    const { getByText } = render(<PlanningTab result={mockResult} />);

    expect(getByText(/Agriculture/)).toBeInTheDocument();
  });

  it('renders image in ItemsSection', () => {
    const { container } = render(<PlanningTab result={mockResult} />);
    const images = container.querySelectorAll('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('renders hyperlink with extracted name and URL', () => {
    const { getByText } = render(<PlanningTab result={mockResult} />);

    const link = getByText(/More Info \[Plan Example\]/);
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', 'https://plan-link.com');
  });
});
