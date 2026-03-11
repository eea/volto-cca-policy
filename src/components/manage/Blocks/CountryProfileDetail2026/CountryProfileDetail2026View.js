import React, { useMemo, useState } from 'react';
import { TabPane, Tab } from 'semantic-ui-react';

import CountryTabPane from './CountryTabPane';
import MenuProfile from './MenuProfile';
import MenuNationalCircumstances from './MenuNationalCircumstances';
import MenuAssesment from './MenuAssesment';
import MenuLegalPolicy from './MenuLegalPolicy';
import MenuStrategiesPlansGoals from './MenuStrategiesPlansGoals';
import MenuMonitorEvaluation from './MenuMonitorEvaluation';
import MenuGoodPractices from './MenuGoodPractices';
import MenuSubNational from './MenuSubNational';
import './styles.less';

const STATIC_MENU_COMPONENTS = [
  MenuProfile,
  MenuNationalCircumstances,
  MenuAssesment,
  MenuLegalPolicy,
  MenuStrategiesPlansGoals,
  MenuMonitorEvaluation,
  MenuGoodPractices,
  MenuSubNational,
];

const STATIC_MENU_LABELS = [
  'Summary',
  'National circumstances',
  'Assessment and key affected sectors',
  'Legal and policy framework',
  'Strategies, plans and goals',
  'Monitoring and evaluation',
  'Good practices, cooperation and synergies',
  'Sub national adaptation',
];

export default function CountryProfileDetail2026View(props) {
  const { properties } = props;
  const countryProfile = properties?.['@components']?.countryprofile2026 || {};
  const {
    json: dataJson = {},
    content: dataContent = [],
    menu: dataMenu = [],
  } = countryProfile;
  const countryName = properties?.title;

  const [activePanes, setActivePanes] = useState({});

  const panes = useMemo(() => {
    const result = [];

    // 1. Process Static Menus from JSON data
    if (Object.keys(dataJson).length > 0) {
      STATIC_MENU_LABELS.forEach((label, index) => {
        const Component = STATIC_MENU_COMPONENTS[index];
        const content = Component ? (
          <Component dataJson={dataJson} />
        ) : (
          `Content ${index}`
        );

        result.push({
          menuItem: label,
          render: () => (
            <TabPane>
              <CountryTabPane
                _index={index}
                contents={content}
                countryName={countryName}
                activePanes={activePanes}
                setActivePanes={setActivePanes}
              />
            </TabPane>
          ),
        });
      });
    }

    // 2. Process Dynamic Menus from Volto content
    if (dataMenu.length > 0) {
      dataMenu.forEach((menuLabel, index) => {
        const htmlContent = (
          <div
            dangerouslySetInnerHTML={{
              __html: (dataContent[index] || [])
                .map((item) => item.value)
                .join(''),
            }}
          />
        );

        result.push({
          menuItem: menuLabel,
          render: () => (
            <TabPane>
              <CountryTabPane
                _index={STATIC_MENU_LABELS.length + index}
                contents={htmlContent}
                countryName={countryName}
                activePanes={activePanes}
                setActivePanes={setActivePanes}
              />
            </TabPane>
          ),
        });
      });
    }

    return result;
  }, [dataJson, dataContent, dataMenu, countryName, activePanes]);

  return (
    <div id="countryProfile2026">
      <Tab
        className="secondary menu"
        panes={panes}
        grid={{ paneWidth: 9, tabWidth: 3 }}
        menu={{
          tabular: true,
          vertical: true,
          inverted: false,
          pointing: true,
          fluid: true,
          className: 'secondary',
          tabIndex: 0,
        }}
      />
    </div>
  );
}
