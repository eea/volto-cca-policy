import React from 'react';
import { Tab } from 'semantic-ui-react';
import { Callout } from '@eeacms/volto-eea-design-system/ui';
import { HTMLField } from '@eeacms/volto-cca-policy/helpers';
import { formatTextToHTML } from '@eeacms/volto-cca-policy/utils';
import AccordionList from './../AccordionList';
import StatisticsSection from './../StatisticsSection';

const GovernanceTab = ({ result }) => {
  const statisticsData = [
    {
      value: '460km',
      label: 'Duis non quam et nisi tincidunt',
    },
    {
      value: '51-60%',
      label: 'Vestibulum ante ipsum primis',
    },
    {
      value: '2.431.213',
      label: 'Aliquam erat volutpat',
    },
    {
      value: '2023',
      label: 'Etiam accumsan urna a mauris',
    },
  ];

  return (
    <Tab.Pane>
      <h2>Governance</h2>
      <Callout>
        <p>
          Sed at risus vel nulla consequat fermentum. Donec et orci mauris.
          Nullam tempor velit id mi luctus, a scelerisque libero accumsan. In
          hac habitasse platea dictumst. Cras ac nunc nec massa tristique
          fringilla.
        </p>
      </Callout>

      <StatisticsSection statistics={statisticsData} />

      <h3>Climate related issues</h3>
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

      <h3>Opportunities and benefits of climate action</h3>

      <HTMLField value={{ data: formatTextToHTML(result?.Describe) }} />

      <AccordionList
        accordions={[
          {
            title: ' Further details and evidence',
            content: (
              <HTMLField value={{ data: formatTextToHTML(result?.Provide) }} />
            ),
          },
        ]}
      />

      <h3>
        {result?.Signatory} engages with other levels of government regarding
        their:
      </h3>

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
    </Tab.Pane>
  );
};

export default GovernanceTab;
