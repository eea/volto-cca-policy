import { Tab } from 'semantic-ui-react';
import { Callout } from '@eeacms/volto-eea-design-system/ui';
import { HTMLField } from '@eeacms/volto-cca-policy/helpers';
import { formatTextToHTML } from '@eeacms/volto-cca-policy/utils';
import { AccordionList } from '@eeacms/volto-cca-policy/components';
import StatisticSection from '../StatisticSection';

const GovernanceTab = ({ result, general_text }) => {
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
  const { No_Data_Reported_Label } = general_text || {};

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

  if (!result) {
    return (
      <Tab.Pane>
        <p>{No_Data_Reported_Label}</p>
      </Tab.Pane>
    );
  }

  return (
    <Tab.Pane className="governance-tab">
      {Title && <h2>{Title}</h2>}

      {Introduction && <Callout>{Introduction}</Callout>}

      <StatisticSection statistic={statisticData} />

      {Describe_Title && <h3>{Describe_Title}</h3>}

      {Describe && <HTMLField value={{ data: formatTextToHTML(Describe) }} />}

      {Provide && (
        <div className="provide-section">
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
        </div>
      )}
    </Tab.Pane>
  );
};

export default GovernanceTab;
