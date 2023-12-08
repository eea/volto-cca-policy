import React from 'react';
import { Fragment } from 'react';
import {
  HTMLField,
  ContentMetadata,
  LinksList,
  PublishedModifiedInfo,
  DocumentsList,
  ShareInfo,
} from '@eeacms/volto-cca-policy/helpers';
import { Grid } from 'semantic-ui-react';

const PrimaryPhoto = (props) => {
  const { content } = props;

  return content.primary_photo !== null ? (
    <div className="case-studies-review-image-wrapper">
      <img
        src={content?.primary_photo?.scales?.mini?.download}
        alt={content.title}
      />
      <p>{content.primary_photo_copyright}</p>
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
    type: 'RelevanceItems',
    field: 'relevance',
    section: 'relevance_anchor',
    title: 'Importance and Relevance of Adaptation',
    contentTitle: 'Relevance', // override the title in content section
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
    contentTitle: 'Reference', // override the title in content section
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

const PhotoGallery = (props) => {
  const { content } = props;
  const photos = content.cca_gallery;
  return (
    <>
      <h5>Case Study Illustrations</h5>
      <ul className="gallery-placeholder">
        {photos.map((photo, index) => (
          <li key={index}>
            <a href={photo.url}>{photo.title}</a>
          </li>
        ))}
      </ul>
    </>
  );
};

const SectionsMenu = (props) => {
  const { sections, title } = props;

  return (
    <>
      {sections.length > 0 && (
        <>
          <h5>{title}</h5>
          <ul>
            {sections.map((data, index) => (
              <li key={index}>
                <a href={'#' + sectionID(data.title)}>{data.title}</a>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

const SectionContent = (props) => {
  const { sectionData, content } = props;

  const adaptationOptionsLinks = () => {
    let list = [];
    for (let adaptOpt of content[sectionData.field]) {
      list.push([adaptOpt['@id'], adaptOpt.title]);
    }
    return list;
  };

  return (
    <div id={sectionID(sectionData.title)} className="section">
      <h5 className="section-title">
        {sectionData.contentTitle !== undefined
          ? sectionData.contentTitle
          : sectionData.title}
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
        <HTMLField
          value={content[sectionData.field]}
          className="long_description"
        />
      )}
    </div>
  );
};

function CaseStudyView(props) {
  const { content } = props;

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
    return true;
  };

  const usedSections = (group) => {
    return dataDisplay.filter(
      (data) => data.group === group && hasValue(data.field),
    );
  };

  return (
    <div className="case-study-view">
      <div className="ui container">
        <Grid columns="12">
          <div className="row">
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={9}
              className="col-left"
            >
              <div className="ui label">Case studies</div>
              <h1>{content.title}</h1>
              <PrimaryPhoto {...props} />

              <HTMLField
                value={content.long_description}
                className="long_description"
              />

              <SectionsMenu sections={usedSections(1)} title={groups['1']} />
              <SectionsMenu sections={usedSections(2)} title={groups['2']} />
              <SectionsMenu sections={usedSections(3)} title={groups['3']} />
              <hr />

              {[1, 2, 3].map(
                (groupID, index) =>
                  usedSections(groupID).length > 0 && (
                    <Fragment key={index}>
                      <h4>{groups[groupID]}</h4>
                      {usedSections(groupID).map((data, index) => (
                        <SectionContent
                          sectionData={data}
                          content={content}
                          key={index}
                        />
                      ))}
                      {groupID !== 3 ? <hr /> : null}
                    </Fragment>
                  ),
              )}

              <PublishedModifiedInfo {...props} />
              <hr />
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
              <ShareInfo {...props} />
            </Grid.Column>
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={3}
              className="col-right"
            >
              <div style={{}}>
                <PhotoGallery {...props} />
                <DocumentsList {...props} />
                <ContentMetadata {...props} />
              </div>
            </Grid.Column>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default CaseStudyView;
