import {
  ContentBannerTitle,
  ContentMetadata,
  DocumentsList,
  HTMLField,
  ImageGallery,
  LinksList,
  PortalMessage,
  PublishedModifiedInfo,
  ShareInfoButton,
} from '@eeacms/volto-cca-policy/components';
import React, { Fragment } from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import {
  Button,
  Container,
  Divider,
  Grid,
  Icon,
  Image,
  List,
  ListItem,
} from 'semantic-ui-react';

const messages = defineMessages({
  References: { id: 'References', defaultMessage: 'References' },
  Challenges: { id: 'Challenges', defaultMessage: 'Challenges' },
  Objectives: {
    id: 'Objectives of the adaptation measure',
    defaultMessage: 'Objectives of the adaptation measure',
  },
  'Policy and legal background': {
    id: 'Policy and legal background',
    defaultMessage: 'Policy and legal background',
  },
  'Adaptation Options Implemented In This Case': {
    id: 'Adaptation Options Implemented In This Case',
    defaultMessage: 'Adaptation Options Implemented In This Case',
  },
  Solutions: { id: 'Solutions', defaultMessage: 'Solutions' },
  'Importance and Relevance of Adaptation': {
    id: 'Importance and Relevance of Adaptation',
    defaultMessage: 'Importance and Relevance of Adaptation',
  },
  'Stakeholder participation': {
    id: 'Stakeholder participation',
    defaultMessage: 'Stakeholder participation',
  },
  'Success and Limiting Factors': {
    id: 'Success and limiting factors',
    defaultMessage: 'Success and limiting factors',
  },
  'Costs and Benefits': {
    id: 'Costs and benefits',
    defaultMessage: 'Costs and benefits',
  },
  'Policy context of the adaptation measure': {
    id: 'Policy context of the adaptation measure',
    defaultMessage: 'Policy context of the adaptation measure',
  },
  'Legal Aspects': { id: 'Legal aspects', defaultMessage: 'Legal aspects' },
  'Implementation Time': {
    id: 'Implementation time',
    defaultMessage: 'Implementation time',
  },
  'Life Time': { id: 'Lifetime', defaultMessage: 'Lifetime' },
  Contact: { id: 'Contact', defaultMessage: 'Contact' },

  Websites: { id: 'Websites', defaultMessage: 'Websites' },
  Source: { id: 'Source', defaultMessage: 'Source' },
  'Case Study Description': {
    id: 'Case Study Description',
    defaultMessage: 'Case Study Description',
  },
  'Additional Details': {
    id: 'Additional Details',
    defaultMessage: 'Additional Details',
  },
  'Reference Information': {
    id: 'Reference Information',
    defaultMessage: 'Reference Information',
  },
  updating_notes: {
    id: 'Updating notes',
    defaultMessage: 'Updating notes',
  },
});

const PrimaryPhoto = ({ content }) => {
  const { primary_photo, primary_photo_copyright, title } = content;

  return primary_photo ? (
    <div className="case-studies-review-image-wrapper">
      <Image src={primary_photo?.scales?.mini?.download} alt={title} />
      <p>{primary_photo_copyright}</p>
    </div>
  ) : null;
};

const createSection = (
  field,
  section,
  title,
  group,
  type = 'HTMLField',
  contentTitle,
) => ({
  type,
  field,
  section,
  title,
  ...(contentTitle ? { contentTitle } : {}),
  group,
});

const dataDisplay = [
  createSection('challenges', 'challenges_anchor', 'Challenges', 1),
  createSection(
    'policy_legal_background',
    'policy_anchor',
    'Policy and legal background',
    1,
  ),
  createSection(
    'relevance',
    'relevance_anchor',
    'Policy context of the adaptation measure',
    1,
    'RelevanceItems',
  ),
  createSection('objectives', 'objectives_anchor', 'Objectives', 1),
  createSection(
    'adaptationoptions',
    'adapt_options_anchor',
    'Adaptation Options Implemented In This Case',
    1,
    'AdaptationOptionsItems',
  ),
  createSection('solutions', 'solutions_anchor', 'Solutions', 1),
  createSection(
    'stakeholder_participation',
    'stake_holder_anchor',
    'Stakeholder participation',
    2,
  ),
  createSection(
    'success_limitations',
    'success_limitations_anchor',
    'Success and Limiting Factors',
    2,
  ),
  createSection('cost_benefit', 'cost_benefit_anchor', 'Costs and Benefits', 2),
  createSection('legal_aspects', 'legal_aspects', 'Legal Aspects', 2),
  createSection(
    'implementation_time',
    'implementation_time_anchor',
    'Implementation Time',
    2,
  ),
  createSection('lifetime', 'life_time_anchor', 'Life Time', 2),
  createSection('contact', 'contact', 'Contact', 3),
  createSection('websites', 'websites', 'Websites', 3, 'LinksList'),
  createSection('source', 'source', 'Source', 3, 'HTMLField', 'References'),
];

const groups = {
  1: 'Case Study Description',
  2: 'Additional Details',
  3: 'Reference Information',
};

export const findSection = (title) =>
  dataDisplay.find((item) => item.title === title) || null;

export const sectionID = (title) => findSection(title)?.section || title;

