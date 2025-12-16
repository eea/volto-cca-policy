import { Tab, Segment } from 'semantic-ui-react';
import { Callout } from '@eeacms/volto-eea-design-system/ui';
import { HTMLField } from '@eeacms/volto-cca-policy/helpers';
import { isEmpty, formatTextToHTML } from '@eeacms/volto-cca-policy/utils';
import AccordionList from '../AccordionList';
import NoDataReported from '../NoDataReported';
import ItemsSection from '../ItemsSection';

const AssessmentAccordionContent = ({ result }) => {
  return (
    <>
      <p>
        <a href={result.Hyperlink} target="_blank" rel="noreferrer">
          <strong>{result.Explore_Link_Text}</strong>
        </a>
      </p>
      <p>
        <span>
          {result.Year_Of_Publication_Label}
          {': '}
        </span>
        <strong>{result.Year_Of_Publication}</strong>
      </p>

      <h5>{result.Further_Details_Label}</h5>
      <Segment className="border">
        <HTMLField value={{ data: formatTextToHTML(result.Please_Explain) }} />
      </Segment>
    </>
  );
};

const AssessmentTab = ({ result, general_text }) => {
  const {
    Title,
    Subheading,
    Abstract,
    Cra_Title,
    Cra_Abstract,
    Attachments,
    Hazards_Title,
    Hazards_Abstract,
  } = result.assessment_text?.[0] || {};

  const assessment_risks = result?.assessment_risks || [];
  const assessment_hazards_sectors = result?.assessment_hazards_sectors || [];
  const { No_Data_Reported_Label } = general_text || {};

  const NoResults =
    isEmpty(result.assessment_text) &&
    isEmpty(result.assessment_factors) &&
    isEmpty(result.assessment_risks) &&
    isEmpty(result.assessment_hazards_sectors);

  if (NoResults) {
    return <NoDataReported label={No_Data_Reported_Label} />;
  }

  return (
    <Tab.Pane className="assessment-tab">
      {Title && <h2>{Title}</h2>}

      {Subheading && (
        <Callout>
          <HTMLField value={{ data: formatTextToHTML(Subheading) }} />
        </Callout>
      )}

      {Abstract && <HTMLField value={{ data: formatTextToHTML(Abstract) }} />}

      <div className="tab-section-wrapper assessment">
        {Cra_Title && <h3>{Cra_Title}</h3>}

        {result.assessment_factors?.length > 0 && (
          <>
            {Cra_Abstract && <h5>{Cra_Abstract}</h5>}
            <ItemsSection
              items={result.assessment_factors}
              field="Factor"
              iconPath="factors"
            />
          </>
        )}

        {assessment_risks.length > 0 && (
          <>
            {Attachments && <h4>{Attachments}</h4>}

            <AccordionList
              variation="tertiary"
              multiple={false}
              accordions={assessment_risks.map((risk, index) => ({
                title: risk?.Attachment_Title
                  ? `${index + 1}. ${risk.Attachment_Title} - ${
                      risk.Year_Of_Publication || ''
                    }`
                  : `Risk ${index + 1}`,
                content: <AssessmentAccordionContent result={risk} />,
              }))}
            />
          </>
        )}
      </div>

      {Hazards_Title && <h3>{Hazards_Title}</h3>}

      {Hazards_Abstract && (
        <HTMLField value={{ data: formatTextToHTML(Hazards_Abstract) }} />
      )}

      <br />

      {assessment_hazards_sectors?.length > 0 && (
        <AccordionList
          accordions={assessment_hazards_sectors.flatMap((item) => {
            if (item.Category && Array.isArray(item.Hazards)) {
              return [
                {
                  title: item.Category,
                  content: (
                    <ul>
                      {item.Hazards.map((hazard, index) => (
                        <li key={index}>
                          <strong>{hazard.Hazard}</strong>
                          {Array.isArray(hazard.Sectors) &&
                            hazard.Sectors.length > 0 && (
                              <ul>
                                {hazard.Sectors.map((sector, sIndex) => (
                                  <li key={sIndex}>{sector}</li>
                                ))}
                              </ul>
                            )}
                        </li>
                      ))}
                    </ul>
                  ),
                },
              ];
            }

            return [];
          })}
        />
      )}
    </Tab.Pane>
  );
};

export default AssessmentTab;
