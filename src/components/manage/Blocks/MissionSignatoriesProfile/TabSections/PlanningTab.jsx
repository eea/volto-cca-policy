import React from 'react';
import { Tab, Message } from 'semantic-ui-react';
import { Callout } from '@eeacms/volto-eea-design-system/ui';
import AccordionList from './../AccordionList';
import ItemsSection from './../ItemsSection';

const PlanningTab = () => {
  return (
    <Tab.Pane>
      <h2>Planning</h2>
      <Callout>
        <p>
          Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
          posuere cubilia curae; Pellentesque sodales, velit nec euismod
          scelerisque, lectus est interdum eros, sit amet bibendum eros sapien
          in magna.
        </p>
      </Callout>
      <div className="section-wrapper">
        <h5>
          <span className="section-number">1. </span>
          Donec in laoreet leo. Quisque suscipit ligula eu turpis dignissim, a
          eleifend ipsum cursus.
        </h5>
        <AccordionList
          variation="secondary"
          accordions={[
            {
              title: 'Vestibulum ante ipsum primis',
              content: 'No additional details provided.',
            },
          ]}
        />
      </div>
      <div className="section-wrapper">
        <h5>
          <span className="section-number">2. </span>
          Donec in laoreet leo. Quisque suscipit ligula eu turpis dignissim, a
          eleifend ipsum cursus.
        </h5>
        <AccordionList
          variation="secondary"
          accordions={[
            {
              title: 'Vestibulum ante ipsum primis',
              content: 'No additional details provided.',
            },
          ]}
        />
      </div>
      <div className="section-wrapper">
        <h5>
          <span className="section-number">3. </span>
          Donec in laoreet leo. Quisque suscipit ligula eu turpis dignissim, a
          eleifend ipsum cursus.
        </h5>
        <AccordionList
          variation="secondary"
          accordions={[
            {
              title: 'Vestibulum ante ipsum primis',
              content: 'No additional details provided.',
            },
          ]}
        />
      </div>
      <h2>
        Quisque suscipit ligula eu turpis dignissim, a eleifend ipsum cursus.
      </h2>

      <Callout>
        <p>
          Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
          posuere cubilia curae; Pellentesque sodales, velit nec euismod
          scelerisque, lectus est interdum eros, sit amet bibendum eros sapien
          in magna.
        </p>
      </Callout>
      <br />
      <Message>
        <p>
          Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
          posuere cubilia curae. Nunc euismod bibendum augue. Cras nec ligula
          velit. Donec in laoreet leo. Quisque suscipit ligula eu turpis
          dignissim, a eleifend ipsum cursus.
        </p>
      </Message>
      <ItemsSection />
      <p>
        Curabitur at felis non libero suscipit fermentum. Duis volutpat, ante et
        scelerisque luctus, sem nulla placerat leo, at aliquet libero justo id
        nulla. Integer at dui nec magna posuere fringilla. Nunc euismod bibendum
        augue. Cras nec ligula velit. Donec in laoreet leo. Quisque suscipit
        ligula eu turpis dignissim, a eleifend ipsum cursus.
      </p>
      <p>
        Year of formal approval of plan: <strong className="date">2023</strong>{' '}
        End year of plan: {''}
        <strong className="date">2030</strong>
      </p>

      <p>
        <a href="/">
          <strong>Nunc euismod bibendum augue</strong>
        </a>
      </p>

      <p>
        <a href="/">
          <strong>
            Donec in laoreet leo. Quisque suscipit ligula eu turpis dignissim
          </strong>
        </a>
      </p>
    </Tab.Pane>
  );
};

export default PlanningTab;
