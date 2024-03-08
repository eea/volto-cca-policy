import React, { Fragment } from 'react';
import {
  HTMLField,
  ContentMetadata,
  ReferenceInfo,
  PublishedModifiedInfo,
  ShareInfo,
  BannerTitle,
  ItemLogo,
} from '@eeacms/volto-cca-policy/helpers';
import { Segment, Divider, Grid, ListItem, List } from 'semantic-ui-react';
import { UniversalLink } from '@plone/volto/components';
import { PortalMessage } from '@eeacms/volto-cca-policy/components';
import AnchorLink from 'react-anchor-link-smooth-scroll';

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
      <Grid columns="12">
        <Grid.Column mobile={12} tablet={12} computer={6}>
          {sections.length > 0 && (
            <>
              <h4>Additional Details</h4>
              <List bulleted>
                {sections.map((data, index) => (
                  <ListItem key={index}>
                    <AnchorLink href={'#' + sectionID(data.title)}>
                      {data.title}
                    </AnchorLink>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Grid.Column>
        <Grid.Column mobile={12} tablet={12} computer={6}>
          <h4>Reference information</h4>
          <List bulleted>
            <ListItem>
              <AnchorLink href="#websites">Websites</AnchorLink>
            </ListItem>
            <ListItem>
              <AnchorLink href="#source">Source</AnchorLink>
            </ListItem>
          </List>
        </Grid.Column>
      </Grid>
    </div>
  );
};

function AdaptationOptionView(props) {
  const { content } = props;
  const { related_case_studies, long_description, ipcc_category } = content;

  const usedSections = dataDisplay.filter((data) =>
    content?.hasOwnProperty(data.field),
  );

  return (
    <div className="db-item-view adaptation-option-view">
      <BannerTitle
        content={{ ...content, image: '' }}
        type="Adaptation Option"
      />

      <div className="ui container">
        <PortalMessage content={content} />
        <Grid columns="12">
          <div className="row">
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={8}
              className="col-left"
            >
              <ItemLogo {...props}></ItemLogo>
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
                              <div
                                id={sectionID(data.title)}
                                className="section"
                              >
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

              <ReferenceInfo content={content} />

              <PublishedModifiedInfo {...props} />
              <ShareInfo {...props} />
            </Grid.Column>

            <Grid.Column
              mobile={12}
              tablet={12}
              computer={4}
              className="col-right"
            >
              <ContentMetadata {...props} />

              {related_case_studies?.length > 0 && (
                <Segment>
                  <h5>Case studies related to this option:</h5>
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
              )}
            </Grid.Column>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default AdaptationOptionView;
