import React from 'react';
import {
  Tab,
  Image,
  Segment,
  Item,
  ItemGroup,
  ItemContent,
} from 'semantic-ui-react';
import { Callout } from '@eeacms/volto-eea-design-system/ui';
import AccordionList from './../AccordionList';

import image from '@eeacms/volto-cca-policy/../theme//assets/images/image-narrow.svg';

const ItemsSection = ({ items }) => {
  if (!items?.length) return null;

  return (
    <ItemGroup className="items-group">
      {items.map((item, index) => (
        <Item key={index}>
          <Image size="small" src={image} />
          <ItemContent verticalAlign="middle">{item.Factor}</ItemContent>
        </Item>
      ))}
    </ItemGroup>
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
        <p>{result.Please_Explain}</p>
      </Segment>
    </>
  );
};

const AssessmentTab = ({ result }) => {
  const {
    Title,
    Subheading,
    Abstract,
    Cra_Title,
    Cra_Abstract,
    Attachments,
    Hazards_Title,
    Hazards_Abstract,
  } = result.assessment_text?.[0] || [];
  const assessment_risks = result.assessment_risks || [];

  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <Tab.Pane>
      {Title && <h2>{Title}</h2>}
      {Subheading && <Callout>{Subheading}</Callout>}

      {Abstract && <p>{Abstract}</p>}

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

      {Hazards_Abstract && <p>{Hazards_Abstract}</p>}

      <br />

      <Tab
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
      />
    </Tab.Pane>
  );
};

export default AssessmentTab;
