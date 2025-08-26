import React from 'react';
import { Link } from 'react-router-dom';
import { Tab, Container, Divider, Button, Icon } from 'semantic-ui-react';
import { formatTextToHTML } from '@eeacms/volto-cca-policy/utils';
import { BannerTitle, HTMLField } from '@eeacms/volto-cca-policy/helpers';
import { flattenToAppURL } from '@plone/volto/helpers';

import GovernanceTab from './TabSections/GovernanceTab';
import AssessmentTab from './TabSections/AssessmentTab';
import PlanningTab from './TabSections/PlanningTab';
import ActionPagesTab from './TabSections/ActionPagesTab';

const tabRenderers = {
  Governance_Label: (props) => <GovernanceTab {...props} />,
  Assessment_Label: (props) => <AssessmentTab {...props} />,
  Planning_Label: (props) => <PlanningTab {...props} />,
  Action_Label: (props) => <ActionPagesTab {...props} />,
};

const MissionSignatoryProfileView = ({ content }) => {
  const signatoryData =
    content?.['@components']?.missionsignatoryprofile?.result || {};

  const {
    governance = [{}],
    planning = {},
    assessment = {},
    action = {},
    footer_text = {},
    tab_labels = [],
    general_text = [{}],
  } = signatoryData;

  const { Back_To_Map_Link, Country_Or_Area } = general_text?.[0] || {};
  const backToMapPath = flattenToAppURL(content?.parent?.['@id'] || '/');

  const [activeIndex, setActiveIndex] = React.useState(0);

  const tabData = {
    Governance_Label: { result: governance[0], general_text: general_text[0] },
    Assessment_Label: { result: assessment, general_text: general_text[0] },
    Planning_Label: { result: planning, general_text: general_text[0] },
    Action_Label: { result: action, general_text: general_text[0] },
  };

  const panes = tab_labels
    .filter(({ key }) => key !== 'Language')
    .map(({ key, value }) => {
      const Renderer = tabRenderers[key];
      return {
        menuItem: value,
        render: () => (Renderer ? Renderer(tabData[key]) : null),
      };
    });

  return (
    <Container>
      <BannerTitle
        content={{ ...content, image: signatoryData?.image }}
        data={{
          info: [{ description: '' }],
          hideContentType: true,
          hideCreationDate: true,
          hideModificationDate: true,
          hidePublishingDate: true,
          hideDownloadButton: false,
          hideShareButton: false,
          subtitle: Country_Or_Area,
        }}
      />

      <div className="signatory-profile">
        <Link to={backToMapPath}>
          <Button icon inverted primary className="left labeled back-to-map">
            <Icon className="chevron left icon" />
            {Back_To_Map_Link || 'Back to Signatories map'}
          </Button>
        </Link>

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

        {footer_text?.Disclaimer && (
          <div className="footer-text">
            <Divider />
            <strong>{footer_text?.Disclaimer_Title}</strong>
            <HTMLField
              value={{ data: formatTextToHTML(footer_text.Disclaimer) }}
            />
          </div>
        )}
      </div>
    </Container>
  );
};

export default MissionSignatoryProfileView;
