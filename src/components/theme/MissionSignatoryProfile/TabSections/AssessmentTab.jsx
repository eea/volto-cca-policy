import { Tab, Image, Segment, Item } from 'semantic-ui-react';
import { Callout } from '@eeacms/volto-eea-design-system/ui';
import { HTMLField } from '@eeacms/volto-cca-policy/helpers';
import { formatTextToHTML } from '@eeacms/volto-cca-policy/utils';
import AccordionList from '../AccordionList';

import image from '@eeacms/volto-cca-policy/../theme//assets/images/image-narrow.svg';

const isEmpty = (arr) => !Array.isArray(arr) || arr.length === 0;

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

  // const [activeIndex, setActiveIndex] = React.useState(0);

  if (NoResults) {
    return (
      <Tab.Pane>
        <h5>{No_Data_Reported_Label}</h5>
      </Tab.Pane>
    );
  }

  return (
    <Tab.Pane>
      {Title && <h2>{Title}</h2>}
      {Subheading && (
        <Callout>
          <HTMLField value={{ data: formatTextToHTML(Subheading) }} />
        </Callout>
      )}

      {Abstract && <HTMLField value={{ data: formatTextToHTML(Abstract) }} />}

      <div className="tab-section-wrapper assessment">
        {Cra_Title && <h3>{Cra_Title}</h3>}
        {Cra_Abstract && <h5>{Cra_Abstract}</h5>}

        <ItemsSection items={result.assessment_factors} />

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

      {/* <Tab
        menu={{
          fluid: true,
          className: 'secondary',
          vertical: true,
          pointing: true,
        }}
        grid={{ paneWidth: 9, tabWidth: 3, stackable: true }}
        activeIndex={activeIndex}
        onTabChange={(e, { activeIndex }) => setActiveIndex(activeIndex)}
        panes={[
          {
            menuItem: 'Water related',
            render: () => (
              <AccordionList
                accordions={[
                  {
                    title: 'Vestibulum ante ipsum primis',
                    content: 'No additional details provided.',
                  },
                  {
                    title: 'Etiam accumsan urna a mauris',
                    content: 'No additional details provided.',
                  },
                ]}
              />
            ),
          },
          {
            menuItem: 'Heat related',
            render: () => (
              <div>
                Nam tempor finibus lorem, nec varius arcu convallis sed. Nunc id
                orci a neque vehicula malesuada. Donec vehicula libero vel leo
                convallis, nec tincidunt felis tincidunt. Maecenas euismod
                tristique leo, vel malesuada ligula malesuada sed.
              </div>
            ),
          },
          {
            menuItem: 'Other hazards',
            render: () => (
              <div>
                Nam tempor finibus lorem, nec varius arcu convallis sed. Nunc id
                orci a neque vehicula malesuada. Donec vehicula libero vel leo
                convallis, nec tincidunt felis tincidunt. Maecenas euismod
                tristique leo, vel malesuada ligula malesuada sed.
              </div>
            ),
          },
        ]}
      /> */}
    </Tab.Pane>
  );
};

export default AssessmentTab;
