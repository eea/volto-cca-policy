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

const SUBMENUS = {
  Summary: [
    { label: 'Adaptation policies', href: '#adaptation_policies' },
    { label: 'Data and climate services', href: '#climate_services' },
    { label: 'Monitoring and reporting', href: 'monitoring_reporting' },
    {
      label: 'Adaptation knowledge portals and platforms',
      href: 'adaptation_knowledge',
    },
    { label: 'Key publications', href: '#key_publications' },
    { label: 'Contact', href: '#contact' },
  ],
  'Assessment and key affected sectors': [
    { label: 'Hazard assessment', href: 'hazard_assessment' },
    {
      label: 'Supporting assessment information',
      href: 'supporting_assessment',
    },
    { label: 'Key affected sectors', href: 'key_affected_sectors' },
  ],

  'Strategies, plans and goals': [
    { label: 'Adaptation governance overview', href: 'overview' },
    { label: 'Adaptation actions and measures', href: '#measures' },
  ],

  'Monitoring and evaluation': [
    { label: 'Monitoring, reporting and evaluation', href: '#mre' },
    { label: 'State of play', href: '#state_play' },
    { label: 'Progress on adaptation', href: '#progress' },
    { label: 'Steps to review', href: '#steps_review' },
  ],
  'Good practices, cooperation and synergies': [
    { label: 'Cooperation and experience', href: 'cooperation' },
    { label: 'Good practices and lessons learnt', href: '#good_practices' },
  ],
};

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
  const [activeTabLabel, setActiveTabLabel] = useState('Summary');

  const handleTabChange = (e, { panes, activeIndex }) => {
    const selectedPane = panes[activeIndex];
    if (selectedPane && selectedPane.label) {
      setActiveTabLabel(selectedPane.label);
    }
  };

  const panes = useMemo(() => {
    const result = [];

    const processLabel = (label, content, index) => {
      // Add the main tab
      result.push({
        menuItem: label,
        label: label, // keep track of label
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

      // If this is the active tab, add submenus
      if (label === activeTabLabel && SUBMENUS[label]) {
        SUBMENUS[label].forEach((sub) => {
          result.push({
            menuItem: {
              key: `${label}-${sub.label}`,
              content: sub.label,
              className: 'submenu-item-left',
              onClick: (e) => {
                e.preventDefault();
                const element = document.getElementById(
                  sub.href.replace('#', ''),
                );
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                } else {
                  // fallback to just setting hash if element not found
                  window.location.hash = sub.href;
                }
              },
            },
            label: label, // Keep same label so it stays expanded
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
    };

    // 1. Process Static Menus from JSON data
    if (Object.keys(dataJson).length > 0) {
      STATIC_MENU_LABELS.forEach((label, index) => {
        const Component = STATIC_MENU_COMPONENTS[index];
        const content = Component ? (
          <Component dataJson={dataJson} />
        ) : (
          `Content ${index}`
        );
        processLabel(label, content, index);
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
        processLabel(menuLabel, htmlContent, STATIC_MENU_LABELS.length + index);
      });
    }

    return result;
  }, [
    dataJson,
    dataContent,
    dataMenu,
    countryName,
    activePanes,
    activeTabLabel,
  ]);

  // Find the index in dynamic panes that matches activeTabLabel
  // Since we insert submenus, we need to find the FIRST occurrence of the label
  const activeIndex = useMemo(() => {
    const idx = panes.findIndex((p) => p.label === activeTabLabel);
    return idx !== -1 ? idx : 0;
  }, [panes, activeTabLabel]);

  return (
    <div id="countryProfile2026">
      <Tab
        className="secondary menu"
        panes={panes}
        activeIndex={activeIndex}
        onTabChange={handleTabChange}
        grid={{ paneWidth: 9, tabWidth: 3 }}
        menu={{
          tabular: true,
          vertical: true,
          inverted: false,
          pointing: true,
          fluid: true,
          className: 'secondary sticky_top',
          tabIndex: 0,
        }}
      />
    </div>
  );
}
