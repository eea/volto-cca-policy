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
  const result = data?._v_results?.[0] || {};
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
        <h1>{result?.Signatory}</h1>

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
              render: () => <GovernanceTab result={result} />,
            },
            {
              menuItem: 'Assessment',
              render: () => <AssessmentTab result={result} />,
            },
            {
              menuItem: 'Planning',
              render: () => <PlanningTab result={result} />,
            },
            {
              menuItem: 'Action Pages',
              render: () => <ActionPagesTab result={result} />,
            },
          ]}
        />
      </div>
    </>
  );
};

export default MissionSignatoriesProfileView;
