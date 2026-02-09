import React from 'react';
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

export default function CountryProfileDetail2026View(props) {
  const dataJson =
    props?.properties['@components']?.countryprofile2026?.json || {};
  const countryName = props?.properties['title'];
  const dataContent =
    props?.properties['@components']?.countryprofile2026?.content || [];
  const dataMenu =
    props?.properties['@components']?.countryprofile2026?.menu || [];

  const [activePanes, setActivePanes] = React.useState({});

  const panes = [];
  const menu = [
    'Profile',
    'National circumstances',
    'Assessment & key affected sectors',
    'Legal and policy framework',
    'Strategies plans and goals',
    'Monitoring and evaluation',
    'Good practices, cooperation and synergies',
    'Sub national adaptation',
  ];
  if (Object.keys(dataJson).length > 0) {
    menu.forEach((element, index) => {
      let content = '';
      switch (index) {
        case 0:
          content = <MenuProfile dataJson={dataJson} />;
          break;
        case 1:
          content = <MenuNationalCircumstances dataJson={dataJson} />;
          break;
        case 2:
          content = <MenuAssesment dataJson={dataJson} />;
          break;
        case 3:
          content = <MenuLegalPolicy dataJson={dataJson} />;
          break;
        case 4:
          content = <MenuStrategiesPlansGoals dataJson={dataJson} />;
          break;
        case 5:
          content = <MenuMonitorEvaluation dataJson={dataJson} />;
          break;
        case 6:
          content = <MenuGoodPractices dataJson={dataJson} />;
          break;
        case 7:
          content = <MenuSubNational dataJson={dataJson} />;
          break;
        default:
          content = 'Content' + index.toString();
      }
      panes.push({
        menuItem: element,
        render: () => (
          <TabPane>
            <CountryTabPane
              _index={index}
              contents={content}
              countryName={countryName}
              activePanes={activePanes}
              setActivePanes={setActivePanes}
            ></CountryTabPane>
          </TabPane>
        ),
      });
    });
  }
  if (Object.keys(dataMenu).length > 0) {
    dataMenu.map((menu, index) =>
      panes.push({
        menuItem: menu,
        render: () => {
          const htmlContent = (
            <div
              dangerouslySetInnerHTML={{
                __html: dataContent[index].map((item) => item.value).join(''),
              }}
            />
          );
          return (
            <TabPane>
              <CountryTabPane
                _index={index}
                contents={htmlContent}
                countryName={countryName}
                activePanes={activePanes}
                setActivePanes={setActivePanes}
              ></CountryTabPane>
            </TabPane>
          );
        },
      }),
    );
  }

  return (
    <div id="countryProfile2026">
      <Tab
        className="secondary menu"
        panes={panes}
        grid={{ paneWidth: 8, tabWidth: 4 }}
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
