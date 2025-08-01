import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Accordion, List } from 'semantic-ui-react';
import { useIntl, defineMessages } from 'react-intl';
import cx from 'classnames';
import loadable from '@loadable/component';

const ASTLogoMap = loadable(() => import('./ASTLogoMap'));
const UASTLogoMap = loadable(() => import('./UASTLogoMap'));

const messages = defineMessages({
  ast_start_title: {
    id: 'The Adaptation Support Tool - Getting started',
    defaultMessage: 'The Adaptation Support Tool - Getting started',
  },
  uast_start_title: {
    id: 'Getting started',
    defaultMessage: 'Getting started',
  },
});

const sortItems = (items) => {
  const sortedItems = items.sort((a, b) => {
    const idA = a['@id'];
    const idB = b['@id'];
    const stepA = parseInt(a['@id'].split('-').pop());
    const stepB = parseInt(b['@id'].split('-').pop());
    if (idA.includes('check')) return 1;
    if (idB.includes('check')) return -1;
    return stepA - stepB;
  });

  return sortedItems;
};

const groupItemsByStep = (object, isAST, isUAST, lang, intl) => {
  const grouped = {};
  const items = {};

  object.forEach((obj) => {
    const idParts = obj['@id'].split('/');
    const id = idParts[idParts.length - 1];
    const parts = id.split('-');

    if (id.includes('step')) {
      const key = parts.slice(0, -1).join('-');
      const index = parseInt(parts[parts.length - 1]);

      if (!grouped[key]) {
        grouped[key] = {
          '@id': obj['@id'],
          title: obj.title,
          items: [],
        };
      }

      if (index === 0) {
        grouped[key].title = obj.title;
        grouped[key]['@id'] = obj['@id'];
        return;
      } else {
        grouped[key].items.push(obj);
      }
      sortItems(grouped[key].items);
    }
  });

  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    const stepA = parseInt(a.split('-')[1]);
    const stepB = parseInt(b.split('-')[1]);
    return stepA - stepB;
  });

  sortedKeys.forEach((key) => {
    items[key] = grouped[key];
  });

  const astPath = 'knowledge/tools/adaptation-support-tool';

  if (Object.keys(items).length !== 0) {
    if (isAST) {
      items['step-0']['@id'] = `/${lang}/${astPath}`;
      items['step-0'].title = intl.formatMessage(messages.ast_start_title);
    }
    if (isUAST) {
      items['step-0'].title = intl.formatMessage(messages.uast_start_title);
    }
  }
  return items;
};

const ASTAccordion = (props) => {
  const history = useHistory();
  const intl = useIntl();
  const {
    astItems,
    location,
    currentLanguage,
    isAdaptationSupportTool,
    isUrbanAdaptationSupportTool,
  } = props;
  const pathname = location.pathname;
  const items = groupItemsByStep(
    astItems,
    isAdaptationSupportTool,
    isUrbanAdaptationSupportTool,
    currentLanguage,
    intl,
  );

  return (
    <>
      {isAdaptationSupportTool && (
        <ASTLogoMap items={items} pathname={pathname} />
      )}
      {isUrbanAdaptationSupportTool && (
        <UASTLogoMap items={items} pathname={pathname} />
      )}
      <Accordion className="secondary">
        {Object.values(items).map((step, i) => {
          const isActiveStep = pathname === step['@id'];
          const isActiveSubStep = step['items'].some(
            (item) => item['@id'] === pathname,
          );
          const active = isActiveStep || isActiveSubStep ? true : false;
          return (
            <React.Fragment key={i}>
              <Accordion.Title
                role="button"
                tabIndex={0}
                active={active}
                aria-expanded={active}
                onClick={(e) => history.push(step['@id'])}
                onKeyDown={(e) => {
                  if (e.keyCode === 13 || e.keyCode === 32) {
                    e.preventDefault();
                    history.push(step['@id']);
                  }
                }}
              >
                <span className="item-title">{step.title}</span>
              </Accordion.Title>
              <Accordion.Content active={active}>
                <List>
                  {step['items'].map((item, i) => {
                    const active = pathname === item['@id'];
                    return (
                      <List.Item
                        key={i}
                        className={cx('substep', {
                          active: active,
                        })}
                      >
                        <Link to={item['@id']}>{item.title}</Link>
                      </List.Item>
                    );
                  })}
                </List>
              </Accordion.Content>
            </React.Fragment>
          );
        })}
      </Accordion>
    </>
  );
};

export default ASTAccordion;
