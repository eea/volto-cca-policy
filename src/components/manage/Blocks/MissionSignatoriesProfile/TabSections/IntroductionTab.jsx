import React from 'react';
import { Tab } from 'semantic-ui-react';
import { Callout } from '@eeacms/volto-eea-design-system/ui';

const IntroductionTab = () => {
  return (
    <Tab.Pane>
      <h2>Introduction</h2>
      <Callout>
        <p>
          Duis non quam et nisi tincidunt fermentum. Pellentesque habitant morbi
          tristique senectus et netus et malesuada fames ac turpis egestas.
        </p>
      </Callout>
      <h3>The Mission on Adaptation</h3>
      <p>
        Nulla facilisi. Donec fringilla urna id ligula ullamcorper, vel
        tristique lorem posuere. Donec et orci mauris. Nullam tempor velit id mi
        luctus, a scelerisque libero accumsan. In hac habitasse platea dictumst.
        Cras ac nunc nec massa tristique fringilla.
      </p>
      <h3>Data source</h3>
      <p>
        Donec eget libero id leo congue venenatis. Ut enim ad minim veniam, quis
        nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit
        esse cillum dolore eu fugiat nulla pariatur.
      </p>
      <p>
        Donec eget libero id leo congue venenatis. Ut enim ad minim veniam, quis
        nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit
        esse cillum dolore eu fugiat nulla pariatur.
      </p>
    </Tab.Pane>
  );
};

export default IntroductionTab;
