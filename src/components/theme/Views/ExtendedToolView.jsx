import { Button, Container, Grid, Icon } from 'semantic-ui-react';
import { PortalMessage } from '@eeacms/volto-cca-policy/components';
import {
  HTMLField,
  ContentMetadata,
  ItemLogo,
  DocumentsList,
  ExternalLink,
} from '@eeacms/volto-cca-policy/helpers';
import { defineMessages, useIntl } from 'react-intl';
import config from '@plone/volto/registry';
import {
  CompareToolsPanel,
  useCompareTools,
} from '../../Search/NavigatorCatalogue/CompareToolsPanel';

const ExtendedToolView = (props) => {
  const { content } = props;
  const {
    title,
    acronym,
    long_description,
    tool_provider,
    public_private_mode,
    hyperlink,
    description,
    coder_1,
    coder_2,
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
    // nature_based_solution,
    // just_resilience,
    // cost_benefit_ratio,
    accessibility_and_usability,
    functionality,
    strengths_and_possible_limitations,
  } = content;

  let tool_available_language_list = [];
  if (tool_available_english) {
    tool_available_language_list.push('English');
  }
  if (tool_available_language) {
    tool_available_language_list.push(tool_available_language);
  }

  const item_title = acronym ? title + ' (' + acronym + ')' : title;
  const compareTool = {
    uid: content.UID,
    title,
    href: content['@id'],
  };
  const { isSelected, isLimitReached, toggle } = useCompareTools(compareTool);

  const messages = defineMessages({
    yes: { id: 'YES', defaultMessage: 'YES' },
    no: { id: 'NO', defaultMessage: 'NO' },
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
      id: 'Supports ≥1 adaptation cycle step ',
      defaultMessage: 'Supports ≥1 adaptation cycle step ',
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
      id: 'Free [full or core functionality] access ',
      defaultMessage: 'Free [full or core functionality] access ',
    },
    place_of_implementation: {
      id: 'Place of implementation',
      defaultMessage: 'Place of implementation',
    },
    type_of_data: { id: 'Type of data', defaultMessage: 'Type of data' },
    data_sources: { id: 'Data sources', defaultMessage: 'Data sources' },
    license_status: { id: 'License status', defaultMessage: 'License status' },
    user_support_provisions: {
      id: 'User support provisions ',
      defaultMessage: 'User support provisions ',
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
      id: 'Tool provider',
      defaultMessage: 'Tool provider',
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
    public_private_mode: {
      id: 'Public/private',
      defaultMessage: 'Public/private',
    },
    spatial_resolution: {
      id: 'Spatial resolution',
      defaultMessage: 'Spatial resolution',
    },
    underlying_data_maintenance: {
      id: 'Underlying data maintenance',
      defaultMessage: 'Underlying data maintenance',
    },
    hyperlink: { id: 'Tool hyperlink', defaultMessage: 'Tool hyperlink' },
    addToComparison: {
      id: 'Add to comparison',
      defaultMessage: 'Add to comparison',
    },
  });
  const intl = useIntl();
  const {
    blocks: { blocksConfig },
  } = config;
  const TitleBlockView = blocksConfig?.title?.view;
  const titleBlockData = { ...content, title: item_title, image: '' };

  return (
    <div className="db-item-view">
      <TitleBlockView
        {...props}
        data={{
          '@type': 'title',
          info: [{ description: '' }],
          hideContentType: true,
          hideCreationDate: true,
          hideModificationDate: true,
          hidePublishingDate: true,
          hideDownloadButton: false,
          hideShareButton: false,
          subtitle: 'Tool',
        }}
        metadata={titleBlockData}
        properties={titleBlockData}
      />
      <Container>
        {content.UID && (
          <div className="extended-tool-compare-action">
            <Button
              primary
              icon
              disabled={isSelected || isLimitReached}
              aria-pressed={isSelected}
              onClick={toggle}
            >
              <Icon className="ri-add-line" />
              <span>{intl.formatMessage(messages.addToComparison)}</span>
            </Button>
          </div>
        )}
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
              {tool_provider && tool_provider.length > 0 && (
                <>
                  <h4>{intl.formatMessage(messages.tool_provider)}</h4>
                  <p>{tool_provider}</p>
                </>
              )}
              {public_private_mode && public_private_mode.length > 0 && (
                <>
                  <h5>{intl.formatMessage(messages.public_private_mode)}</h5>
                  <p>{public_private_mode}</p>
                </>
              )}
              <HTMLField value={description} />
              {coder_1 && coder_1.length > 0 && (
                <>
                  <h5>Coder1</h5>
                  <p>{coder_1}</p>
                </>
              )}
              {coder_2 && coder_2.length > 0 && (
                <>
                  <h5>Coder2</h5>
                  <p>{coder_2}</p>
                </>
              )}
              <h5>
                {intl.formatMessage(messages.only_interactive_support_tool)}
              </h5>
              {only_interactive_support_tool
                ? intl.formatMessage(messages.yes)
                : intl.formatMessage(messages.no)}
              <h5>{intl.formatMessage(messages.adaptation_cycle_step)}</h5>
              {adaptation_cycle_step
                ? intl.formatMessage(messages.yes)
                : intl.formatMessage(messages.no)}
              <h5>{intl.formatMessage(messages.updating_cycle_of_the_tool)}</h5>
              {updating_cycle_of_the_tool
                ? intl.formatMessage(messages.yes)
                : intl.formatMessage(messages.no)}
              <h5>{intl.formatMessage(messages.language_accessibility)}</h5>
              {language_accessibility
                ? intl.formatMessage(messages.yes)
                : intl.formatMessage(messages.no)}
              <h5>{intl.formatMessage(messages.free_access)}</h5>
              {free_access
                ? intl.formatMessage(messages.yes)
                : intl.formatMessage(messages.no)}
              {hyperlink && hyperlink.length > 0 && (
                <>
                  <h5>{intl.formatMessage(messages.hyperlink)}</h5>
                  <ExternalLink url={hyperlink} text={hyperlink} />
                </>
              )}
              {intended_user_groups && intended_user_groups.length > 0 && (
                <>
                  <h5>{intl.formatMessage(messages.intended_user_groups)}</h5>
                  {intended_user_groups.map((item) => item.title).join(', ')}
                </>
              )}
              {place_of_implementation &&
                place_of_implementation.length > 0 && (
                  <>
                    <h5>
                      {intl.formatMessage(messages.place_of_implementation)}
                    </h5>
                    {place_of_implementation
                      .map((item) => item.title)
                      .join(', ')}
                  </>
                )}
              {type_of_data && type_of_data.length > 0 && (
                <>
                  <h5>{intl.formatMessage(messages.type_of_data)}</h5>
                  {type_of_data.map((item) => item.title).join(', ')}
                </>
              )}
              {data_sources && data_sources.length > 0 && (
                <>
                  <h5>{intl.formatMessage(messages.data_sources)}</h5>
                  {data_sources.map((item) => item.title).join(', ')}
                </>
              )}
              {license_status && license_status.length > 0 && (
                <>
                  <h5>{intl.formatMessage(messages.license_status)}</h5>
                  {license_status.map((item) => item.title).join(', ')}
                </>
              )}
              {user_support_provisions &&
                user_support_provisions.length > 0 && (
                  <>
                    <h5>
                      {intl.formatMessage(messages.user_support_provisions)}
                    </h5>
                    {user_support_provisions
                      .map((item) => item.title)
                      .join(', ')}
                  </>
                )}
              {tool_validation_use && tool_validation_use.length > 0 && (
                <>
                  <h5>{intl.formatMessage(messages.tool_validation_use)}</h5>
                  {tool_validation_use.map((item) => item.title).join(', ')}
                </>
              )}
              {number_of_users_tool && number_of_users_tool.length > 0 && (
                <>
                  <h5>{intl.formatMessage(messages.number_of_users_tool)}</h5>
                  {number_of_users_tool.map((item) => item.title).join(', ')}
                </>
              )}
              {tool_provider_mode && tool_provider_mode.length > 0 && (
                <>
                  <h5>{intl.formatMessage(messages.tool_provider_mode)}</h5>
                  {tool_provider_mode.map((item) => item.title).join(', ')}
                </>
              )}
              {adaptation_support_cycle_step &&
                adaptation_support_cycle_step.length > 0 && (
                  <>
                    <h5>
                      {intl.formatMessage(
                        messages.adaptation_support_cycle_step,
                      )}
                    </h5>
                    {adaptation_support_cycle_step
                      .map((item) => item.title)
                      .join(', ')}
                  </>
                )}
              <h5>{intl.formatMessage(messages.tool_available_language)}</h5>
              {tool_available_language_list.join(', ')}
              {type_of_outputs && type_of_outputs.length > 0 && (
                <>
                  <h5>{intl.formatMessage(messages.type_of_outputs)}</h5>
                  {type_of_outputs.map((item) => item.title).join(', ')}
                </>
              )}
              <h5>{intl.formatMessage(messages.tool_available_language)}</h5>
              {tool_available_english ? 'English' : tool_available_language}
              {temporality_of_data && temporality_of_data.length > 0 && (
                <>
                  <h5>{intl.formatMessage(messages.temporality_of_data)}</h5>
                  {temporality_of_data.map((item) => item.title).join(', ')}
                </>
              )}
              {spatial_resolution && spatial_resolution.length > 0 && (
                <p>
                  <strong>
                    {intl.formatMessage(messages.spatial_resolution)}
                  </strong>
                  {spatial_resolution}
                </p>
              )}
              <h5>{intl.formatMessage(messages.functionality)}</h5>
              <p>{functionality}</p>
              {underlying_data_maintenance && (
                <>
                  <p>
                    <strong>
                      {intl.formatMessage(messages.underlying_data_maintenance)}
                    </strong>
                  </p>
                  <p>{underlying_data_maintenance}</p>
                </>
              )}
              {accessibility_and_usability && (
                <>
                  <p>
                    <strong>
                      {intl.formatMessage(messages.accessibility_and_usability)}
                    </strong>
                  </p>
                  <p>{accessibility_and_usability.title}</p>
                </>
              )}
              {strengths_and_possible_limitations && (
                <>
                  <p>
                    <strong>
                      {intl.formatMessage(
                        messages.strengths_and_possible_limitations,
                      )}
                    </strong>
                  </p>
                  <p>{strengths_and_possible_limitations}</p>
                </>
              )}
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
