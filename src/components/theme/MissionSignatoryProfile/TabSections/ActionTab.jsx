import { Tab, Grid } from 'semantic-ui-react';
import { Callout } from '@eeacms/volto-eea-design-system/ui';
import { HTMLField } from '@eeacms/volto-cca-policy/helpers';
import { formatTextToHTML, isEmpty } from '@eeacms/volto-cca-policy/utils';
import AccordionList from '../AccordionList';
import NoDataReported from '../NoDataReported';
import ItemsSection from '../ItemsSection';

const ActionTabContent = ({ action }) => {
  const hasHazards = action?.Climate_Hazards?.length > 0;
  const hasSectors = action?.Sectors?.length > 0;
  const hasBenefits = action?.Co_Benefits?.length > 0;

  return (
    <>
      <Grid columns="12">
        <Grid.Column mobile={12} tablet={12} computer={hasBenefits ? 6 : 9}>
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

              {action.Sectors.some((s) => s.Icon) ? (
                <ItemsSection
                  items={action.Sectors}
                  field="Sector"
                  iconPath="sector"
                />
              ) : (
                <ul>
                  {action.Sectors.map((item, index) => (
                    <li key={index}>{item.Sector}</li>
                  ))}
                </ul>
              )}
            </>
          )}
        </Grid.Column>

        {hasBenefits && (
          <Grid.Column mobile={12} tablet={12} computer={6}>
            <>
              <h5 className="small-label">{action.Co_Benefits_Label}</h5>
              <ul>
                {action.Co_Benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </>
          </Grid.Column>
        )}
      </Grid>
      {action.Funding_Sources && (
        <div className="funding-sources">
          <span>{action.Funding_Sources_Label} </span>
          <strong>
            <HTMLField
              value={{ data: formatTextToHTML(action.Funding_Sources) }}
            />
          </strong>
        </div>
      )}
    </>
  );
};

const ActionTab = ({ result, general_text }) => {
  const { action_text, actions } = result || {};
  const { No_Data_Reported_Label } = general_text || {};
  const { Title, Abstract, Abstract_Line } = action_text?.[0] || {};

  const sortedActions = [...(actions || [])].sort((a, b) => a.Order - b.Order);

  const NoResults = isEmpty(action_text) && isEmpty(actions);

  if (NoResults) {
    return <NoDataReported label={No_Data_Reported_Label} />;
  }

  return (
    <Tab.Pane className="action-tab">
      {Title && <h2>{Title}</h2>}
      {Abstract && <HTMLField value={{ data: formatTextToHTML(Abstract) }} />}
      {Abstract_Line && (
        <Callout>
          <HTMLField value={{ data: formatTextToHTML(Abstract_Line) }} />
        </Callout>
      )}

      {sortedActions?.map((action, index) => {
        return (
          <div key={index} className="section-wrapper">
            <h5 className="section-title">
              <span className="section-number">{action?.Order}. </span>
              <HTMLField value={{ data: formatTextToHTML(action?.Action) }} />
            </h5>

            <AccordionList
              variation="secondary"
              accordions={[
                {
                  title: action?.More_Details_Label,
                  content: <ActionTabContent action={action} />,
                },
              ]}
            />
          </div>
        );
      })}
    </Tab.Pane>
  );
};

export default ActionTab;
