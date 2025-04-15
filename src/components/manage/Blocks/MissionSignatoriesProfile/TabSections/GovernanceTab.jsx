import React from 'react';
import { Tab } from 'semantic-ui-react';
import { Callout } from '@eeacms/volto-eea-design-system/ui';
import { HTMLField } from '@eeacms/volto-cca-policy/helpers';
import { formatTextToHTML } from '@eeacms/volto-cca-policy/utils';
import AccordionList from './../AccordionList';

const GovernanceTab = ({ result }) => {
  const { Introduction, Describe_Title, Describe, Provide_Title, Provide } =
    result || {};

  return (
    <Tab.Pane>
      <h2>Governance</h2>
      <Callout>
        <p>{Introduction}</p>
      </Callout>

      <h3>{Describe_Title}</h3>

      <HTMLField value={{ data: formatTextToHTML(Describe) }} />

      <br />

      <AccordionList
        accordions={[
          {
            title: <>{Provide_Title}</>,
            content: <HTMLField value={{ data: formatTextToHTML(Provide) }} />,
          },
        ]}
      />
    </Tab.Pane>
  );
};

export default GovernanceTab;
