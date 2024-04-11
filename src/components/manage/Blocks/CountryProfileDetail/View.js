import React from 'react';
import { TabPane, Tab } from 'semantic-ui-react';
import { Accordion, Icon } from 'semantic-ui-react';

import './styles.less';

export default function View(props) {
  console.log('View:', props);
  const dataJson = JSON.parse(
    props.properties['@components'].countryprofile.html,
  );
  console.log('DataJson:', dataJson);
  const [activePanes, setActivePanes] = React.useState({});

  const panes = [];
  if (dataJson?.menu) {
    dataJson.menu.forEach((element, index) => {
      panes.push({
        menuItem: element,
        render: () => (
          <TabPane>
            <CountryTabPane
              _index={index}
              contents={dataJson.content[index]}
              activePanes={activePanes}
              setActivePanes={setActivePanes}
            ></CountryTabPane>
          </TabPane>
        ),
      });
    });
  }

  return (
    <>
      {dataJson.message_top ? (
        <div class="eea callout">{dataJson.message_top}</div>
      ) : null}
      {dataJson.top_accordeon
        ? dataJson.top_accordeon.map((accordion, index) => (
            <Accordion className="secondary">
              <Accordion.Title
                role="button"
                tabIndex={0}
                active={activePanes['_' + index] || false}
                onClick={(e) => {
                  // const value =
                  const temp = JSON.parse(JSON.stringify(activePanes));
                  let val = temp['_' + index] || false;
                  temp['_' + index] = !val;
                  console.log(temp);
                  setActivePanes(temp);
                }}
              >
                <span className="item-title">{accordion.title}</span>
                <Icon className="ri-arrow-down-s-line" />
              </Accordion.Title>
              <Accordion.Content
                active={activePanes['_' + index] || false}
                dangerouslySetInnerHTML={{ __html: accordion.value }}
              ></Accordion.Content>
            </Accordion>
          ))
        : null}
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
      {dataJson.updated ? <p>Last updated:{dataJson.updated}</p> : null}
    </>
  );
}

function CountryTabPane(props) {
  const { contents, _index, activePanes, setActivePanes } = props;
  return (
    <>
      {contents.map((element, index) => {
        let indexKey = _index + '_' + index;
        if (element.type == 'h2') {
          return <h2 key={indexKey}>{element.value}</h2>;
        }
        if (element.type == 'h3') {
          return <h3 key={indexKey}>{element.value}</h3>;
        }
        if (element.type == 'p') {
          return (
            <p
              key={indexKey}
              dangerouslySetInnerHTML={{ __html: element.value }}
            ></p>
          );
        }
        if (element.type == 'accordeon') {
          return element.value.map((accordion, index) => {
            return (
              <Accordion className="secondary">
                <Accordion.Title
                  role="button"
                  tabIndex={0}
                  active={activePanes[indexKey + '_' + index] || false}
                  onClick={(e) => {
                    // const value =
                    const temp = JSON.parse(JSON.stringify(activePanes));
                    let val = temp[indexKey + '_' + index] || false;
                    temp[indexKey + '_' + index] = !val;
                    console.log(temp);
                    setActivePanes(temp);
                  }}
                >
                  <span className="item-title">{accordion.title}</span>
                  <Icon className="ri-arrow-down-s-line" />
                </Accordion.Title>
                <Accordion.Content
                  active={activePanes[indexKey + '_' + index] || false}
                  dangerouslySetInnerHTML={{ __html: accordion.value }}
                ></Accordion.Content>
              </Accordion>
            );
          });
        }
        if (element.type == 'table') {
          let _html_value = '';
          for (let i = 0; i < element.value.length; i++) {
            _html_value += element.value[i];
          }
          // return <table>{_html_value}</table>;
          return (
            <table dangerouslySetInnerHTML={{ __html: _html_value }}></table>
          );
        }
        if (element.type == 'div') {
          let _html_value = '';
          for (let i = 0; i < element.value.length; i++) {
            _html_value += element.value[i];
          }
          // return <table>{_html_value}</table>;
          return <div dangerouslySetInnerHTML={{ __html: _html_value }}></div>;
        }
      })}
    </>
  );
}