const PhotoGallery = ({ content }) => {
  const { cca_gallery } = content;

  const [open, setOpen] = React.useState(false);
  const [slideIndex, setSlideIndex] = React.useState(0);

  const handleTitleClick = () => {
    setSlideIndex(0);
    setOpen(true);
  };

  return (
    <>
      {cca_gallery && cca_gallery.length > 0 && (
        <div className="db-item-gallery">
          <Button className="gallery-title" onClick={handleTitleClick}>
            <span>
              <FormattedMessage
                id="Case Study illustrations"
                defaultMessage="Case Study illustrations"
              />
            </span>
            <span> ({cca_gallery.length}) </span>
            <Icon className="ri-image-fill" />
          </Button>
          <ImageGallery
            items={cca_gallery}
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

// Sections Menu Component
const SectionsMenu = ({ sections, title }) => {
  const intl = useIntl();

  return (
    <>
      {sections.length > 0 && (
        <div>
          <h4>{intl.formatMessage(messages[title])}</h4>
          <List bulleted>
            {sections.map((data, index) => (
              <ListItem key={index}>
                <AnchorLink href={`#${sectionID(data.title)}`}>
                  {intl.formatMessage(messages[data.title])}
                </AnchorLink>
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </>
  );
};

const SectionContent = ({ sectionData, content }) => {
  const intl = useIntl();
  const sectionDataTitle = sectionData.contentTitle || sectionData.title;

  const adaptationOptionsLinks = () => {
    let list = [];
    for (let adaptOpt of content[sectionData.field]) {
      list.push([adaptOpt['@id'], adaptOpt.title]);
    }
    return list;
  };

  const section = content[sectionData.field];
  for (const key in section) {
    if (section[key] === '') {
      section[key] = '<p>-</p>';
    }
  }

  return (
    <div id={sectionID(sectionData.title)} className="section">
      <h5 className="section-title">
        {intl.formatMessage(messages[sectionDataTitle])}
      </h5>
      {sectionData.type === 'LinksList' ? (
        <LinksList value={content[sectionData.field]} />
      ) : sectionData.type === 'AdaptationOptionsItems' ? (
        <LinksList
          value={adaptationOptionsLinks()}
          withText={true}
          isInternal={true}
        />
      ) : sectionData.type === 'RelevanceItems' ? (
        content[sectionData.field].map((relevanceItem, index) => (
          <p key={index}>{relevanceItem.title}</p>
        ))
      ) : (
        <HTMLField value={content[sectionData.field]} />
      )}
    </div>
  );
};

function CaseStudyView(props) {
  const intl = useIntl();
  const { content } = props;
  const { long_description, updating_notes, logo, title } = content;

  const hasValue = (field) => {
    const fieldValue = content[field];
    if (!content.hasOwnProperty(field) || fieldValue == null) return false;
    if (Array.isArray(fieldValue) && fieldValue.length === 0) return false;
    if (
      typeof fieldValue?.data === 'string' &&
      fieldValue?.data.replace('<p></p>', '').length === 0
    )
      return false;

    return true;
  };

  const usedSections = (group) =>
    dataDisplay.filter((data) => data.group === group && hasValue(data.field));

  return (
    <div className="db-item-view case-study-view">
      <ContentBannerTitle
        content={{ ...content, image: '' }}
        data={{
          info: [{ description: '' }],
          hideContentType: true,
          hideCreationDate: true,
          hideModificationDate: true,
          hidePublishingDate: true,
          hideDownloadButton: false,
          hideShareButton: false,
          subtitle: 'Case Studies',
        }}
      />

      <Container>
        <PortalMessage content={content} />
        <Grid columns="12">
          <div className="row">
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={8}
              className="col-left"
            >
              {logo && (
                <div>
                  <Image
                    src={logo?.scales?.mini?.download}
                    alt={title}
                    className="db-logo"
                  />
                </div>
              )}
              <PrimaryPhoto {...props} />
              <HTMLField value={long_description} />
              {updating_notes && updating_notes.length > 0 && (
                <div className="disclaimer-box">
                  <h5>{intl.formatMessage(messages.updating_notes)}</h5>
                  {updating_notes.map((item, index) => (
                    <p key={index}>{item}</p>
                  ))}
                </div>
              )}
              <Divider />
              <div className="adaptation-details">
                <Grid columns="12">
                  {[1, 2, 3].map((groupID) => (
                    <Grid.Column
                      key={groupID}
                      mobile={12}
                      tablet={12}
                      computer={4}
                    >
                      <SectionsMenu
                        sections={usedSections(groupID)}
                        title={groups[groupID]}
                      />
                    </Grid.Column>
                  ))}
                </Grid>
              </div>
              <Divider />
              {[1, 2, 3].map((groupID) => {
                const sections = usedSections(groupID);
                if (sections.length === 0) return null;
                return (
                  <Fragment key={groupID}>
                    <h2>{intl.formatMessage(messages[groups[groupID]])}</h2>
                    {sections.map((data, index) => (
                      <SectionContent
                        key={index}
                        sectionData={data}
                        content={content}
                      />
                    ))}
                    {groupID !== 3 && <Divider />}
                  </Fragment>
                );
              })}
              <PublishedModifiedInfo {...props} />
              <Divider />
              <p>
                Please contact us for any other enquiry on this Case Study or to
                share a new Case Study (email{' '}
                <span className="link-mailto">
                  <a
                    href="mailto:climate.adapt@eea.europa.eu"
                    target="_blank"
                    rel="noreferrer"
                  >
                    climate.adapt@eea.europa.eu
                  </a>
                </span>
                )
              </p>
              <ShareInfoButton {...props} />
            </Grid.Column>
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={4}
              className="col-right"
            >
              <PhotoGallery {...props} />
              <ContentMetadata {...props} />
              <DocumentsList {...props} />
            </Grid.Column>
          </div>
        </Grid>
      </Container>
    </div>
  );
}

export default CaseStudyView;
