import React, { useState } from 'react';
import {
  Icon,
  Accordion,
  AccordionTitle,
  AccordionContent,
} from 'semantic-ui-react';

const AccordionList = ({ accordions, variation }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const handleAccordionClick = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <Accordion className={variation}>
      {accordions.map((accordion, index) => (
        <React.Fragment key={index}>
          <AccordionTitle
            active={activeIndex === index}
            onClick={() => handleAccordionClick(index)}
          >
            <Icon
              className={
                activeIndex === index
                  ? 'ri-arrow-up-s-line'
                  : 'ri-arrow-down-s-line'
              }
            />
            {accordion.title}
          </AccordionTitle>
          <AccordionContent active={activeIndex === index}>
            {accordion.content}
          </AccordionContent>
        </React.Fragment>
      ))}
    </Accordion>
  );
};

export default AccordionList;
