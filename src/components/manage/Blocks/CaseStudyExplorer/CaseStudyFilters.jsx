import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Accordion, Icon } from 'semantic-ui-react';

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
              <p key={index}>
                <span>{intl.formatMessage({ id: label })}</span>
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
              <p key={index}>
                <span>{intl.formatMessage({ id: label })}</span>
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
                  <strong>AA{intl.formatMessage({ id: key })}</strong>
                </p>
                {Object.entries(values).map(([valKey, valData]) => (
                  <p key={valData.key}>
                    <span>{intl.formatMessage({ id: valData.value })}</span>
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
