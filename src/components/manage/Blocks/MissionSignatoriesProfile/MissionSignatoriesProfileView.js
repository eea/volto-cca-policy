import React from 'react';
import {
  Tab,
  AccordionTitle,
  AccordionContent,
  Accordion,
  Icon,
} from 'semantic-ui-react';
import { Callout } from '@eeacms/volto-eea-design-system/ui';

export default function MissionSignatoriesProfileView(props) {
  const { data } = props;
  const result = data?._v_results?.[0] || {};
  // const dataJson = JSON.parse(result?.Cooperation_Experience);

  const [activeAccIndex, setActiveAccIndex] = React.useState(-1);

  function handleAccClick(e, titleProps) {
    const { index } = titleProps;
    const newIndex = activeAccIndex === index ? -1 : index;

    setActiveAccIndex(newIndex);
  }

  return (
    <>
      <div>
        {/* {
          dataJson['Cooperation_Experience'][0][
            'DescribeDetailCooperationEnhance'
          ]
        } */}
        <h1>{result?.Signatory}</h1>
        <Tab
          menu={{
            fluid: true,
            className: 'secondary',
            vertical: true,
            pointing: true,
          }}
          grid={{ paneWidth: 9, tabWidth: 3, stackable: true }}
          onTabChange={() => {}}
          panes={[
            {
              menuItem: 'Introduction',
              render: () => (
                <Tab.Pane>
                  <h2>Introduction</h2>
                  <p>
                    Nullam quis arcu in magna pulvinar tincidunt. Lorem ipsum
                    dolor sit amet, consectetur adipiscing elit. Nam hendrerit
                    nulla ut cursus laoreet. Nullam elementum lorem vel
                    facilisis laoreet. Cras ac turpis vel erat vehicula
                    venenatis.
                  </p>
                </Tab.Pane>
              ),
            },
            {
              menuItem: 'Governance',
              render: () => (
                <Tab.Pane>
                  <h2>Governance</h2>
                  <Callout>
                    <p>
                      Etiam id velit feugiat, scelerisque velit a, scelerisque
                      nunc. Vestibulum ante ipsum primis in faucibus orci luctus
                      et ultrices posuere cubilia curae; Integer dignissim risus
                      non nibh scelerisque, sit amet tincidunt sapien rutrum.
                    </p>
                  </Callout>

                  <h3>Opportunities and benefits of climate action</h3>
                  <p>{result?.Describe}</p>

                  <Accordion>
                    <AccordionTitle
                      active={activeAccIndex === 0}
                      index={0}
                      onClick={handleAccClick}
                    >
                      <Icon
                        name={
                          activeAccIndex
                            ? 'ri-arrow-down-s-line'
                            : 'ri-arrow-up-s-line'
                        }
                      />
                      Further details and evidence
                    </AccordionTitle>
                    <AccordionContent active={activeAccIndex === 0}>
                      <p>{result?.Provide}</p>
                    </AccordionContent>
                  </Accordion>
                </Tab.Pane>
              ),
            },
            {
              menuItem: 'Assessment',
              render: () => (
                <Tab.Pane>
                  <h2>Assessment</h2>
                  <p>
                    Etiam accumsan urna a mauris dapibus, nec aliquet nunc
                    convallis. Phasellus eget justo et libero ultrices posuere.
                    Cras euismod, arcu nec congue convallis, ipsum nunc cursus
                    nibh, vel condimentum sapien orci non libero. Integer
                    ullamcorper felis sit amet felis placerat, eu convallis
                    lorem iaculis.
                  </p>
                </Tab.Pane>
              ),
            },
            {
              menuItem: 'Planning',
              render: () => (
                <Tab.Pane>
                  <h2>Planning</h2>
                  <p>
                    Suspendisse potenti. Vivamus non arcu tincidunt, congue
                    massa at, porttitor velit. Curabitur lacinia nisl ut turpis
                    convallis, at dictum urna aliquet. Nullam non urna eget
                    felis interdum feugiat. Morbi vel neque elit. Nullam a
                    luctus leo. Integer maximus sapien in bibendum scelerisque.
                  </p>
                </Tab.Pane>
              ),
            },
            {
              menuItem: 'Action Pages',
              render: () => (
                <Tab.Pane>
                  <h2>Action PAges</h2>
                  <p>
                    Phasellus ac eros at urna condimentum lacinia. Pellentesque
                    habitant morbi tristique senectus et netus et malesuada
                    fames ac turpis egestas. Sed bibendum, sapien a venenatis
                    fermentum, mauris augue cursus turpis, vitae elementum massa
                    orci sit amet massa. In hac habitasse platea dictumst.
                  </p>
                </Tab.Pane>
              ),
            },
          ]}
        />
      </div>
    </>
  );
}
