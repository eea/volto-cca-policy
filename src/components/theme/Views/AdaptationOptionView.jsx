import React, { Fragment } from 'react';
import {
  HTMLField,
  ContentMetadata,
  LinksList,
  PublishedModifiedInfo,
  ShareInfo,
  BannerTitle,
} from '@eeacms/volto-cca-policy/helpers';
import { Segment, Divider } from 'semantic-ui-react';
import { UniversalLink } from '@plone/volto/components';
import cx from 'classnames';

function createDataField(type, field, section, title) {
  return {
    type,
    field,
    section,
    title,
  };
}

const dataDisplay = [
  createDataField('other', 'category', 'ao_category', 'Category'),
  createDataField('other', 'ipcc_category', 'ipcc_category', 'IPCC categories'),
  createDataField(
    'HTMLField',
    'stakeholder_participation',
    'stakeholder_participation',
    'Stakeholder participation',
  ),
  createDataField(
    'HTMLField',
    'success_limitations',
    'success_factors',
    'Success and Limiting Factors',
  ),
  createDataField(
    'HTMLField',
    'cost_benefit',
    'costs_benefits',
    'Costs and Benefits',
  ),
  createDataField('HTMLField', 'legal_aspects', 'legal', 'Legal Aspects'),
  createDataField(
    'HTMLField',
    'implementation_time',
    'implementation',
    'Implementation Time',
  ),
  createDataField('HTMLField', 'lifetime', 'life_time', 'Life Time'),
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

const SectionsMenu = (props) => {
  const { sections } = props;

  return (
    <div className="adaptation-details">
      <div>
        {sections.length > 0 && (
          <>
            <h3>Additional Details</h3>
            <ul>
              {sections.map((data, index) => (
                <li key={index}>
                  <a href={'#' + sectionID(data.title)}>{data.title}</a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div>
        <h3>Reference information</h3>
        <ul>
          <li>
            <a href="#websites">Websites</a>
          </li>
          <li>
            <a href="#source">Source</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

function AdaptationOptionView(props) {
  const { content } = props;
  const {
    related_case_studies,
    long_description,
    websites,
    source,
    ipcc_category,
  } = content;

  const usedSections = dataDisplay.filter((data) =>
    content?.hasOwnProperty(data.field),
  );

  return (
    <div className="db-item-view adaptation-option-view">
      <BannerTitle content={content} type="Adaptation Option" />

      <div className="ui container">
        <HTMLField value={long_description} />
        <SectionsMenu sections={usedSections} />
        <Divider />

        {content?.ipcc_category?.length > 0 && (
          <Fragment>
            <h2>Adaptation Details</h2>
            <div id={sectionID('IPCC categories')} className="section">
              <h5 className="section-title">IPCC categories</h5>
              {ipcc_category
                .map((item) => item.title)
                .sort()
                .join(', ')}

              {usedSections.length > 0 && (
                <>
                  {usedSections
                    .filter((data) => data.field !== 'ipcc_category')
                    .map((data, index) => (
                      <Fragment key={index}>
                        <div id={sectionID(data.title)} className="section">
                          <h5 className="section-title">{data.title}</h5>
                          <HTMLField value={content[data.field]} />
                        </div>
                      </Fragment>
                    ))}
                </>
              )}
            </div>
            <Divider />
          </Fragment>
        )}

        <h2>Reference information</h2>

        {websites && websites?.length > 0 && (
          <LinksList title="Websites:" value={websites} />
        )}

        <div id="source" className="section">
          <h5 id="source">References:</h5>
          <HTMLField value={source} />
        </div>

        <PublishedModifiedInfo {...props} />
        <ShareInfo {...props} />

        <div className="content-box">
          <div className="content-box-inner">
            <Segment>
              <ContentMetadata {...props} />
            </Segment>

            {related_case_studies?.length > 0 && (
              <div className="content-metadata">
                <Segment>
                  <h5>Case studies related to this option</h5>
                  <ul
                    className={cx('related-case-studies', {
                      columned: related_case_studies?.length > 5,
                    })}
                  >
                    {related_case_studies.map((item, index) => (
                      <li key={index}>
                        <UniversalLink key={index} href={item.url}>
                          {item.title}
                        </UniversalLink>
                      </li>
                    ))}
                  </ul>
                </Segment>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdaptationOptionView;
