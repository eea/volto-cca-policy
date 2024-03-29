import React from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import RASTAccordionContent from './RASTAccordionContent';
import { useHistory } from 'react-router-dom';

const RASTAccordion = (props) => {
  const { items = {}, curent_location, activeMenu } = props;

  const history = useHistory();

  const handleClick = (e, item) => {
    let itemUrl = '/' + item['@id'].split('/').slice(3).join('/');
    history.push(itemUrl);
  };
  return (
    <>
      {items.map((item, index) => {
        const { id } = item;
        const active = activeMenu === index;

        return (
          <Accordion id={id} key={index} className="secondary">
            <Accordion.Title
              role="button"
              tabIndex={0}
              active={active}
              aria-expanded={active}
              index={index}
              onClick={(e) => handleClick(e, item)}
              onKeyDown={(e) => {
                if (e.keyCode === 13 || e.keyCode === 32) {
                  e.preventDefault();
                  handleClick(e, item);
                }
              }}
            >
              <span className="item-title">{item.title}</span>
              {active ? (
                <Icon className="ri-arrow-up-s-line" />
              ) : (
                <Icon className="ri-arrow-down-s-line" />
              )}
            </Accordion.Title>
            <Accordion.Content active={active}>
              <RASTAccordionContent
                curent_location={curent_location}
                key={index}
                main={{
                  title: item.title,
                  href: item['@id'],
                  url: item.url,
                }}
              />
            </Accordion.Content>
          </Accordion>
        );
      })}
    </>
  );
};

export default RASTAccordion;
