import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import AssessmentTab from './AssessmentTab';

jest.mock('@eeacms/volto-eea-design-system/ui', () => ({
  Callout: ({ children }) => <div>{children}</div>,
}));

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
};

describe('AssessmentTab', () => {
  it('renders core sections and nested tabs', () => {
    render(<AssessmentTab result={mockData} />);

    // General headings
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

    // Items section
    expect(screen.getByText('Factor A')).toBeInTheDocument();
    expect(screen.getByText('Factor B')).toBeInTheDocument();
  });
});
