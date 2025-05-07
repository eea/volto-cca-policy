import React from 'react';
import { Message, TabPane, Tab, Accordion, Icon } from 'semantic-ui-react';
import CountryTabPane from './CountryTabPane';
import { FormattedMessage } from 'react-intl';

import './styles.less';

export default function View(props) {
  // const dataJson = JSON.parse(
  //   props?.properties['@components']?.countryprofile?.html,
  // );
  const dataJson = props?.properties['@components']?.countryprofile?.html || {};
  const [activePanes, setActivePanes] = React.useState({});
  const isNonEN = props?.properties?.language !== 'en';

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
      {isNonEN && (
        <Message class="eea callout">
          <FormattedMessage
            id="officiallyInEnglish"
            defaultMessage="Officially reported governmental information is only available in English"
          />
        </Message>
      )}
      {dataJson.message_top ? (
        <div class="eea callout">{dataJson.message_top}</div>
      ) : null}
      {dataJson.top_accordeon ? (
        <div className="top-accordion">
          {dataJson.top_accordeon.map((accordion, index) => (
            <Accordion className="secondary">
              <Accordion.Title
                role="button"
                tabIndex={0}
                active={activePanes['_' + index] || false}
                onClick={(e) => {
                  const temp = JSON.parse(JSON.stringify(activePanes));
                  let val = temp['_' + index] || false;
                  temp['_' + index] = !val;
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
          ))}
        </div>
      ) : null}
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
      {dataJson.updated ? (
        <p>Reported updated until: {dataJson.updated}</p>
      ) : null}
    </>
  );
}
