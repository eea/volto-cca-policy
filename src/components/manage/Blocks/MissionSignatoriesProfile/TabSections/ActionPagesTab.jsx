import React from 'react';
import { Tab } from 'semantic-ui-react';
import { Callout } from '@eeacms/volto-eea-design-system/ui';

const ActionPagesTab = () => {
  return (
    <Tab.Pane>
      <h2>Action Pages</h2>
      <Callout>
        <p>
          Donec et urna vel risus feugiat pharetra. Proin id lacus vitae velit
          accumsan venenatis. Aenean non mi vel nisi lacinia maximus.
        </p>
      </Callout>
      <p>
        Duis efficitur, sapien quis bibendum auctor, lectus risus feugiat
        sapien, ac pulvinar orci est a arcu. Integer id augue vitae urna
        tristique tempus. Etiam id velit feugiat, scelerisque velit a,
        scelerisque nunc. Vestibulum ante ipsum primis in faucibus orci luctus
        et ultrices posuere cubilia curae; Integer dignissim risus non nibh
        scelerisque, sit amet tincidunt sapien rutrum.
      </p>
    </Tab.Pane>
  );
};

export default ActionPagesTab;
