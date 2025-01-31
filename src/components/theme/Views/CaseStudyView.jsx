import {
  ImageGallery,
  PortalMessage,
  ShareInfoButton,
} from '@eeacms/volto-cca-policy/components';
import {
  BannerTitle,
  ContentMetadata,
  DocumentsList,
  HTMLField,
  LinksList,
  PublishedModifiedInfo,
} from '@eeacms/volto-cca-policy/helpers';
import React, { Fragment } from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import {
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

  return primary_photo !== null ? (
    <div className="case-studies-review-image-wrapper">
      <Image src={primary_photo?.scales?.mini?.download} alt={title} />
      <p>{primary_photo_copyright}</p>
    </div>
  ) : null;
};

const dataDisplay = [
  {
    type: 'HTMLField',
    field: 'challenges',
    section: 'challenges_anchor',
    title: 'Challenges',
    group: 1,
  },
  {
    type: 'HTMLField',
    field: 'policy_legal_background',
    section: 'policy_anchor',
    title: 'Policy and legal background',
    group: 1,
  },
  {
    type: 'RelevanceItems',
    field: 'relevance',
    section: 'relevance_anchor',
    title: 'Policy context of the adaptation measure',
    group: 1,
  },
  {
    type: 'HTMLField',
    field: 'objectives',
    section: 'objectives_anchor',
    title: 'Objectives',
    group: 1,
  },
  {
    type: 'AdaptationOptionsItems',
    field: 'adaptationoptions',
    section: 'adapt_options_anchor',
    title: 'Adaptation Options Implemented In This Case',
    group: 1,
  },
  {
    type: 'HTMLField',
    field: 'solutions',
    section: 'solutions_anchor',
    title: 'Solutions',
    group: 1,
  },
  {
    type: 'HTMLField',
    field: 'stakeholder_participation',
    section: 'stake_holder_anchor',
    title: 'Stakeholder participation',
    group: 2,
  },
  {
    type: 'HTMLField',
    field: 'success_limitations',
    section: 'success_limitations_anchor',
    title: 'Success and Limiting Factors',
    group: 2,
  },
  {
    type: 'HTMLField',
    field: 'cost_benefit',
    section: 'cost_benefit_anchor',
    title: 'Costs and Benefits',
    group: 2,
  },
  {
    type: 'HTMLField',
    field: 'legal_aspects',
    section: 'legal_aspects',
    title: 'Legal Aspects',
    group: 2,
  },
  {
    type: 'HTMLField',
    field: 'implementation_time',
    section: 'implementation_time_anchor',
    title: 'Implementation Time',
    group: 2,
  },
  {
    type: 'HTMLField',
    field: 'lifetime',
    section: 'life_time_anchor',
    title: 'Life Time',
    group: 2,
  },
  {
    type: 'HTMLField',
    field: 'contact',
    section: 'contact',
    title: 'Contact',
    group: 3,
  },
  {
    type: 'LinksList',
    field: 'websites',
    section: 'websites',
    title: 'Websites',
    group: 3,
  },
  {
    type: 'HTMLField',
    field: 'source',
    section: 'source',
    title: 'Source',
    contentTitle: 'References', // override the title in content section
    group: 3,
  },
];

const groups = {
  1: 'Case Study Description',
  2: 'Additional Details',
  3: 'Reference Information',
};

const findSection = (title) => {
  const found = dataDisplay.filter((item) => item.title === title);
  if (found.length > 0) {
    return found[0];
  }
  return null;
};

const sectionID = (title) => {
  const found = findSection(title);
  if (found === null) {
    return title;
  }
  return found.section;
};

const PhotoGallery = ({ content }) => {
  const { cca_gallery } = content;

  return (
    <>
      {cca_gallery && cca_gallery.length > 0 && (
        <div className="case-study-gallery">
          <div className="gallery-title">
            <span>
              <FormattedMessage
                id="Case Study illustrations"
                defaultMessage="Case Study illustrations"
              />
            </span>
            <span> ({cca_gallery.length}) </span>
            <Icon className="ri-image-fill" />
          </div>
          <ImageGallery items={cca_gallery} />
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
  for (var key in section) {
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
    if (!content.hasOwnProperty(field)) {
      return false;
    }
    if (content[field] === undefined || content[field] === null) {
      return false;
    }
    if (Array.isArray(content[field]) && content[field].length === 0) {
      return false;
    }
    if (
      typeof content[field]?.data === 'string' &&
      content[field]?.data.replace('<p></p>', '').length === 0
    ) {
      return false;
    }
    return true;
  };

  const usedSections = (group) => {
    return dataDisplay.filter(
      (data) => data.group === group && hasValue(data.field),
    );
  };

  return (
    <div className="db-item-view case-study-view">
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
                  <Grid.Column mobile={12} tablet={12} computer={4}>
                    <SectionsMenu
                      sections={usedSections(1)}
                      title={groups['1']}
                    />
                  </Grid.Column>
                  <Grid.Column mobile={12} tablet={12} computer={4}>
                    <SectionsMenu
                      sections={usedSections(2)}
                      title={groups['2']}
                    />
                  </Grid.Column>
                  <Grid.Column mobile={12} tablet={12} computer={4}>
                    <SectionsMenu
                      sections={usedSections(3)}
                      title={groups['3']}
                    />
                  </Grid.Column>
                </Grid>
              </div>
              <Divider />
              {[1, 2, 3].map(
                (groupID, index) =>
                  usedSections(groupID).length > 0 && (
                    <Fragment key={index}>
                      <h2>{intl.formatMessage(messages[groups[groupID]])}</h2>
                      {usedSections(groupID).map((data, index) => (
                        <SectionContent
                          sectionData={data}
                          content={content}
                          key={index}
                        />
                      ))}
                      {groupID !== 3 ? <Divider /> : null}
                    </Fragment>
                  ),
              )}
              <PublishedModifiedInfo {...props} />
              <Divider />
              <p>
                Please contact us for any other enquiry on this Case Study or to
                share a new Case Study (email{' '}
                <span className="link-mailto">
                  <a
                    href="mailto: climate.adapt@eea.europa.eu"
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
