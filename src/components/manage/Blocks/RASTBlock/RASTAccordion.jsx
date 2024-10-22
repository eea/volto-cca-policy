import React from 'react';
import { Accordion } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import { Icon } from '@plone/volto/components';

import RASTAccordionContent from './RASTAccordionContent';

import step1 from './icons/icon_01.svg';
import step2 from './icons/icon_02.svg';
import step3 from './icons/icon_03.svg';
import step4 from './icons/icon_04.svg';
import step5 from './icons/icon_05.svg';
import step6 from './icons/icon_06.svg';

const icons = [step1, step2, step3, step4, step5, step6];

const RASTAccordion = ({
  items = [],
  activeMenu,
  show_subfolders,
  curent_location,
}) => {
  const history = useHistory();

  const handleNavigation = (url) => {
    history.push(url);
  };

  const handleKeyDown = (e, url) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNavigation(url);
    }
  };

  const renderAccordionItem = (item, index) => {
    const active = activeMenu === index;
    // Icons start from the second item
    const icon = icons[index - 1] || null;

    return (
      <Accordion key={item.id} className={`step-${index}`}>
        <Accordion.Title
          role="button"
          tabIndex={0}
          index={index}
          active={active}
          aria-expanded={active}
          onClick={() => handleNavigation(item.url)}
          onKeyDown={(e) => handleKeyDown(e, item.url)}
        >
          {icon && <Icon name={icon} size="70px" />}
          <span className="item-title">{item.title}</span>
        </Accordion.Title>

        {show_subfolders && (
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
        )}
      </Accordion>
    );
  };

  return <>{items.map(renderAccordionItem)}</>;
};

export default RASTAccordion;
