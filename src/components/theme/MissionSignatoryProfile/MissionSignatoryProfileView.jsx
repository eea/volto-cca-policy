import React from 'react';
import { Tab, Container, Divider } from 'semantic-ui-react';
import { BannerTitle } from '@eeacms/volto-cca-policy/helpers';
import GovernanceTab from './TabSections/GovernanceTab';
import AssessmentTab from './TabSections/AssessmentTab';
import PlanningTab from './TabSections/PlanningTab';
import ActionPagesTab from './TabSections/ActionPagesTab';

const tabRenderers = {
  Governance_Label: (data) => <GovernanceTab result={data} />,
  Assessment_Label: (data) => <AssessmentTab result={data} />,
  Planning_Label: (data) => <PlanningTab result={data} />,
  Action_Label: (data) => <ActionPagesTab result={data} />,
};

const MissionSignatoryProfileView = (props) => {
  const { content } = props || {};
  const dataJson =
    props?.content?.['@components']?.missionsignatoryprofile || {};

  const result = dataJson?.result || {};
  const governance = result?.governance?.[0] || {};
  const planning = result?.planning || {};
  const assessment = result?.assessment || {};
  const action = result?.action || {};
  const footer_text = result?.footer_text || {};
  const tab_labels = result?.tab_labels || [];

  const [activeIndex, setActiveIndex] = React.useState(0);

  const panes = tab_labels
    .filter(({ key }) => key !== 'Language')
    .map(({ key, value }) => {
      const renderTab = tabRenderers[key];
      const dataMap = {
        Governance_Label: governance,
        Assessment_Label: assessment,
        Planning_Label: planning,
        Action_Label: action,
      };

      return {
        menuItem: value,
        render: () => (renderTab ? renderTab(dataMap[key]) : null),
      };
    });

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
      <div className="signatory-profile">
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
          panes={panes}
        />

        {footer_text.Disclaimer && (
          <div className="footer-text">
            <Divider />
            <strong>{footer_text.Disclaimer_Title}</strong>
            <p>{footer_text.Disclaimer}</p>
          </div>
        )}
      </div>
    </Container>
  );
};

export default MissionSignatoryProfileView;
