import React, { useState } from 'react';
import {
  Icon,
  Accordion,
  AccordionTitle,
  AccordionContent,
} from 'semantic-ui-react';

const AccordionList = ({ accordions }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const handleAccordionClick = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <Accordion>
      {accordions.map((accordion, index) => (
        <React.Fragment key={index}>
          <AccordionTitle
            active={activeIndex === index}
            onClick={() => handleAccordionClick(index)}
          >
            <Icon
              name={
                activeIndex === index
                  ? 'ri-arrow-up-s-line'
                  : 'ri-arrow-down-s-line'
              }
            />
            {accordion.title}
          </AccordionTitle>
          <AccordionContent active={activeIndex === index}>
            <p>{accordion.content}</p>
          </AccordionContent>
        </React.Fragment>
      ))}
    </Accordion>
  );
};

export default AccordionList;
