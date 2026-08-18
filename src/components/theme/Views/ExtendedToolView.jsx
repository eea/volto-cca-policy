import { useEffect } from 'react';
import { Button, Container, Grid, Icon, Segment } from 'semantic-ui-react';
import {
  CompareToolsPanel,
  ExtendedToolGeographicMetadata,
  HTMLField,
  MetadataItemList,
  PortalMessage,
  TextField,
} from '@eeacms/volto-cca-policy/components';
import { FormattedMessage } from 'react-intl';
import BodyClass from '@plone/volto/helpers/BodyClass/BodyClass';
import useClipboard from '@plone/volto/hooks/clipboard/useClipboard';
import { useCompareTools } from '../CompareTools/utils';
import RelatedTools from './RelatedTools';

const ExtendedToolView = (props) => {
  const { content = {} } = props;
  const {
    title = '',
    long_description,
    climate_impacts,
    sectors,
    geochars,
    spatial_layer,
    spatial_resolution,
    tool_provider,
    hyperlink,
    intended_user_groups,
    adaptation_support_cycle_step,
    type_of_outputs,
    temporality_of_data,
    tool_available_english,
    tool_available_language,
    accessibility_and_usability,
    tool_input,
    tool_output,
    use_it_to,
    climate_adaptation_relevance,
    used_in,
  } = content;

  const availableLanguages = tool_available_english ? ['English'] : [];
  if (Array.isArray(tool_available_language)) {
    availableLanguages.push(...tool_available_language);
  } else if (tool_available_language) {
    availableLanguages.push(tool_available_language);
  }

  const hasGeoChars = Boolean(geochars || spatial_layer?.length);
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

  return (
    <div className="extended-tool-view">
      <BodyClass className="extended-tool" />

      <Container>
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
              <div className="extended-tool-header">
                <p className="extended-tool-provider">{tool_provider}</p>
                <h1 className="extended-tool-title">{title}</h1>
              </div>
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
                      <FormattedMessage
                        id="Open tool"
                        defaultMessage="Open tool"
                      />
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
                      <FormattedMessage
                        id="Add to comparison"
                        defaultMessage="Add to comparison"
                      />
                    </Button>
                  )}

                  <Button primary inverted onClick={copyShareUrl}>
                    <Icon className="ri-share-line" />

                    {isLinkCopied ? (
                      <FormattedMessage
                        id="Link copied"
                        defaultMessage="Link copied"
                      />
                    ) : (
                      <FormattedMessage id="Share" defaultMessage="Share" />
                    )}
                  </Button>
                </div>
              )}

              {(tool_input || tool_output || use_it_to) && (
                <section className="extended-tool-information">
                  <h3>
                    <FormattedMessage
                      id="What you can do with it"
                      defaultMessage="What you can do with it"
                    />
                  </h3>

                  {tool_input && (
                    <div className="extended-tool-information-row">
                      <h4 className="extended-tool-information-label">
                        <FormattedMessage id="Input" defaultMessage="Input" />
                      </h4>

                      <div className="extended-tool-information-content">
                        <HTMLField value={tool_input} />
                      </div>
                    </div>
                  )}

                  {tool_output && (
                    <div className="extended-tool-information-row">
                      <h4 className="extended-tool-information-label">
                        <FormattedMessage id="Output" defaultMessage="Output" />
                      </h4>

                      <div className="extended-tool-information-content">
                        <HTMLField value={tool_output} />
                      </div>
                    </div>
                  )}

                  {use_it_to && (
                    <div className="extended-tool-information-row">
                      <h4 className="extended-tool-information-label">
                        <FormattedMessage
                          id="Use it to"
                          defaultMessage="Use it to"
                        />
                      </h4>

                      <div className="extended-tool-information-content">
                        <HTMLField value={use_it_to} />
                      </div>
                    </div>
                  )}
                </section>
              )}

              {climate_adaptation_relevance && (
                <>
                  <h3>
                    <FormattedMessage
                      id="Why is it relevant to climate adaptation"
                      defaultMessage="Why is it relevant to climate adaptation"
                    />
                  </h3>

                  <HTMLField value={climate_adaptation_relevance} />
                </>
              )}

              {used_in && (
                <>
                  <h4>
                    <FormattedMessage id="Used in" defaultMessage="Used in" />
                  </h4>

                  <HTMLField value={used_in} />
                </>
              )}
            </Grid.Column>

            <Grid.Column
              mobile={12}
              tablet={12}
              computer={4}
              className="col-right"
            >
              <Segment className="metadata">
                <h4 className="metadata-header">Metadata</h4>

                {hasGeoChars && (
                  <div className="metadata-group">
                    <h5>
                      <FormattedMessage
                        id="Geographic coverage"
                        defaultMessage="Geographic coverage"
                      />
                    </h5>

                    <ExtendedToolGeographicMetadata content={content} />
                  </div>
                )}

                {spatial_resolution && (
                  <div className="metadata-group">
                    <TextField
                      label={
                        <FormattedMessage
                          id="Spatial resolution"
                          defaultMessage="Spatial resolution"
                        />
                      }
                      value={spatial_resolution}
                    />
                  </div>
                )}

                {intended_user_groups?.length > 0 && (
                  <div className="metadata-group">
                    <h5>
                      <FormattedMessage
                        id="User Group"
                        defaultMessage="User Group"
                      />
                    </h5>

                    <MetadataItemList
                      asTags
                      maxItems={3}
                      value={intended_user_groups}
                    />
                  </div>
                )}

                {adaptation_support_cycle_step?.length > 0 && (
                  <div className="metadata-group adaptation-step">
                    <h5>
                      <FormattedMessage
                        id="Support of Adaptation Policy Cycle"
                        defaultMessage="Support of Adaptation Policy Cycle"
                      />
                    </h5>

                    <MetadataItemList
                      asList
                      value={adaptation_support_cycle_step}
                    />
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

                {availableLanguages.length > 0 && (
                  <div className="metadata-group">
                    <h5>
                      <FormattedMessage
                        id="Language"
                        defaultMessage="Language"
                      />
                    </h5>

                    <MetadataItemList
                      asTags
                      maxItems={3}
                      value={availableLanguages}
                    />
                  </div>
                )}

                {accessibility_and_usability && (
                  <div className="metadata-group">
                    <h5>
                      <FormattedMessage
                        id="Accessibility and usability"
                        defaultMessage="Accessibility and usability"
                      />
                    </h5>

                    <MetadataItemList
                      asTags
                      maxItems={3}
                      value={
                        Array.isArray(accessibility_and_usability)
                          ? accessibility_and_usability
                          : [accessibility_and_usability]
                      }
                    />
                  </div>
                )}
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
      <RelatedTools content={content} />
    </div>
  );
};

export default ExtendedToolView;
