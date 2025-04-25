import React from 'react';
import {
  Tab,
  Message,
  Segment,
  Grid,
  Item,
  ItemGroup,
  ItemContent,
  Image,
} from 'semantic-ui-react';
import { Callout } from '@eeacms/volto-eea-design-system/ui';
import { HTMLField } from '@eeacms/volto-cca-policy/helpers';
import {
  formatTextToHTML,
  extractPlanNameAndURL,
} from '@eeacms/volto-cca-policy/utils';
import AccordionList from './../AccordionList';
import image from '@eeacms/volto-cca-policy/../theme/assets/images/image-narrow.svg';

const ItemsSection = ({ items }) => {
  if (!items?.length) return null;

  return (
    <ItemGroup className="items-group">
      {items.map((sector, index) => (
        <Item key={index}>
          <Image size="small" src={image} />
          <ItemContent verticalAlign="middle">{sector}</ItemContent>
        </Item>
      ))}
    </ItemGroup>
  );
};

const PlanningGoalContent = ({ goal }) => {
  const hasHazards = goal?.Climate_Hazards?.length > 0;
  const hasComments = !!goal?.Comments;
  const hasDescription = !!goal?.Description;

  return (
    <div>
      <Grid columns="12">
        {hasHazards && (
          <Grid.Column mobile={12} tablet={12} computer={6}>
            <h5>{goal.Climate_Hazards_Addressed_Label}</h5>
            <ul>
              {goal.Climate_Hazards.map((hazard, index) => (
                <li key={index}>{hazard}</li>
              ))}
            </ul>
          </Grid.Column>
        )}
        <Grid.Column mobile={12} tablet={12} computer={hasHazards ? 6 : 12}>
          {hasComments && (
            <>
              <h5 className="small-label">{goal.Comments_Label}</h5>
              <Segment>
                <HTMLField value={{ data: formatTextToHTML(goal.Comments) }} />
              </Segment>
            </>
          )}
          {hasDescription && (
            <>
              <h5 className="small-label">{goal.Description_Label}</h5>
              <Segment>
                <HTMLField
                  value={{ data: formatTextToHTML(goal.Description) }}
                />
              </Segment>
            </>
          )}
        </Grid.Column>
      </Grid>
    </div>
  );
};

const PlanningTab = ({ result }) => {
  const {
    planning_goals = [],
    planning_titles = [],
    planning_climate_action = [],
  } = result || {};

  const titleData = planning_titles?.[0];
  const goalData = planning_goals?.[0];

  const sortedGoals = [...planning_goals].sort((a, b) => {
    const aNum = parseInt(a.Adaptation_Goal_Id.replace(/\D/g, ''), 10);
    const bNum = parseInt(b.Adaptation_Goal_Id.replace(/\D/g, ''), 10);
    return aNum - bNum;
  });

  return (
    <Tab.Pane>
      {titleData?.Title && <h2>{titleData.Title}</h2>}
      {titleData?.Abstract_Line && <Callout>{titleData.Abstract_Line}</Callout>}

      {sortedGoals.map((goal, index) => {
        return (
          <div key={index} className="section-wrapper">
            <span className="goal-title-label">{goal?.Title_Label}</span>

            <HTMLField value={{ data: formatTextToHTML(goal?.Title) }} />

            <AccordionList
              variation="tertiary"
              accordions={[
                {
                  title: goal?.More_Details_Label || 'More details',
                  content: <PlanningGoalContent goal={goal} />,
                },
              ]}
            />
          </div>
        );
      })}

      {goalData?.Climate_Action_Title && (
        <h2>{goalData.Climate_Action_Title}</h2>
      )}

      {goalData?.Climate_Action_Abstract && (
        <Callout>{goalData.Climate_Action_Abstract}</Callout>
      )}

      {planning_climate_action.map((action, index) => {
        return (
          <React.Fragment key={index}>
            <br />
            {action?.Sectors_Introduction && (
              <Message>
                <p>{action.Sectors_Introduction}</p>
              </Message>
            )}

            <ItemsSection items={action?.Sectors} />
            {action?.Description && <p>{action.Description}</p>}

            {(action?.Approval_Year || action?.End_Year) && (
              <p>
                {action?.Year_Of_Approval_Label}{' '}
                <strong className="date">{action.Approval_Year}</strong>{' '}
                {action?.End_Year_Of_Plan_Label}{' '}
                <strong className="date">{action.End_Year}</strong>
              </p>
            )}

            {action?.Name_Of_Plan_And_Hyperlink && (
              <p>
                {(() => {
                  const { name, url } = extractPlanNameAndURL(
                    action.Name_Of_Plan_And_Hyperlink,
                  );

                  return url ? (
                    <a href={url} title={name} target="_blank" rel="noreferrer">
                      <strong>
                        {action.Further_Information_Link_Text}
                        {name && ` [${name}]`}
                      </strong>
                    </a>
                  ) : (
                    <strong>
                      {action.Further_Information_Link_Text}
                      {name && ` [${name}]`}
                    </strong>
                  );
                })()}
              </p>
            )}
            {action?.Attachment && (
              <p>
                <a href={action.Attachment}>
                  <strong>{action.Explore_Plan_Link_Text}</strong>
                </a>
              </p>
            )}
          </React.Fragment>
        );
      })}
    </Tab.Pane>
  );
};

export default PlanningTab;
