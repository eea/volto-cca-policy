import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
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
  ImageGallery,
} from '@eeacms/volto-cca-policy/components';
import { Callout } from '@eeacms/volto-eea-design-system/ui';
import { Container, Grid, Image, Icon } from 'semantic-ui-react';
import { getFilteredBlocks } from '@eeacms/volto-cca-policy/utils';
import { UniversalLink } from '@plone/volto/components';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';

const PhotoGallery = ({ content }) => {
  const { cca_adaptation_gallery } = content;

  const [open, setOpen] = React.useState(false);
  const [slideIndex, setSlideIndex] = React.useState(0);

  const handleTitleClick = () => {
    setSlideIndex(0);
    setOpen(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTitleClick();
    }
  };

  return (
    <>
      {cca_adaptation_gallery && cca_adaptation_gallery.length > 0 && (
        <div className="case-study-gallery">
          <div
            className="gallery-title"
            tabIndex={0}
            role="button"
            onClick={handleTitleClick}
            onKeyDown={handleKeyDown}
          >
            <span>
              <FormattedMessage
                id="Adaptation Option illustrations"
                defaultMessage="Adaptation Option illustrations"
              />
            </span>
            <span> ({cca_adaptation_gallery.length}) </span>
            <Icon className="ri-image-fill" />
          </div>
          <ImageGallery
            items={cca_adaptation_gallery}
            propOpen={open}
            setPropOpen={setOpen}
            propSlideIndex={slideIndex}
            setPropSlideIndex={setSlideIndex}
          />
        </div>
      )}
    </>
  );
};

function AdaptationOptionView(props) {
  const intl = useIntl();
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
    long_description,
    success_limitations,
    implementation_time,
    related_case_studies,
    show_related_resources,
    cca_adaptation_gallery,
    stakeholder_participation,
    relevant_eu_policies_items,
  } = content;

  const { blocks, blocks_layout } = getFilteredBlocks(
    content,
    'tabs_block',
    'metadataSection',
  );

  const desc = (description ?? '').trim();

  const accordions = useMemo(() => {
    const items = [
      {
        title: (
          <FormattedMessage id="Description" defaultMessage="Description" />
        ),
        content: <HTMLField value={long_description} />,
      },

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

        <div className="styled-group info-section">
          <p>
            <span className="small-text">
              This page is currently under construction, so it may look a bit
              different than you're used to. We're in the process of preparing a
              new layout to improve your experience. A fresh new look for the
              adaptation options pages is coming soon.
            </span>
          </p>
        </div>
        <Grid>
          <Grid.Row columns={12}>
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={8}
              className="col-left"
            >
              {desc && desc !== 'None' && <Callout>{desc}</Callout>}
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
                          <UniversalLink href={it.url}>
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

              {(relevant_synergies?.length ?? 0) > 0 && (
                <>
                  <h5>
                    <FormattedMessage
                      id="Relevant synergies with mitigation"
                      defaultMessage="Relevant synergies with mitigation"
                    />
                  </h5>
                  <div className="synergies-list">
                    <p>
                      {relevant_synergies
                        .map((item) =>
                          intl.formatMessage({
                            id: item.title,
                            defaultMessage: item.title,
                          }),
                        )
                        .join(', ')}
                    </p>
                  </div>
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
              <PhotoGallery {...props} />
              {!cca_adaptation_gallery?.length &&
                image?.scales?.large?.download && (
                  <Image
                    src={image?.scales?.large?.download}
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
