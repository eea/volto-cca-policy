import React from 'react';
import { Tab } from 'semantic-ui-react';
import { Callout } from '@eeacms/volto-eea-design-system/ui';

const PlanningTab = () => {
  return (
    <Tab.Pane>
      <h2>Planning</h2>
      <Callout>
        <p>
          Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
          posuere cubilia curae; Pellentesque sodales, velit nec euismod
          scelerisque, lectus est interdum eros, sit amet bibendum eros sapien
          in magna.
        </p>
      </Callout>
      <p>
        Curabitur at felis non libero suscipit fermentum. Duis volutpat, ante et
        scelerisque luctus, sem nulla placerat leo, at aliquet libero justo id
        nulla. Integer at dui nec magna posuere fringilla. Nunc euismod bibendum
        augue. Cras nec ligula velit. Donec in laoreet leo. Quisque suscipit
        ligula eu turpis dignissim, a eleifend ipsum cursus.
      </p>
    </Tab.Pane>
  );
};

export default PlanningTab;
