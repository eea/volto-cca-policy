import React from 'react';
import { Fragment } from 'react';
import {
  HTMLField,
  ContentMetadata,
  LinksList,
  PublishedModifiedInfo,
} from '@eeacms/volto-cca-policy/helpers';

const PrimaryPhoto = (props) => {
  const { content } = props;

  return content.primary_photo !== null ? (
    <div className="case-studies-review-image-wrapper">
      <img
        src={content.primary_photo.scales.mini.download}
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
    type: 'HTMLField',
    field: 'adapt_options',
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
    field: 'relevance',
    section: 'relevance_anchor',
    title: 'Importance and Relevance of Adaptation',
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
    type: 'HTMLField',
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
    group: 3,
  },
];

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
        {photos.map((photo) => (
          <li>
            <a href={photo.url}>{photo.title}</a>
          </li>
        ))}
      </ul>
    </>
  );
};

const SectionsMenu = (props) => {
  const { sections } = props;

  return (
    <>
      {sections.length > 0 && (
        <>
          <h5>Case Study Description</h5>
          <ul>
            {sections
              .filter((item) => item.group === 1)
              .map((data, index) => (
                <li key={index}>
                  <a href={'#' + sectionID(data.title)}>{data.title}</a>
                </li>
              ))}
          </ul>
        </>
      )}
      {sections.length > 0 && (
        <>
          <h5>Additional Details</h5>
          <ul>
            {sections
              .filter((item) => item.group === 2)
              .map((data, index) => (
                <li key={index}>
                  <a href={'#' + sectionID(data.title)}>{data.title}</a>
                </li>
              ))}
          </ul>
        </>
      )}
      {sections.length > 0 && (
        <>
          <h5>Reference Information</h5>
          <ul>
            {sections
              .filter((item) => item.group === 3)
              .map((data, index) => (
                <li key={index}>
                  <a href={'#' + sectionID(data.title)}>{data.title}</a>
                </li>
              ))}
          </ul>
        </>
      )}
      <hr />
    </>
  );
};

function CaseStudyView(props) {
  const { content } = props;

  const usedSections = dataDisplay.filter((data) =>
    content.hasOwnProperty(data.field),
  );

  return (
    <div className="case-study-view">
      <div className="ui container">
        <div className="ui grid">
          <div className="row">
            <div className="nine wide column left-col">
              <div className="ui label">Case studies</div>
              <h1>{content.title}</h1>
              <PrimaryPhoto {...props} />

              <HTMLField
                value={content.long_description}
                className="long_description"
              />

              <SectionsMenu sections={usedSections} />

              {usedSections.length > 0 && (
                <>
                  {usedSections.map((data, index) => (
                    <Fragment key={index}>
                      <div id={sectionID(data.title)} className="section">
                        <h5 className="section-title">{data.title}</h5>
                        <HTMLField
                          value={content[data.field]}
                          className="long_description"
                        />
                      </div>
                    </Fragment>
                  ))}
                </>
              )}
              <h4>Challenges</h4>
              <HTMLField value={content.challenges} className="challenges" />
              <h4>Objectives</h4>
              <HTMLField value={content.objectives} className="objectives" />
              <hr />
              <h4>Reference information</h4>

              {content?.websites?.length > 0 && (
                <LinksList title="Websites" value={content.websites} />
              )}

              <h5>Source</h5>
              <HTMLField value={content.source} />
              <PublishedModifiedInfo {...props} />
            </div>
            <div className="three wide column right-col">
              <div style={{}}>
                <PhotoGallery {...props} />
                <ContentMetadata {...props} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaseStudyView;
