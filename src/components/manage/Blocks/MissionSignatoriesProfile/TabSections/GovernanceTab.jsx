import React from 'react';
import { Tab } from 'semantic-ui-react';
import { Callout } from '@eeacms/volto-eea-design-system/ui';
import { HTMLField } from '@eeacms/volto-cca-policy/helpers';
import { formatTextToHTML } from '@eeacms/volto-cca-policy/utils';
import AccordionList from './../AccordionList';

const GovernanceTab = ({ result }) => {
  const {
    Title,
    Introduction,
    Describe_Title,
    Describe,
    Provide_Title,
    Provide,
  } = result;

  return (
    <Tab.Pane>
      {Title && <h2>{Title}</h2>}

      {Introduction && (
        <Callout>
          <p>{Introduction}</p>
        </Callout>
      )}

      {Describe_Title && <h3>{Describe_Title}</h3>}

      {Describe && <HTMLField value={{ data: formatTextToHTML(Describe) }} />}

      <br />

      {Provide_Title && (
        <AccordionList
          accordions={[
            {
              title: <>{Provide_Title}</>,
              content: (
                <HTMLField value={{ data: formatTextToHTML(Provide) }} />
              ),
            },
          ]}
        />
      )}
    </Tab.Pane>
  );
};

export default GovernanceTab;
