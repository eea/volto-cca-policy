import { Tab, Image, Segment, Item } from 'semantic-ui-react';
import { Callout } from '@eeacms/volto-eea-design-system/ui';
import { HTMLField } from '@eeacms/volto-cca-policy/helpers';
import { formatTextToHTML, isEmpty } from '@eeacms/volto-cca-policy/utils';
import AccordionList from '../AccordionList';
import NoDataReported from '../NoDataReported';

import image from '@eeacms/volto-cca-policy/../theme/assets/images/image-narrow.svg';

const ItemsSection = ({ items }) => {
  if (!items?.length) return null;

  return (
    <Item.Group className="items-group">
      {items.map((item, index) => (
        <Item key={index}>
          <Image size="small" src={image} />
          <Item.Content verticalAlign="middle">{item.Factor}</Item.Content>
        </Item>
      ))}
    </Item.Group>
  );
};

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
  const assessment_risks = result.assessment_risks || [];
  const assessment_hazards_sectors = result.assessment_hazards_sectors || [];
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

        {result.assessment_factors.length > 0 && (
          <>
            {Cra_Abstract && <h5>{Cra_Abstract}</h5>}
            <ItemsSection items={result.assessment_factors} />
          </>
        )}

        {assessment_risks.length > 0 && (
          <>
            {Attachments && <h4>{Attachments}</h4>}
            {assessment_risks.map((risk, index) => {
              const title = risk?.Attachment_Title
                ? `${risk.Assessment_Id}. ${risk.Attachment_Title} - ${
                    risk.Year_Of_Publication || ''
                  }`
                : null;
              return (
                <div key={index}>
                  <AccordionList
                    variation="tertiary"
                    accordions={[
                      {
                        title: title,
                        content: <AssessmentAccordionContent result={risk} />,
                      },
                    ]}
                  />
                </div>
              );
            })}
          </>
        )}
      </div>

      {Hazards_Title && <h3>{Hazards_Title}</h3>}

      {Hazards_Abstract && (
        <HTMLField value={{ data: formatTextToHTML(Hazards_Abstract) }} />
      )}

      <br />

      {assessment_hazards_sectors && (
        <AccordionList
          accordions={assessment_hazards_sectors.map((category) => ({
            title: category.Hazard,
            content: (
              <ul>
                {category.Sectors.map((sector, idx) => (
                  <li key={idx}>{sector}</li>
                ))}
              </ul>
            ),
          }))}
        />
      )}
    </Tab.Pane>
  );
};

export default AssessmentTab;
