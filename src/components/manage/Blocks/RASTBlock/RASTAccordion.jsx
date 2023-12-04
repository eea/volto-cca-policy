import React from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import RASTAccordionContent from './RASTAccordionContent';

const RASTAccordion = (props) => {
  const { datasets = {}, activeMenu } = props;

  const [activeIndex, setActiveIndex] = React.useState([activeMenu]);

  const handleActiveIndex = (index) => {
    setActiveIndex(index);
  };
  const handleClick = (e, titleProps) => {
    const { index, id, item } = titleProps;

    const newIndex =
      activeIndex.indexOf(index) === -1
        ? [...activeIndex, index]
        : activeIndex.filter((item) => item !== index);

    handleActiveIndex(newIndex);
  };
  const isActive = (id) => {
    return activeIndex.includes(id);
  };
  return (
    <>
      {datasets.map((dataset, index) => {
        const { id } = dataset;
        const active = isActive(index);
        let datasetPath = '/' + dataset.href.split('/').slice(3).join('/');

        return (
          <>
            <Accordion id={id} key={index} className="secondary">
              <Accordion.Title
                role="button"
                tabIndex={0}
                active={active}
                aria-expanded={active}
                index={index}
                onClick={(e) => handleClick(e, { index, id, dataset })}
                onKeyDown={(e) => {
                  if (e.keyCode === 13 || e.keyCode === 32) {
                    e.preventDefault();
                    handleClick(e, { index, id, dataset });
                  }
                }}
              >
                <span className="dataset-title">{dataset.title}</span>
                {active ? (
                  <Icon className="ri-arrow-up-s-line" />
                ) : (
                  <Icon className="ri-arrow-down-s-line" />
                )}
              </Accordion.Title>
              <Accordion.Content active={active}>
                <RASTAccordionContent
                  key={index}
                  params={{
                    name: 'CurrentTitle',
                    includeTop: false,
                    currentFolderOnly: true,
                    topLevel: 3,
                    bottomLevel: 6,
                    rootPath: datasetPath,
                    title: dataset.title,
                  }}
                  location={{ pathname: datasetPath }}
                  main={{ title: dataset.title, href: dataset['@id'] }}
                />
              </Accordion.Content>
            </Accordion>
          </>
        );
      })}
    </>
  );
};

export default RASTAccordion;
