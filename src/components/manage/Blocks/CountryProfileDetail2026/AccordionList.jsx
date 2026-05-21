import React from 'react';
import { Accordion, Icon } from 'semantic-ui-react';

export default function AccordionList(props) {
  const elements = props.elements;
  const [activePanes, setActivePanes] = React.useState({});
  return (
    <>
      {elements.map((accordion, index) => (
        <Accordion className="secondary">
          <Accordion.Title
            role="button"
            tabIndex={0}
            active={activePanes[index] || false}
            onClick={(e) => {
              const temp = JSON.parse(JSON.stringify(activePanes));
              let val = temp[index] || false;
              temp[index] = !val;
              setActivePanes(temp);
            }}
          >
            <span className="item-title">{accordion.Title}</span>
            <Icon className="ri-arrow-down-s-line" />
          </Accordion.Title>
          <Accordion.Content
            active={activePanes[index] || false}
            dangerouslySetInnerHTML={{ __html: accordion.Text }}
          ></Accordion.Content>
        </Accordion>
      ))}
    </>
  );
}
