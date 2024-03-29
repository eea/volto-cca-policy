import React from 'react';
import { Accordion } from 'semantic-ui-react';
import RASTAccordionContent from './RASTAccordionContent';
import { useHistory } from 'react-router-dom';

const RASTAccordion = (props) => {
  const { items = {}, curent_location, activeMenu, show_subfolders } = props;

  const history = useHistory();

  const handleClick = (e, item) => {
    let itemUrl = '/' + item['@id'].split('/').slice(3).join('/');
    history.push(itemUrl);
  };
  console.log('RASTAccordion Show subfolders:', show_subfolders);
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
            </Accordion.Title>
            {show_subfolders ? (
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
            ) : null}
          </Accordion>
        );
      })}
    </>
  );
};

export default RASTAccordion;
