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

import image from '@eeacms/volto-cca-policy/../theme//assets/images/image-narrow.svg';

const AssessmentTab = () => {
  return (
    <Tab.Pane>
      <h2>Assessment</h2>
      <Callout>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </Callout>

      <div className="profile-content-box">
        <h3>Nam tempor finibus lorem</h3>
        <div className="profile-content-box-info">
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

        <h4>Nam tempor finibus lorem, nec varius arcu convallis sed</h4>

        <div className="items-wrapper">
          <Grid className="column-grid">
            <GridColumn width={6} className="column-blocks-wrapper">
              <ItemGroup unstackable className="row">
                <Item>
                  <Image size="small" src={image} />
                  <ItemContent verticalAlign="middle">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                  </ItemContent>
                </Item>

                <Item>
                  <Image size="small" src={image} />
                  <ItemContent verticalAlign="middle">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                  </ItemContent>
                </Item>

                <Item>
                  <Image size="small" src={image} />
                  <ItemContent verticalAlign="middle">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                  </ItemContent>
                </Item>
              </ItemGroup>
            </GridColumn>

            <GridColumn width={6}>
              <ItemGroup unstackable className="row">
                <Item>
                  <Image size="small" src={image} />
                  <ItemContent verticalAlign="middle">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                  </ItemContent>
                </Item>

                <Item>
                  <Image size="small" src={image} />
                  <ItemContent verticalAlign="middle">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                  </ItemContent>
                </Item>

                <Item>
                  <Image size="small" src={image} />
                  <ItemContent verticalAlign="middle">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                  </ItemContent>
                </Item>
              </ItemGroup>
            </GridColumn>
          </Grid>
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

      <p>
        Nam tempor finibus lorem, nec varius arcu convallis sed. Nunc id orci a
        neque vehicula malesuada. Donec vehicula libero vel leo convallis, nec
        tincidunt felis tincidunt. Maecenas euismod tristique leo, vel malesuada
        ligula malesuada sed. Donec eget libero id leo congue venenatis. Ut enim
        ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
        in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
        officia deserunt mollit anim id est laborum.
      </p>
    </Tab.Pane>
  );
};

export default AssessmentTab;
