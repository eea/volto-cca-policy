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
      <p>
        Nulla facilisi. Donec fringilla urna id ligula ullamcorper, vel
        tristique lorem posuere. Donec et orci mauris. Nullam tempor velit id mi
        luctus, a scelerisque libero accumsan. In hac habitasse platea dictumst.
        Cras ac nunc nec massa tristique fringilla.
      </p>
    </Tab.Pane>
  );
};

export default IntroductionTab;
