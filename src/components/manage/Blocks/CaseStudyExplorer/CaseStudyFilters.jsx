import React, { FormEvent } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Accordion, Icon, Checkbox } from 'semantic-ui-react';

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

  const checkboxChangeHandler = (_event: FormEvent<HTMLInputElement>, data) => {
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
    <>
      <Accordion exclusive={false} className="secondary">
        <Accordion.Title
          active={activeIndex.includes(0)}
          index={0}
          onClick={handleClick}
        >
          <Icon name="dropdown" />
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
              />
            ),
          )}
        </Accordion.Content>
        <Accordion.Title
          active={activeIndex.includes(1)}
          index={1}
          onClick={handleClick}
        >
          <Icon name="dropdown" />
          <FormattedMessage
            id="Climate impacts"
            defaultMessage="Climate impacts"
          />
        </Accordion.Title>
        <Accordion.Content active={activeIndex.includes(1)}>
          {Object.entries(filters?.impacts || {}).map(
            ([value, label], index) => (
              // <p key={index}>
              <Checkbox
                label={intl.formatMessage({ id: label })}
                checked={activeFilters.impacts.includes(value)}
                value={value}
                name="impacts"
                onChange={checkboxChangeHandler}
              />
              // </p>
            ),
          )}
        </Accordion.Content>
        <Accordion.Title
          active={activeIndex.includes(2)}
          index={2}
          onClick={handleClick}
        >
          <Icon name="dropdown" />
          <FormattedMessage
            id="Key type measures"
            defaultMessage="Key type measures"
          />
        </Accordion.Title>
        <Accordion.Content active={activeIndex.includes(2)}>
          {Object.entries(filters?.measures || {}).map(
            ([key, values], index) => (
              <div className="subcategory">
                <p>
                  <strong>{intl.formatMessage({ id: key })}</strong>
                </p>
                {Object.entries(values).map(([valKey, valData]) => (
                  <Checkbox
                    label={intl.formatMessage({ id: valData.value })}
                    value={valData.key}
                    checked={activeFilters.measures.includes(valData.key)}
                    name="measures"
                    onChange={checkboxChangeHandler}
                  />
                ))}
              </div>
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
    </>
  );
}
