import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import AssessmentTab from './AssessmentTab';

jest.mock('@eeacms/volto-eea-design-system/ui', () => ({
  Callout: ({ children }) => <div>{children}</div>,
}));

jest.mock('@eeacms/volto-cca-policy/helpers', () => ({
  HTMLField: ({ value }) => <div>{value.data}</div>,
}));

jest.mock('../NoDataReported', () => ({ label }) => (
  <div data-testid="no-data">{label}</div>
));

jest.mock('@eeacms/volto-cca-policy/utils', () => ({
  isEmpty: (arr) => !arr || arr.length === 0,
  formatTextToHTML: (text) => text,
  normalizeImageFileName: (filename) => filename || '',
}));

const mockData = {
  assessment_text: [
    {
      Title: 'Assessment Title',
      Subheading: 'Assessment Subheading',
      Abstract: 'Assessment abstract content.',
      Cra_Title: 'CRA Title',
      Cra_Abstract: 'CRA Abstract here.',
      Attachments: 'Attachment Heading',
      Hazards_Title: 'Hazards',
      Hazards_Abstract: 'Hazards abstract text.',
    },
  ],
  assessment_factors: [{ Factor: 'Factor A' }, { Factor: 'Factor B' }],
  assessment_risks: [
    {
      Assessment_Id: '1',
      Attachment_Title: 'Risk Attachment Title',
      Year_Of_Publication: '2023',
      Hyperlink: 'https://example.com',
      Explore_Link_Text: 'Explore this risk',
      Year_Of_Publication_Label: 'Published Year',
      Further_Details_Label: 'Details',
      Please_Explain: 'Explanation content here.',
    },
  ],
  assessment_hazards_sectors: [
    {
      Category: 'Water Management',
      Hazards: [
        { Hazard: 'Flooding', Sectors: ['Agriculture', 'Health'] },
        { Hazard: 'Drought', Sectors: ['Energy'] },
      ],
    },
    {
      Category: null,
      Hazards: [
        { Hazard: 'Storms', Sectors: ['Transport', 'Tourism'] },
        { Hazard: 'Heatwaves', Sectors: ['Health'] },
      ],
    },
  ],
};

describe('AssessmentTab', () => {
  it('renders all major sections correctly', () => {
    render(<AssessmentTab result={mockData} />);

    expect(screen.getByText('Assessment Title')).toBeInTheDocument();
    expect(screen.getByText('Assessment Subheading')).toBeInTheDocument();
    expect(
      screen.getByText('Assessment abstract content.'),
    ).toBeInTheDocument();
    expect(screen.getByText('CRA Title')).toBeInTheDocument();
    expect(screen.getByText('CRA Abstract here.')).toBeInTheDocument();
    expect(screen.getByText('Attachment Heading')).toBeInTheDocument();
    expect(screen.getByText('Hazards')).toBeInTheDocument();
    expect(screen.getByText('Hazards abstract text.')).toBeInTheDocument();

    expect(screen.getByText('Factor A')).toBeInTheDocument();
    expect(screen.getByText('Factor B')).toBeInTheDocument();
  });

  it('renders assessment risks accordion with link and details', () => {
    render(<AssessmentTab result={mockData} />);

    expect(
      screen.getByText('1. Risk Attachment Title - 2023'),
    ).toBeInTheDocument();

    expect(screen.getByText('Explore this risk')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getByText('Explanation content here.')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: 'Explore this risk' });
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('renders beta-style hazards (Category > Hazard > Sector)', () => {
    render(<AssessmentTab result={mockData} />);

    expect(screen.getByText('Water Management')).toBeInTheDocument();
    expect(screen.getByText('Flooding')).toBeInTheDocument();
    expect(screen.getByText('Drought')).toBeInTheDocument();

    expect(screen.getByText('Agriculture')).toBeInTheDocument();
    expect(screen.getAllByText('Health').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Energy')).toBeInTheDocument();
  });

  it('renders production-style hazards (Hazard > Sectors)', () => {
    render(<AssessmentTab result={mockData} />);

    expect(screen.getByText('Storms')).toBeInTheDocument();
    expect(screen.getByText('Heatwaves')).toBeInTheDocument();
    expect(screen.getByText('Transport')).toBeInTheDocument();
    expect(screen.getByText('Tourism')).toBeInTheDocument();
    expect(screen.getAllByText('Health').length).toBeGreaterThanOrEqual(1);
  });

  it('renders NoDataReported when no data available', () => {
    render(
      <AssessmentTab
        result={{}}
        general_text={{ No_Data_Reported_Label: 'No info' }}
      />,
    );
    expect(screen.getByTestId('no-data')).toHaveTextContent('No info');
  });
});
