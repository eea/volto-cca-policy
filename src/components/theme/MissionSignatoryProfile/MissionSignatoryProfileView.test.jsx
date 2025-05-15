import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MissionSignatoryProfileView from './MissionSignatoryProfileView';

jest.mock('./TabSections/GovernanceTab', () => () => (
  <div>Mocked Governance</div>
));
jest.mock('./TabSections/AssessmentTab', () => () => (
  <div>Mocked Assessment</div>
));
jest.mock('./TabSections/PlanningTab', () => () => <div>Mocked Planning</div>);
jest.mock('./TabSections/ActionPagesTab', () => () => <div>Mocked Action</div>);

jest.mock('@eeacms/volto-cca-policy/helpers', () => ({
  BannerTitle: ({ children }) => <div>{children}</div>,
  HTMLField: ({ value }) => (
    <div dangerouslySetInnerHTML={{ __html: value?.data }} />
  ),
}));

describe('MissionSignatoryProfileView', () => {
  const content = {
    '@components': {
      missionsignatoryprofile: {
        result: {
          governance: [{}],
          assessment: {},
          planning: {},
          action: {},
          footer_text: {
            Disclaimer_Title: 'Disclaimer Title',
            Disclaimer: 'This is a disclaimer.',
          },
          tab_labels: [
            { key: 'Governance_Label', value: 'Governance' },
            { key: 'Assessment_Label', value: 'Assessment' },
            { key: 'Planning_Label', value: 'Planning & Target' },
            { key: 'Action_Label', value: 'Action' },
            { key: 'Language', value: 'en' },
          ],
        },
      },
    },
  };

  it('renders tab labels and default content', () => {
    render(<MissionSignatoryProfileView content={content} />);

    // Tab labels
    expect(screen.getByText('Governance')).toBeInTheDocument();
    expect(screen.getByText('Assessment')).toBeInTheDocument();
    expect(screen.getByText('Planning & Target')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('switches tabs and renders corresponding content', () => {
    render(<MissionSignatoryProfileView content={content} />);

    fireEvent.click(screen.getByText('Governance'));
    expect(screen.getByText('Mocked Governance')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Assessment'));
    expect(screen.getByText('Mocked Assessment')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Planning & Target'));
    expect(screen.getByText('Mocked Planning')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Action'));
    expect(screen.getByText('Mocked Action')).toBeInTheDocument();
  });

  it('renders footer disclaimer text if present', () => {
    render(<MissionSignatoryProfileView content={content} />);
    expect(screen.getByText('Disclaimer Title')).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes('This is a disclaimer.')),
    ).toBeInTheDocument();
  });
});
