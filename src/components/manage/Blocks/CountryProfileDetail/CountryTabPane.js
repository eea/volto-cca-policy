import React from 'react';
import { Accordion, Icon } from 'semantic-ui-react';

export default function CountryTabPane(props) {
  const { contents, _index, activePanes, setActivePanes } = props;
  return (
    <>
      {contents.map((element, index) => {
        let indexKey = _index + '_' + index;
        if (element.type === 'h2') {
          return <h2 key={indexKey}>{element.value}</h2>;
        }
        if (element.type === 'h3') {
          return <h3 key={indexKey}>{element.value}</h3>;
        }
        if (element.type === 'p') {
          return (
            <p
              key={indexKey}
              dangerouslySetInnerHTML={{ __html: element.value }}
            ></p>
          );
        }
        if (element.type === 'accordeon') {
          return element.value.map((accordion, index) => {
            return (
              <Accordion className="secondary">
                <Accordion.Title
                  role="button"
                  tabIndex={0}
                  active={activePanes[indexKey + '_' + index] || false}
                  onClick={(e) => {
                    const temp = JSON.parse(JSON.stringify(activePanes));
                    let val = temp[indexKey + '_' + index] || false;
                    temp[indexKey + '_' + index] = !val;
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
        if (element.type === 'table') {
          return (
            <div dangerouslySetInnerHTML={{ __html: element.value }}></div>
          );
        }

        if (element.type === 'div') {
          let _html_value = '';
          for (let i = 0; i < element.value.length; i++) {
            _html_value += element.value[i];
          }
          // return <table>{_html_value}</table>;
          return <div dangerouslySetInnerHTML={{ __html: _html_value }}></div>;
        }
        return null;
      })}
    </>
  );
}
