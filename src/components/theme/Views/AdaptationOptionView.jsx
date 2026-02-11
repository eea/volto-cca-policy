import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  HTMLField,
  ContentMetadata,
  PublishedModifiedInfo,
  BannerTitle,
  LinksList,
  RELEVANT_SYNERGIES,
} from '@eeacms/volto-cca-policy/helpers';
import {
  AccordionList,
  PortalMessage,
  ShareInfoButton,
} from '@eeacms/volto-cca-policy/components';
import { Callout } from '@eeacms/volto-eea-design-system/ui';
import { Container, Grid, Label, Image } from 'semantic-ui-react';
import { getFilteredBlocks } from '@eeacms/volto-cca-policy/utils';
import { UniversalLink } from '@plone/volto/components';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';

function AdaptationOptionView(props) {
  const { content = {} } = props;
  const {
    image,
    source,
    websites,
    category,
    lifetime,
    description,
    cost_benefit,
    intro_paragraph,
    advantages,
    disadvantages,
    relevant_synergies,
    legal_aspects,
    ipcc_category,
    long_description,
    success_limitations,
    implementation_time,
    related_case_studies,
    show_related_resources,
    stakeholder_participation,
    relevant_eu_policies_items,
  } = content;

  const { blocks, blocks_layout } = getFilteredBlocks(
    content,
    'tabs_block',
    'metadataSection',
  );

  const ipccCategories = useMemo(() => {
    const titles = (ipcc_category ?? [])
      .map((item) => item?.title)
      .filter(Boolean);
    return titles.sort().join(', ');
  }, [ipcc_category]);
  const relevantSynergyValue = relevant_synergies?.token;

  const accordions = useMemo(() => {
    const items = [
      {
        title: (
          <FormattedMessage id="Description" defaultMessage="Description" />
        ),
        content: <HTMLField value={long_description} />,
      },

      (ipcc_category?.length ?? 0) > 0
        ? {
            title: (
              <FormattedMessage
                id="IPCC categories"
                defaultMessage="IPCC categories"
              />
            ),
            content: <p>{ipccCategories}</p>,
          }
        : null,

      category
        ? {
            title: <FormattedMessage id="Category" defaultMessage="Category" />,
            content: <p>{category}</p>,
          }
        : null,

      stakeholder_participation
        ? {
            title: (
              <FormattedMessage
                id="Stakeholder participation"
                defaultMessage="Stakeholder participation"
              />
            ),
            content: <HTMLField value={stakeholder_participation} />,
          }
        : null,

      success_limitations
        ? {
            title: (
              <FormattedMessage
                id="Success and limiting factors"
                defaultMessage="Success and limiting factors"
              />
            ),
            content: <HTMLField value={success_limitations} />,
          }
        : null,

      cost_benefit
        ? {
            title: (
              <FormattedMessage
                id="Costs and benefits"
                defaultMessage="Costs and benefits"
              />
            ),
            content: <HTMLField value={cost_benefit} />,
          }
        : null,

      legal_aspects
        ? {
            title: (
              <FormattedMessage
                id="Legal aspects"
                defaultMessage="Legal aspects"
              />
            ),
            content: <HTMLField value={legal_aspects} />,
          }
        : null,

      implementation_time
        ? {
            title: (
              <FormattedMessage
                id="Implementation time"
                defaultMessage="Implementation time"
              />
            ),
            content: <HTMLField value={implementation_time} />,
          }
        : null,

      lifetime
        ? {
            title: <FormattedMessage id="Lifetime" defaultMessage="Lifetime" />,
            content: <HTMLField value={lifetime} />,
          }
        : null,

      {
        title: <FormattedMessage id="References" defaultMessage="References" />,
        content: (
          <>
            <HTMLField value={source} className="source" />
            {(websites?.length ?? 0) > 0 && (
              <>
                <h5>
                  <FormattedMessage id="Websites:" defaultMessage="Websites:" />
                </h5>
                <LinksList value={websites} />
              </>
            )}
          </>
        ),
      },
    ];

    return items.filter(Boolean);
  }, [
    long_description,
    ipcc_category,
    ipccCategories,
    category,
    stakeholder_participation,
    success_limitations,
    cost_benefit,
    legal_aspects,
    implementation_time,
    lifetime,
    source,
    websites,
  ]);

  return (
    <div className="db-item-view adaptation-option-view">
      <BannerTitle
        content={{ ...content, image: '' }}
        data={{
          info: [{ description: '' }],
          hideContentType: true,
          hideCreationDate: true,
          hideModificationDate: true,
          hidePublishingDate: true,
          hideDownloadButton: false,
          hideShareButton: false,
          subtitle: 'Adaptation Option',
        }}
      />

      <Container>
        <PortalMessage content={content} />
        <Grid>
          <Grid.Row columns={12}>
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={8}
              className="col-left"
            >
              {description.trim() !== 'None' && (
                <Callout>{description}</Callout>
              )}
              {intro_paragraph && <HTMLField value={intro_paragraph} />}

              {(relevant_eu_policies_items?.length ?? 0) > 0 && (
                <>
                  <h5>
                    <FormattedMessage
                      id="Relevant EU policies"
                      defaultMessage="Relevant EU policies"
                    />
                  </h5>

                  <p className="relevant-eu-policies">
                    {relevant_eu_policies_items
                      .filter((it) => it?.url && it?.title)
                      .map((it, index, arr) => (
                        <React.Fragment key={it.id || it.url}>
                          <UniversalLink href={it.url} openInNewTab>
                            {it.title}
                          </UniversalLink>
                          {index < arr.length - 1 && ', '}
                        </React.Fragment>
                      ))}
                  </p>
                </>
              )}

              {advantages && (
                <>
                  <h5>
                    <FormattedMessage
                      id="Advantages"
                      defaultMessage="Advantages"
                    />
                  </h5>
                  <HTMLField value={advantages} />
                </>
              )}
              {disadvantages && (
                <>
                  <h5>
                    <FormattedMessage
                      id="Disadvantages"
                      defaultMessage="Disadvantages"
                    />
                  </h5>
                  <HTMLField value={disadvantages} />
                </>
              )}

              {(relevantSynergyValue === 'Yes' ||
                relevantSynergyValue === 'No') && (
                <>
                  <h5>
                    <FormattedMessage
                      id="Relevant synergies with mitigation"
                      defaultMessage="Relevant synergies with mitigation"
                    />
                  </h5>

                  {relevantSynergyValue === 'Yes' ? (
                    <>
                      <span>
                        <FormattedMessage id="Yes" defaultMessage="Yes" />
                      </span>
                      <div className="synergies-list">
                        {RELEVANT_SYNERGIES.map((item, index) => (
                          <Label key={index}>{item}</Label>
                        ))}
                      </div>
                    </>
                  ) : (
                    <span>
                      <FormattedMessage id="No" defaultMessage="No" />
                    </span>
                  )}
                </>
              )}

              <h3>
                <FormattedMessage
                  id="Read the full text of the adaptation option"
                  defaultMessage="Read the full text of the adaptation option"
                />
              </h3>
              <AccordionList variation="primary" accordions={accordions} />
              <PublishedModifiedInfo {...props} />
              <ShareInfoButton {...props} />
            </Grid.Column>

            <Grid.Column
              mobile={12}
              tablet={12}
              computer={4}
              className="col-right"
            >
              {image && (
                <Image
                  src={content.image?.scales?.large?.download}
                  className="preview-image"
                />
              )}
              <ContentMetadata
                {...props}
                related_case_studies={related_case_studies}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {show_related_resources && (
          <>
            <h3>
              <FormattedMessage
                id="Related Resources"
                defaultMessage="Related Resources"
              />
            </h3>
            <RenderBlocks
              {...props}
              content={{
                ...content,
                blocks,
                blocks_layout,
              }}
            />
          </>
        )}
      </Container>
    </div>
  );
}

export default AdaptationOptionView;
