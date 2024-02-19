import React, { Fragment } from 'react';
import {
  HTMLField,
  ContentMetadata,
  LinksList,
  PublishedModifiedInfo,
  ShareInfo,
  BannerTitle,
} from '@eeacms/volto-cca-policy/helpers';
import { Grid } from 'semantic-ui-react';

const dataDisplay = [
  {
    type: 'other',
    field: 'category',
    section: 'ao_category',
    title: 'Category',
  },
  {
    type: 'other',
    field: 'ipcc_category',
    section: 'ipcc_category',
    title: 'IPCC categories',
  },
  {
    type: 'HTMLField',
    field: 'stakeholder_participation',
    section: 'stakeholder_participation',
    title: 'Stakeholder participation',
  },
  {
    type: 'HTMLField',
    field: 'success_limitations',
    section: 'success_factors',
    title: 'Success and Limiting Factors',
  },
  {
    type: 'HTMLField',
    field: 'cost_benefit',
    section: 'costs_benefits',
    title: 'Costs and Benefits',
  },
  {
    type: 'HTMLField',
    field: 'legal_aspects',
    section: 'legal',
    title: 'Legal Aspects',
  },
  {
    type: 'HTMLField',
    field: 'implementation_time',
    section: 'implementation',
    title: 'Implementation Time',
  },
  {
    type: 'HTMLField',
    field: 'lifetime',
    section: 'life_time',
    title: 'Life Time',
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

const SectionsMenu = (props) => {
  const { sections } = props;

  return (
    <>
      {sections.length > 0 && (
        <>
          <h5 className="Adaptation-option-selector">Additional Details</h5>
          <ul>
            {sections.map((data, index) => (
              <li key={index}>
                <a href={'#' + sectionID(data.title)}>{data.title}</a>
              </li>
            ))}
          </ul>
        </>
      )}
      <>
        <h5 className="Adaptation-option-selector">Reference information</h5>
        <ul>
          <li>
            <a href="#websites">Websites</a>
          </li>
          <li>
            <a href="#source">Source</a>
          </li>
        </ul>
      </>
      <hr />
    </>
  );
};

function AdaptationOptionView(props) {
  const { content } = props;

  const usedSections = dataDisplay.filter((data) =>
    content?.hasOwnProperty(data.field),
  );

  return (
    <div className="adaptation-option-view">
      <BannerTitle content={content} type="Adaptation Option" />

      <div className="ui container">
        <Grid columns="12">
          <div className="row">
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={9}
              className="col-left"
            >
              <HTMLField
                value={content.long_description}
                className="long_description"
              />

              <SectionsMenu sections={usedSections} />

              {content?.ipcc_category?.length > 0 && (
                <Fragment>
                  <h4>Adaptation Details</h4>

                  <div id={sectionID('IPCC categories')} className="section">
                    <h5 className="section-title">IPCC categories</h5>
                    {content.ipcc_category
                      .map((item) => item.title)
                      .sort()
                      .join(', ')}
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
                  </div>
                  <hr />
                </Fragment>
              )}

              <h4>Reference information</h4>

              {content?.websites?.length > 0 && (
                <LinksList title="Websites:" value={content.websites} />
              )}

              <div id="source" className="section">
                <h5>References:</h5>
                <HTMLField value={content.source} />
              </div>

              <PublishedModifiedInfo {...props} />
              <ShareInfo {...props} />
            </Grid.Column>
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={3}
              className="col-right"
            >
              <div style={{}}>
                <ContentMetadata {...props} />
              </div>
            </Grid.Column>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default AdaptationOptionView;
