import React from 'react';
import { Tab } from 'semantic-ui-react';
import { Callout } from '@eeacms/volto-eea-design-system/ui';

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
