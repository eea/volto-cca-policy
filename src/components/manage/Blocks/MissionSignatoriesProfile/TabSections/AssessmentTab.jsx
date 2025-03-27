import React from 'react';
import {
  Tab,
  Image,
  Button,
  Segment,
  Grid,
  GridColumn,
  Item,
  ItemGroup,
  ItemContent,
} from 'semantic-ui-react';
import { Callout } from '@eeacms/volto-eea-design-system/ui';
import AccordionList from './../AccordionList';
import ItemsSection from './../ItemsSection';

import image from '@eeacms/volto-cca-policy/../theme//assets/images/image-narrow.svg';

const AssessmentTab = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  return (
    <Tab.Pane>
      <h2>Assessment</h2>
      <Callout>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </Callout>

      <div className="section-wrapper">
        <h3>Climate Risk Assessment</h3>
        <div className="section-wrapper-info">
          <ItemGroup unstackable className="row">
            <Item>
              <Image size="miny" src={image} />
              <ItemContent
                verticalAlign="middle"
                style={{ paddingLeft: '5px' }}
              >
                Lorem ipsum dolor sit amet
              </ItemContent>
            </Item>
          </ItemGroup>

          <div className="date">
            <p>Year of publication: 2022</p>
          </div>
        </div>

        <h4>The CRA conducted considers the following factors</h4>

        <div className="items-wrapper">
          <ItemsSection />
        </div>

        <h4>Further details</h4>
        <Segment>
          Nam tempor finibus lorem, nec varius arcu convallis sed. Nunc id orci
          a neque vehicula malesuada. Donec vehicula libero vel leo convallis,
          nec tincidunt felis tincidunt. Maecenas euismod tristique leo, vel
          malesuada ligula malesuada sed. Donec eget libero id leo congue
          venenatis.
        </Segment>
        <Button primary inverted>
          Download
        </Button>
      </div>

      <h3>Climate related hazards & sectors most exposed</h3>
      <p>
        Donec eget libero id leo congue venenatis. Ut enim ad minim veniam, quis
        nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit
        esse cillum dolore eu fugiat nulla pariatur.
      </p>

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
