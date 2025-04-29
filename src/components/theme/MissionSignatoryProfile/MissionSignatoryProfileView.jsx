import React from 'react';
import { Tab, Container } from 'semantic-ui-react';
import { BannerTitle } from '@eeacms/volto-cca-policy/helpers';
import IntroductionTab from './TabSections/IntroductionTab';
import GovernanceTab from './TabSections/GovernanceTab';
import AssessmentTab from './TabSections/AssessmentTab';
import PlanningTab from './TabSections/PlanningTab';
import ActionPagesTab from './TabSections/ActionPagesTab';

import './style.less';

const MissionSignatoryProfileView = (props) => {
  const { content } = props || {};
  const dataJson = props?.content['@components']?.missionsignatoryprofile || {};

  const result = dataJson?.result || {};
  const governance = result?.governance?.[0] || [];
  const planning = result?.planning || {};
  const assessment = result?.assessment || {};
  const action = result?.action || {};

  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <Container>
      <BannerTitle
        content={content}
        data={{
          info: [{ description: '' }],
          hideContentType: true,
          hideCreationDate: true,
          hideModificationDate: true,
          hidePublishingDate: true,
          hideDownloadButton: false,
          hideShareButton: false,
        }}
      />
      <div className="signatories-profile">
        {/* <h2>{planning?.planning_titles?.[0].Signatory}</h2> */}
        {/* <h2>{planning?.planning_titles?.[0].Id}</h2> */}

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
              render: () => <AssessmentTab result={assessment} />,
            },
            {
              menuItem: 'Planning',
              render: () => <PlanningTab result={planning} />,
            },
            {
              menuItem: 'Action',
              render: () => <ActionPagesTab result={action} />,
            },
          ]}
        />
      </div>
    </Container>
  );
};

export default MissionSignatoryProfileView;
