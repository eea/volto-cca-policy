import { Tab } from 'semantic-ui-react';
import { Callout } from '@eeacms/volto-eea-design-system/ui';
import { HTMLField } from '@eeacms/volto-cca-policy/helpers';
import { formatTextToHTML } from '@eeacms/volto-cca-policy/utils';
import AccordionList from '../AccordionList';
import StatisticSection from '../StatisticSection';

const GovernanceTab = ({ result }) => {
  const {
    Title,
    Introduction,
    Describe_Title,
    Describe,
    Provide_Title,
    Provide,
    Statistic_Area,
    Statistic_Area_Label,
    Statistic_Jurisdiction_Range,
    Statistic_Jurisdiction_Range_Label,
    Statistic_Population_Size,
    Statistic_Population_Size_Label,
    Statistic_Population_Year,
    Statistic_Population_Year_Label,
  } = result || {};

  const statisticData = [
    {
      value: Statistic_Area,
      label: Statistic_Area_Label,
    },
    {
      value: Statistic_Jurisdiction_Range,
      label: Statistic_Jurisdiction_Range_Label,
    },
    {
      value: Statistic_Population_Size,
      label: Statistic_Population_Size_Label,
    },
    {
      value: Statistic_Population_Year,
      label: Statistic_Population_Year_Label,
    },
  ].filter((stat) => stat.value && stat.label);

  return (
    <Tab.Pane>
      {Title && <h2>{Title}</h2>}

      {Introduction && <Callout>{Introduction}</Callout>}

      <StatisticSection statistic={statisticData} />

      {Describe_Title && <h3>{Describe_Title}</h3>}

      {Describe && <HTMLField value={{ data: formatTextToHTML(Describe) }} />}

      <br />

      {Provide && (
        <AccordionList
          accordions={[
            {
              title: Provide_Title,
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
