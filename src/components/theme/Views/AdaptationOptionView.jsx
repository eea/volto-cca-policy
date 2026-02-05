import React, { useMemo } from 'react';
import {
  HTMLField,
  ContentMetadata,
  PublishedModifiedInfo,
  BannerTitle,
  LinksList,
} from '@eeacms/volto-cca-policy/helpers';
import {
  AccordionList,
  PortalMessage,
  ShareInfoButton,
} from '@eeacms/volto-cca-policy/components';
import { FormattedMessage } from 'react-intl';
import { Callout } from '@eeacms/volto-eea-design-system/ui';
import { Container, Grid } from 'semantic-ui-react';

function AdaptationOptionView(props) {
  const { content = {} } = props;
  const {
    source,
    websites,
    category,
    lifetime,
    description,
    cost_benefit,
    legal_aspects,
    ipcc_category,
    long_description,
    success_limitations,
    implementation_time,
    related_case_studies,
    stakeholder_participation,
  } = content;

  const ipccCategories = useMemo(() => {
    const titles = (ipcc_category ?? [])
      .map((item) => item?.title)
      .filter(Boolean);
    return titles.sort().join(', ');
  }, [ipcc_category]);

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
              {description && <Callout>{description}</Callout>}
              <h2>
                <FormattedMessage
                  id="Read the full text of the adaptation option"
                  defaultMessage="Read the full text of the adaptation option"
                />
              </h2>
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
              <ContentMetadata
                {...props}
                related_case_studies={related_case_studies}
              />
              {/* {related_case_studies?.length > 0 && (
                <Segment>
                  <h5>
                    <FormattedMessage
                      id="Case studies related to this option:"
                      defaultMessage="Case studies related to this option:"
                    />
                  </h5>
                  <ul className="related-case-studies">
                    {related_case_studies.map((item, index) => (
                      <li key={index}>
                        <UniversalLink key={index} href={item.url}>
                          {item.title}
                        </UniversalLink>
                      </li>
                    ))}
                  </ul>
                </Segment>
              )} */}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
}

export default AdaptationOptionView;
