import React from 'react';
import { Tab, Segment, Grid } from 'semantic-ui-react';
import { Callout } from '@eeacms/volto-eea-design-system/ui';
import AccordionList from './../AccordionList';

const ActionsTabContent = ({ action }) => {
  const hasHazards = action?.Climate_Hazards?.length > 0;
  const hasSectors = !!action?.Sectors;
  const hasDescription = !!action?.Description;
  return (
    <Grid columns="12">
      <Grid.Column mobile={12} tablet={12} computer={6}>
        {hasHazards && (
          <>
            <h5>{action.Hazards_Addressed_Label}</h5>
            <ul>
              {action.Climate_Hazards.map((hazard, index) => (
                <li key={index}>{hazard}</li>
              ))}
            </ul>
          </>
        )}
        {hasSectors && (
          <>
            <h5>{action.Sectors_Label}</h5>
            <ul>
              {action.Sectors.map((hazard, index) => (
                <li key={index}>{hazard}</li>
              ))}
            </ul>
          </>
        )}
      </Grid.Column>

      <Grid.Column mobile={12} tablet={12} computer={hasHazards ? 6 : 12}>
        {hasDescription && (
          <>
            <h5 className="small-label">{action.Description_Label}</h5>
            <Segment>
              {/* <HTMLField
                value={{ data: formatTextToHTML(action.Description) }}
              /> */}
            </Segment>
          </>
        )}
      </Grid.Column>
    </Grid>
  );
};

const ActionPagesTab = ({ result }) => {
  const { Title, Abstract, Abstract_Line } = result.action_text[0] || {};
  const actions = result.actions || [];

  const sortedActions = [...actions].sort((a, b) => {
    const aNum = parseInt(a.Action_Id.replace(/\D/g, ''), 10);
    const bNum = parseInt(b.Action_Id.replace(/\D/g, ''), 10);
    return aNum - bNum;
  });

  return (
    <Tab.Pane>
      {Title && <h2>{Title}</h2>}
      {Abstract && <p>{Abstract}</p>}
      {Abstract_Line && (
        <Callout>
          <p>{Abstract_Line}</p>
        </Callout>
      )}

      {sortedActions.map((action, index) => {
        return (
          <div key={index} className="section-wrapper">
            <h5 className="section-title">
              <span className="section-number">{action.Order}. </span>
              <span>{action?.Action}</span>
            </h5>

            <AccordionList
              variation="tertiary"
              accordions={[
                {
                  title: action?.More_Details_Label || 'More details',
                  content: <ActionsTabContent action={action} />,
                },
              ]}
            />
          </div>
        );
      })}
    </Tab.Pane>
  );
};

export default ActionPagesTab;
