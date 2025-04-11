import React from 'react';
import { Tab } from 'semantic-ui-react';

import IntroductionTab from './TabSections/IntroductionTab';
import GovernanceTab from './TabSections/GovernanceTab';
import AssessmentTab from './TabSections/AssessmentTab';
import PlanningTab from './TabSections/PlanningTab';
import ActionPagesTab from './TabSections/ActionPagesTab';

import './style.less';

const MissionSignatoriesProfileView = (props) => {
  const { data } = props;
  const result = data?._v_results || {};
  const governance = result?.governance?.[0] || {};

  // const dataJson = JSON.parse(result?.Cooperation_Experience);
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <>
      <div className="signatories-profile">
        {/* {
          dataJson['Cooperation_Experience'][0][
            'DescribeDetailCooperationEnhance'
          ]
        } */}
        <h2>{result?.planning_titles[0]?.Signatory}</h2>

        <br />

        <Tab
          menu={{
            fluid: true,
            className: 'secondary',
            vertical: true,
            pointing: true,
          }}
          grid={{ paneWidth: 9, tabWidth: 3, stackable: true }}
          activeIndex={activeIndex}
          onTabChange={(e, { activeIndex }) => setActiveIndex(activeIndex)}
          panes={[
            {
              menuItem: 'Introduction',
              render: () => <IntroductionTab activeIndex={activeIndex} />,
            },
            {
              menuItem: 'Governance',
              render: () => <GovernanceTab result={governance} />,
            },
            {
              menuItem: 'Assessment',
              render: () => <AssessmentTab />,
            },
            {
              menuItem: 'Planning',
              render: () => (
                <PlanningTab
                  result={{
                    planning_goals: result?.planning_goals,
                    planning_titles: result?.planning_titles,
                    planning_climate_action: result?.planning_climate_action,
                    planning_climate_sectors: result?.planning_climate_sectors,
                  }}
                />
              ),
            },
            {
              menuItem: 'Action Pages',
              render: () => <ActionPagesTab />,
            },
          ]}
        />
      </div>
    </>
  );
};

export default MissionSignatoriesProfileView;
