import React, { useState } from 'react';
import {
  Icon,
  Accordion,
  AccordionTitle,
  AccordionContent,
} from 'semantic-ui-react';

const AccordionList = ({ accordions, variation, multiple = false }) => {
  const [activeIndexes, setActiveIndexes] = useState([]);

  const handleAccordionClick = (index) => {
    if (multiple) {
      setActiveIndexes((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index],
      );
    } else {
      setActiveIndexes((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <Accordion className={variation}>
      {accordions.map((accordion, index) => {
        const isActive = activeIndexes.includes(index);
        return (
          <React.Fragment key={index}>
            <AccordionTitle
              active={isActive}
              onClick={() => handleAccordionClick(index)}
            >
              <Icon
                className={
                  isActive ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'
                }
              />
              {accordion.title}
            </AccordionTitle>
            <AccordionContent active={isActive}>
              {accordion.content}
            </AccordionContent>
          </React.Fragment>
        );
      })}
    </Accordion>
  );
};

export default AccordionList;
