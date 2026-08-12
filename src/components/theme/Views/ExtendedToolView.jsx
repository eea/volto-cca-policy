import { Button, Container, Grid, Icon } from 'semantic-ui-react';
import {
  BooleanField,
  CompareToolsPanel,
  ContentMetadata,
  DocumentsList,
  HTMLField,
  ItemLogo,
  PortalMessage,
  TextField,
  VocabularyField,
} from '@eeacms/volto-cca-policy/components';
import { defineMessages, useIntl } from 'react-intl';
import BodyClass from '@plone/volto/helpers/BodyClass/BodyClass';
import { useCompareTools } from '../CompareTools/utils';
import { formatFunctionalityScore } from '../../Search/NavigatorCatalogue/utils';

const ExtendedToolView = (props) => {
  const { content = {} } = props;
  const {
    title = '',
    long_description,
    tool_provider,
    hyperlink,
    description,
    only_interactive_support_tool,
    adaptation_cycle_step,
    updating_cycle_of_the_tool,
    language_accessibility,
    free_access,
    intended_user_groups,
    place_of_implementation,
    type_of_data,
    data_sources,
    license_status,
    user_support_provisions,
    tool_validation_use,
    number_of_users_tool,
    tool_provider_mode,
    adaptation_support_cycle_step,
    tool_available_english,
    tool_available_language,
    type_of_outputs,
    temporality_of_data,
    spatial_resolution,
    underlying_data_maintenance,
    accessibility_and_usability,
    functionality,
    strengths_and_possible_limitations,
  } = content;

  console.log('ExtendedToolView content:', content);

  const availableLanguageValues = [];
  if (tool_available_english) {
    availableLanguageValues.push('English');
  }
  if (tool_available_language) {
    availableLanguageValues.push(tool_available_language);
  }
  const availableLanguageText = availableLanguageValues.join(', ');
  const hasHyperlink = Boolean(hyperlink && hyperlink.length > 0);
  const hasCompareTool = Boolean(content.UID);

  // const item_title = acronym ? title + ' (' + acronym + ')' : title;
  const compareTool = {
    uid: content.UID,
    title,
    href: content['@id'],
  };
  const { isSelected, isLimitReached, toggle } = useCompareTools(compareTool);

  const messages = defineMessages({
    yes: { id: 'Yes', defaultMessage: 'Yes' },
    no: { id: 'No', defaultMessage: 'No' },
    intended_user_groups: {
      id: 'Intended User Groups',
      defaultMessage: 'Intended User Groups',
    },
    tool_provider: { id: 'Tool provider', defaultMessage: 'Tool provider' },
    only_interactive_support_tool: {
      id: 'Only online interactive support tool',
      defaultMessage: 'Only online interactive support tool',
    },
    adaptation_cycle_step: {
      id: 'Supports ≥1 adaptation cycle step',
      defaultMessage: 'Supports ≥1 adaptation cycle step',
    },
    updating_cycle_of_the_tool: {
      id: 'Updating cycle of the tool',
      defaultMessage: 'Updating cycle of the tool',
    },
    language_accessibility: {
      id: 'Language Accessibility',
      defaultMessage: 'Language Accessibility',
    },
    free_access: {
      id: 'Free [full or core functionality] access',
      defaultMessage: 'Free [full or core functionality] access',
    },
    place_of_implementation: {
      id: 'Place of implementation',
      defaultMessage: 'Place of implementation',
    },
    type_of_data: { id: 'Type of data', defaultMessage: 'Type of data' },
    data_sources: { id: 'Data sources', defaultMessage: 'Data sources' },
    license_status: { id: 'License status', defaultMessage: 'License status' },
    user_support_provisions: {
      id: 'User support provisions',
      defaultMessage: 'User support provisions',
    },
    tool_validation_use: {
      id: 'Tool validation use',
      defaultMessage: 'Tool validation use',
    },
    number_of_users_tool: {
      id: 'Number of users / uptake',
      defaultMessage: 'Number of users / uptake',
    },
    tool_provider_mode: {
      id: 'Tool provider mode',
      defaultMessage: 'Tool provider mode',
    },
    adaptation_support_cycle_step: {
      id: 'Adaptation Support Cycle Step',
      defaultMessage: 'Adaptation Support Cycle Step',
    },
    tool_available_language: {
      id: 'Available language',
      defaultMessage: 'Available language',
    },
    type_of_outputs: {
      id: 'Type of outputs',
      defaultMessage: 'Type of outputs',
    },
    temporality_of_data: {
      id: 'Temporality of data',
      defaultMessage: 'Temporality of data',
    },
    nature_based_solution: {
      id: 'Nature-based solution',
      defaultMessage: 'Nature-based solution',
    },
    just_resilience: {
      id: 'Just resilience',
      defaultMessage: 'Just resilience',
    },
    cost_benefit_ratio: {
      id: 'Cost-benefit ratio',
      defaultMessage: 'Cost-benefit ratio',
    },
    accessibility_and_usability: {
      id: 'Accessibility and usability',
      defaultMessage: 'Accessibility and usability',
    },
    functionality: { id: 'Functionality', defaultMessage: 'Functionality' },
    strengths_and_possible_limitations: {
      id: 'Strengths and possible limitations of the tool',
      defaultMessage: 'Strengths and possible limitations of the tool',
    },
    spatial_resolution: {
      id: 'Spatial resolution',
      defaultMessage: 'Spatial resolution',
    },
    underlying_data_maintenance: {
      id: 'Underlying data maintenance',
      defaultMessage: 'Underlying data maintenance',
    },
    addToComparison: {
      id: 'Add to comparison',
      defaultMessage: 'Add to comparison',
    },
    openTool: {
      id: 'Open tool',
      defaultMessage: 'Open tool',
    },
    share: {
      id: 'Share',
      defaultMessage: 'Share',
    },
    linkCopied: {
      id: 'Link copied',
      defaultMessage: 'Link copied',
    },
  });
  const intl = useIntl();

  return (
    <div className="db-item-view">
      <BodyClass className="extended-tool-view" />
      <Container>
        <div className="extended-tool-header">
          <p className="extended-tool-provider">{tool_provider}</p>
          <h1 className="extended-tool-title">{title}</h1>
          {(hasHyperlink || hasCompareTool) && (
            <div className="extended-tool-compare-action">
              {hasHyperlink && (
                <Button
                  as="a"
                  icon
                  secondary
                  href={hyperlink}
                  target="_blank"
                  rel="noopener noreferrer"
                  labelPosition="right"
                >
                  {intl.formatMessage(messages.openTool)}
                  <Icon className="ri-external-link-line" />
                </Button>
              )}
              {hasCompareTool && (
                <Button
                  primary
                  inverted
                  disabled={isSelected || isLimitReached}
                  aria-pressed={isSelected}
                  onClick={toggle}
                >
                  <Icon className="ri-layout-column-line" />
                  {intl.formatMessage(messages.addToComparison)}
                </Button>
              )}
            </div>
          )}
        </div>
        <CompareToolsPanel />
        <PortalMessage content={content} />
        <Grid columns="12">
          <Grid.Row>
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={8}
              className="col-left"
            >
              <ItemLogo {...props} />

              <HTMLField value={long_description} />
              <HTMLField value={description} />
              <BooleanField
                label={intl.formatMessage(
                  messages.only_interactive_support_tool,
                )}
                value={only_interactive_support_tool}
                yesLabel={intl.formatMessage(messages.yes)}
                noLabel={intl.formatMessage(messages.no)}
              />
              <BooleanField
                label={intl.formatMessage(messages.adaptation_cycle_step)}
                value={adaptation_cycle_step}
                yesLabel={intl.formatMessage(messages.yes)}
                noLabel={intl.formatMessage(messages.no)}
              />
              <BooleanField
                label={intl.formatMessage(messages.updating_cycle_of_the_tool)}
                value={updating_cycle_of_the_tool}
                yesLabel={intl.formatMessage(messages.yes)}
                noLabel={intl.formatMessage(messages.no)}
              />
              <BooleanField
                label={intl.formatMessage(messages.language_accessibility)}
                value={language_accessibility}
                yesLabel={intl.formatMessage(messages.yes)}
                noLabel={intl.formatMessage(messages.no)}
              />
              <BooleanField
                label={intl.formatMessage(messages.free_access)}
                value={free_access}
                yesLabel={intl.formatMessage(messages.yes)}
                noLabel={intl.formatMessage(messages.no)}
              />
              <VocabularyField
                label={intl.formatMessage(messages.intended_user_groups)}
                values={intended_user_groups}
              />
              <VocabularyField
                label={intl.formatMessage(messages.place_of_implementation)}
                values={place_of_implementation}
              />
              <VocabularyField
                label={intl.formatMessage(messages.type_of_data)}
                values={type_of_data}
              />
              <VocabularyField
                label={intl.formatMessage(messages.data_sources)}
                values={data_sources}
              />
              <VocabularyField
                label={intl.formatMessage(messages.license_status)}
                values={license_status}
              />
              <VocabularyField
                label={intl.formatMessage(messages.user_support_provisions)}
                values={user_support_provisions}
              />
              <VocabularyField
                label={intl.formatMessage(messages.tool_validation_use)}
                values={tool_validation_use}
              />
              <VocabularyField
                label={intl.formatMessage(messages.number_of_users_tool)}
                values={number_of_users_tool}
              />
              <VocabularyField
                label={intl.formatMessage(messages.tool_provider_mode)}
                values={tool_provider_mode}
              />
              <VocabularyField
                asList
                label={intl.formatMessage(
                  messages.adaptation_support_cycle_step,
                )}
                values={adaptation_support_cycle_step}
              />
              <TextField
                label={intl.formatMessage(messages.tool_available_language)}
                value={availableLanguageText}
              />
              <VocabularyField
                label={intl.formatMessage(messages.type_of_outputs)}
                values={type_of_outputs}
              />
              <VocabularyField
                label={intl.formatMessage(messages.temporality_of_data)}
                values={temporality_of_data}
              />
              <TextField
                label={intl.formatMessage(messages.spatial_resolution)}
                value={spatial_resolution}
              />
              <TextField
                label={intl.formatMessage(messages.functionality)}
                value={
                  functionality === null || functionality === undefined
                    ? null
                    : formatFunctionalityScore(functionality)
                }
              />
              <TextField
                label={intl.formatMessage(messages.underlying_data_maintenance)}
                value={underlying_data_maintenance}
              />
              <VocabularyField
                label={intl.formatMessage(messages.accessibility_and_usability)}
                values={
                  accessibility_and_usability
                    ? [accessibility_and_usability]
                    : []
                }
              />
              <TextField
                label={intl.formatMessage(
                  messages.strengths_and_possible_limitations,
                )}
                value={strengths_and_possible_limitations}
              />
            </Grid.Column>
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={4}
              className="col-right"
            >
              <ContentMetadata {...props} />
              <DocumentsList {...props} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

export default ExtendedToolView;
