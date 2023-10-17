import React, { Component } from 'react';
import { Accordion, Icon } from 'semantic-ui-react';

export default function CaseStudyFilters(props) {
  const { filters, activeFilters, setActiveFilters } = props;
  const [activeIndex, setActiveIndex] = React.useState([]);

  function handleClick(e, titleProps) {
    let index = Object.create(activeIndex);
    console.log('handleClickIn', titleProps.index, index);
    if (index.includes(titleProps.index)) {
      index = index.filter(function (item) {
        return item !== titleProps.index;
      });
    } else {
      index.push(titleProps.index);
    }
    console.log('handleClickOut', index, titleProps);
    setActiveIndex(index);
  }

  React.useEffect(() => {
    console.log('CURRENT FILTER INDEX:', activeIndex);
  }, [activeIndex]);

  return (
    <Accordion exclusive={false}>
      <Accordion.Title
        active={activeIndex.includes(0)}
        index={0}
        onClick={handleClick}
      >
        <Icon name="dropdown" />
        Adaptation sectors
      </Accordion.Title>
      <Accordion.Content active={activeIndex.includes(0)}>
        {Object.entries(filters?.sectors || {}).map(([value, label], index) => (
          <p key={index}>
            <span>{label}</span>
            <input
              value={value}
              type="checkbox"
              onChange={(e) => {
                // const value =
                const temp = JSON.parse(JSON.stringify(activeFilters));
                if (e.target.checked) {
                  temp.sectors.push(e.target.value);
                } else {
                  temp.sectors = temp.sectors.filter((value) => {
                    if (value !== e.target.value) return value;
                    return null;
                  });
                }
                setActiveFilters(temp);
              }}
            />
          </p>
        ))}
      </Accordion.Content>
      <Accordion.Title
        active={activeIndex.includes(1)}
        index={1}
        onClick={handleClick}
      >
        <Icon name="dropdown" />
        Climate impacts
      </Accordion.Title>
      <Accordion.Content active={activeIndex.includes(1)}>
        {Object.entries(filters?.impacts || {}).map(([value, label], index) => (
          <p key={index}>
            <span>{label}</span>
            <input
              value={value}
              type="checkbox"
              onChange={(e) => {
                // const value =
                const temp = JSON.parse(JSON.stringify(activeFilters));
                if (e.target.checked) {
                  temp.impacts.push(e.target.value);
                } else {
                  temp.impacts = temp.impacts.filter((value) => {
                    if (value !== e.target.value) return value;
                    return null;
                  });
                }
                setActiveFilters(temp);
              }}
            />
          </p>
        ))}
      </Accordion.Content>
      <Accordion.Title
        active={activeIndex.includes(2)}
        index={2}
        onClick={handleClick}
      >
        <Icon name="dropdown" />
        Key type measures
      </Accordion.Title>
      <Accordion.Content active={activeIndex.includes(2)}>
        {Object.entries(filters?.measures || {}).map(([key, values], index) => (
          <div>
            <p>
              <strong>{key}</strong>
            </p>
            {Object.entries(values).map(([valKey, valData]) => (
              <p key={valData.key}>
                <span>{valData.value}</span>
                <input
                  value={valData.key}
                  type="checkbox"
                  onChange={(e) => {
                    // const value =
                    const temp = JSON.parse(JSON.stringify(activeFilters));
                    if (e.target.checked) {
                      temp.measures.push(e.target.value);
                    } else {
                      temp.measures = temp.measures.filter((value) => {
                        if (value !== e.target.value) return value;
                        return null;
                      });
                    }
                    setActiveFilters(temp);
                  }}
                />
              </p>
            ))}
          </div>
        ))}
      </Accordion.Content>
    </Accordion>
  );
}
