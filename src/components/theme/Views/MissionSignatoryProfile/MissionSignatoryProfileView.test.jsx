import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import '@testing-library/jest-dom';
import MissionSignatoryProfileView from './MissionSignatoryProfileView';

jest.mock('./TabSections/GovernanceTab', () => () => (
  <div>Mocked Governance</div>
));
jest.mock('./TabSections/AssessmentTab', () => () => (
  <div>Mocked Assessment</div>
));
jest.mock('./TabSections/PlanningTab', () => () => <div>Mocked Planning</div>);
jest.mock('./TabSections/ActionTab', () => () => <div>Mocked Action</div>);

jest.mock('@eeacms/volto-cca-policy/components', () => ({
  ContentBannerTitle: ({ data }) => (
    <div>
      {data?.info?.map(({ description }, index) => (
        <span key={index}>{description}</span>
      ))}
    </div>
  ),
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
          general_text: [
            {
              Back_To_Map_Link: 'Back to map',
              Country_Or_Area: 'Testland',
              Reporting_Year: 2023,
            },
          ],
        },
      },
    },
    parent: {
      '@id': '/signatories-map',
    },
  };

  const renderWithRouter = (ui) =>
    render(
      <IntlProvider locale="en">
        <MemoryRouter>{ui}</MemoryRouter>
      </IntlProvider>,
    );

  it('renders tab labels and default content', () => {
    renderWithRouter(<MissionSignatoryProfileView content={content} />);

    expect(screen.getByText('Governance')).toBeInTheDocument();
    expect(screen.getByText('Assessment')).toBeInTheDocument();
    expect(screen.getByText('Planning & Target')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('renders the reporting year in the banner metadata', () => {
    renderWithRouter(<MissionSignatoryProfileView content={content} />);

    expect(screen.getByText('Reporting year: 2023')).toBeInTheDocument();
  });

  it('falls back to the 2024 reporting year when it is unavailable', () => {
    const contentWithoutReportingYear = {
      ...content,
      '@components': {
        ...content['@components'],
        missionsignatoryprofile: {
          ...content['@components'].missionsignatoryprofile,
          result: {
            ...content['@components'].missionsignatoryprofile.result,
            general_text: [
              {
                Back_To_Map_Link: 'Back to map',
                Country_Or_Area: 'Testland',
              },
            ],
          },
        },
      },
    };

    renderWithRouter(
      <MissionSignatoryProfileView content={contentWithoutReportingYear} />,
    );

    expect(screen.getByText('Reporting year: 2024')).toBeInTheDocument();
  });

  it('switches tabs and renders corresponding content', () => {
    renderWithRouter(<MissionSignatoryProfileView content={content} />);

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
    renderWithRouter(<MissionSignatoryProfileView content={content} />);
    expect(screen.getByText('Disclaimer Title')).toBeInTheDocument();
    expect(
      screen.getByText((text) => text.includes('This is a disclaimer.')),
    ).toBeInTheDocument();
  });
});
