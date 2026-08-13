import { useEffect } from 'react';
import { Button, Container, Grid, Icon, Segment } from 'semantic-ui-react';
import {
  CompareToolsPanel,
  HTMLField,
  MetadataItemList,
  PortalMessage,
  TextField,
  VocabularyField,
} from '@eeacms/volto-cca-policy/components';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import BodyClass from '@plone/volto/helpers/BodyClass/BodyClass';
import useClipboard from '@plone/volto/hooks/clipboard/useClipboard';
import { useCompareTools } from '../CompareTools/utils';
import { formatFunctionalityScore } from '../../Search/NavigatorCatalogue/utils';

const ExtendedToolView = (props) => {
  const { content = {} } = props;
  const {
    title = '',
    long_description,
    climate_impacts,
    sectors,
    tool_provider,
    hyperlink,
    intended_user_groups,
    place_of_implementation,
    data_sources,
    license_status,
    user_support_provisions,
    tool_validation_use,
    number_of_users_tool,
    adaptation_support_cycle_step,
    type_of_outputs,
    temporality_of_data,
    spatial_resolution,
    underlying_data_maintenance,
    accessibility_and_usability,
    functionality,
    strengths_and_possible_limitations,
  } = content;

  const hasHyperlink = Boolean(hyperlink && hyperlink.length > 0);
  const hasCompareTool = Boolean(content.UID);

  const compareTool = {
    uid: content.UID,
    title,
    href: content['@id'],
  };
  const { isSelected, isLimitReached, toggle } = useCompareTools(compareTool);
  const shareUrl = content['@id'];
  const [isLinkCopied, copyShareUrl, setIsLinkCopied] = useClipboard(shareUrl);

  useEffect(() => {
    if (!isLinkCopied) return undefined;

    const timeout = setTimeout(() => setIsLinkCopied(false), 6000);

    return () => clearTimeout(timeout);
  }, [isLinkCopied, setIsLinkCopied]);

  const messages = defineMessages({
    intended_user_groups: {
      id: 'Intended User Groups',
      defaultMessage: 'Intended User Groups',
    },
    place_of_implementation: {
      id: 'Place of implementation',
      defaultMessage: 'Place of implementation',
    },
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
    <div className="extended-tool-view">
      <BodyClass className="extended-tool" />
      <Container>
        <div className="extended-tool-header">
          <p className="extended-tool-provider">{tool_provider}</p>
          <h1 className="extended-tool-title">{title}</h1>
          <HTMLField value={long_description} />
          {hasHyperlink && (
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
              <Button primary inverted onClick={copyShareUrl}>
                <Icon className="ri-share-line" />
                {intl.formatMessage(
                  isLinkCopied ? messages.linkCopied : messages.share,
                )}
              </Button>
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
              <VocabularyField
                label={intl.formatMessage(messages.intended_user_groups)}
                values={intended_user_groups}
              />
              <VocabularyField
                label={intl.formatMessage(messages.place_of_implementation)}
                values={place_of_implementation}
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
              <Segment className="metadata">
                <h3 className="metadata-header">Metadata</h3>
                {adaptation_support_cycle_step?.length > 0 && (
                  <div className="metadata-group adaptation-step">
                    <h5>
                      <FormattedMessage
                        id="Support of Adaptation Policy Cycle"
                        defaultMessage="Support of Adaptation Policy Cycle"
                      />
                    </h5>
                    <MetadataItemList value={adaptation_support_cycle_step} />
                  </div>
                )}
                {sectors?.length > 0 && (
                  <div className="metadata-group">
                    <h5>
                      <FormattedMessage
                        id="Adaptation sectors"
                        defaultMessage="Adaptation sectors"
                      />
                    </h5>
                    <MetadataItemList asTags value={sectors} maxItems={3} />
                  </div>
                )}
                {climate_impacts?.length > 0 && (
                  <div className="metadata-group">
                    <h5>
                      <FormattedMessage
                        id="Climate impacts"
                        defaultMessage="Climate impacts"
                      />
                    </h5>
                    <MetadataItemList
                      asTags
                      maxItems={3}
                      value={climate_impacts}
                    />
                  </div>
                )}
                {type_of_outputs?.length > 0 && (
                  <div className="metadata-group">
                    <h5>
                      <FormattedMessage
                        id="Type of outputs"
                        defaultMessage="Type of outputs"
                      />
                    </h5>
                    <MetadataItemList
                      asTags
                      maxItems={3}
                      value={type_of_outputs}
                    />
                  </div>
                )}
                {temporality_of_data?.length > 0 && (
                  <div className="metadata-group">
                    <h5>
                      <FormattedMessage
                        id="Temporality of data"
                        defaultMessage="Temporality of data"
                      />
                    </h5>
                    <MetadataItemList
                      asTags
                      maxItems={3}
                      value={temporality_of_data}
                    />
                  </div>
                )}
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

export default ExtendedToolView;
