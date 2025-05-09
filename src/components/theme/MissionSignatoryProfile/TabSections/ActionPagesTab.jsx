import React from 'react';
import { Tab, Grid } from 'semantic-ui-react';
import { Callout } from '@eeacms/volto-eea-design-system/ui';
import AccordionList from '../AccordionList';

const ActionsTabContent = ({ action }) => {
  const hasHazards = action?.Climate_Hazards?.length > 0;
  const hasSectors = !!action?.Sectors;
  const hasBenefits = !!action?.Co_Benefits;
  return (
    <>
      <Grid columns="12">
        <Grid.Column mobile={12} tablet={12} computer={6}>
          {hasHazards && (
            <>
              <h5 className="small-label">{action.Hazards_Addressed_Label}</h5>
              <ul>
                {action.Climate_Hazards.map((hazard, index) => (
                  <li key={index}>{hazard}</li>
                ))}
              </ul>
            </>
          )}
          {hasSectors && (
            <>
              <h5 className="small-label">{action.Sectors_Label}</h5>
              <ul>
                {action.Sectors.map((hazard, index) => (
                  <li key={index}>{hazard}</li>
                ))}
              </ul>
            </>
          )}
        </Grid.Column>

        <Grid.Column mobile={12} tablet={12} computer={6}>
          {hasBenefits && (
            <>
              <h5 className="small-label">{action.Co_Benefits_Label}</h5>
              <ul>
                {action.Co_Benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </>
          )}
        </Grid.Column>
      </Grid>
      {action.Funding_Sources && (
        <>
          <br />
          <p>
            <span>{action.Funding_Sources_Label} </span>
            <strong>{action.Funding_Sources}</strong>
          </p>
        </>
      )}
    </>
  );
};

const ActionPagesTab = ({ result }) => {
  const { Title, Abstract, Abstract_Line } = result.action_text?.[0] || [];
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
      {Abstract_Line && <Callout>{Abstract_Line}</Callout>}

      <br />

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
