import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Accordion, Icon, Checkbox } from 'semantic-ui-react';

const AccordionIcon = ({ active }) => {
  return (
    <Icon
      size="small"
      className={active ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}
    />
  );
};

export default function CaseStudyFilters(props) {
  const { filters, activeFilters, setActiveFilters } = props;

  const resetFilters = () => {
    let clone = { ...activeFilters };
    Object.keys(activeFilters).forEach((element) => {
      clone[element] = [];
    });
    setActiveFilters(clone);
  };

  let nrActiveFilters = 0;
  Object.values(activeFilters).forEach((element) => {
    nrActiveFilters += element.length;
  });

  const [activeIndex, setActiveIndex] = React.useState([]);

  function handleClick(e, titleProps) {
    let index = Object.create(activeIndex);
    if (index.includes(titleProps.index)) {
      index = index.filter(function (item) {
        return item !== titleProps.index;
      });
    } else {
      index.push(titleProps.index);
    }
    setActiveIndex(index);
  }

  const checkboxChangeHandler = (_event, data) => {
    const temp = JSON.parse(JSON.stringify(activeFilters));

    if (data.checked) {
      temp[data.name].push(data.value);
    } else {
      temp[data.name] = temp[data.name].filter((value) => {
        if (value !== data.value) return value;
        return null;
      });
    }
    setActiveFilters(temp);
  };

  const intl = useIntl();
  return (
    <div className="casestudy-filters">
      <Accordion exclusive={false} className="secondary">
        <Accordion.Title
          active={activeIndex.includes(0)}
          index={0}
          onClick={handleClick}
        >
          <AccordionIcon active={activeIndex.includes(0)} />
          <FormattedMessage
            id="Adaptation sectors"
            defaultMessage="Adaptation sectors"
          />
        </Accordion.Title>
        <Accordion.Content active={activeIndex.includes(0)}>
          {Object.entries(filters?.sectors || {}).map(
            ([value, label], index) => (
              <Checkbox
                label={intl.formatMessage({ id: label })}
                value={value}
                checked={activeFilters.sectors.includes(value)}
                name="sectors"
                onChange={checkboxChangeHandler}
                key={'sector' + index}
              />
            ),
          )}
        </Accordion.Content>
        <Accordion.Title
          active={activeIndex.includes(1)}
          index={1}
          onClick={handleClick}
        >
          <AccordionIcon active={activeIndex.includes(1)} />
          <FormattedMessage
            id="Climate impacts"
            defaultMessage="Climate impacts"
          />
        </Accordion.Title>
        <Accordion.Content active={activeIndex.includes(1)}>
          {Object.entries(filters?.impacts || {}).map(
            ([value, label], index) => (
              <Checkbox
                label={intl.formatMessage({ id: label })}
                checked={activeFilters.impacts.includes(value)}
                value={value}
                name="impacts"
                onChange={checkboxChangeHandler}
                key={'impact' + index}
              />
            ),
          )}
        </Accordion.Content>
        <Accordion.Title
          active={activeIndex.includes(2)}
          index={2}
          onClick={handleClick}
        >
          <AccordionIcon active={activeIndex.includes(2)} />
          <FormattedMessage
            id="Key type measures"
            defaultMessage="Key type measures"
          />
        </Accordion.Title>
        <Accordion.Content active={activeIndex.includes(2)}>
          {Object.entries(filters?.measures || {}).map(
            ([key, values], index) => (
              <div className="subcategory" key={'ktm' + index}>
                <p>
                  <strong>{intl.formatMessage({ id: key })}</strong>
                </p>
                {Object.entries(values).map(([_, valData]) => (
                  <Checkbox
                    label={intl.formatMessage({ id: valData.value })}
                    value={valData.key}
                    checked={activeFilters.measures.includes(valData.key)}
                    name="measures"
                    onChange={checkboxChangeHandler}
                    key={'ktm' + index + '_' + valData.key}
                  />
                ))}
              </div>
            ),
          )}
        </Accordion.Content>
        <Accordion.Title
          active={activeIndex.includes(3)}
          index={3}
          onClick={handleClick}
        >
          <AccordionIcon active={activeIndex.includes(3)} />
          <FormattedMessage
            id="Adaptation elements"
            defaultMessage="Adaptation elements"
          />
        </Accordion.Title>
        <Accordion.Content active={activeIndex.includes(3)}>
          {Object.entries(filters?.elements || {}).map(
            ([value, label], index) => (
              <Checkbox
                label={intl.formatMessage({ id: label })}
                value={value}
                checked={activeFilters.elements.includes(value)}
                name="elements"
                onChange={checkboxChangeHandler}
                key={'element' + index}
              />
            ),
          )}
        </Accordion.Content>
      </Accordion>
      {nrActiveFilters ? (
        <button
          className="ui primary button reset"
          onClick={(_e) => resetFilters()}
        >
          Reset
        </button>
      ) : null}
      <div className="case-study-legend">
        <p>
          <span></span>
          <FormattedMessage
            id="Climate-ADAPT case studies"
            defaultMessage="Climate-ADAPT case studies"
          />
        </p>
        <p>
          <span className="light-blue"></span>
          <FormattedMessage
            id="Case studies collected at national level in Spain, provided by AdapteCCA.es"
            defaultMessage="Case studies collected at national level in Spain, provided by AdapteCCA.es"
          />
        </p>
      </div>
    </div>
  );
}
