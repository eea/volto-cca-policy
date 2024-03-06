import React, { Fragment } from 'react';
import { UniversalLink } from '@plone/volto/components';
import {
  HTMLField,
  ContentMetadata,
  LinksList,
  PublishedModifiedInfo,
  ShareInfo,
  BannerTitle,
  LogoWrapper,
} from '@eeacms/volto-cca-policy/helpers';
import { PortalMessage } from '@eeacms/volto-cca-policy/components';
import { Divider, Image, Grid } from 'semantic-ui-react';

function OrganisationView(props) {
  const { content } = props;
  const {
    long_description,
    websites,
    relatedItems,
    logo,
    title,
    organisational_key_activities,
    organisational_websites,
    organisational_contact_information,
  } = content;

  let organisationDocuments = [];
  let contentRelatedItems = [];
  if (relatedItems && relatedItems?.length > 0) {
    organisationDocuments = relatedItems.filter(
      (item) => item['@type'] === 'File',
    );

    contentRelatedItems = relatedItems.filter((item) =>
      item['@type'].includes('eea.climateadapt'),
    );
  }

  return (
    <div className="db-item-view organisation-view">
      <BannerTitle content={{ ...content, image: '' }} type="Organisation" />

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
              <LogoWrapper logo={logo}>
                <h2>Description</h2>
                {logo && (
                  <Image
                    src={logo?.scales?.mini?.download}
                    alt={title}
                    className="db-logo"
                  />
                )}
              </LogoWrapper>
              <HTMLField value={long_description} />

              {organisational_key_activities && (
                <>
                  <h3>Key activities within climate change and health</h3>
                  <HTMLField value={organisational_key_activities} />
                </>
              )}

              <Divider />

              <h2>Reference information</h2>
              {websites && websites?.length > 0 && (
                <LinksList title="Websites:" value={websites} />
              )}

              {organisational_websites && (
                <>
                  <h5>Links to further information</h5>
                  <HTMLField value={organisational_websites} />
                </>
              )}

              {organisational_contact_information && (
                <>
                  <h5>Contact information for the Observatory</h5>
                  <HTMLField value={organisational_contact_information} />
                </>
              )}

              {contentRelatedItems.length > 0 && (
                <>
                  <h5>Related content:</h5>

                  {contentRelatedItems.map((item, index) => (
                    <Fragment key={index}>
                      <UniversalLink item={item}>{item.title}</UniversalLink>
                      <br />
                    </Fragment>
                  ))}
                </>
              )}
              <PublishedModifiedInfo {...props} />
              <ShareInfo {...props} />
              {organisationDocuments.length > 0 && (
                <>
                  <h5>
                    Organisation Documents ({organisationDocuments.length})
                  </h5>

                  {organisationDocuments.map((item, index) => (
                    <>
                      <a key={index} href={item['@id']}>
                        <i className="ri-file-line" />
                        {item.title}
                      </a>
                      <br />
                    </>
                  ))}
                  <br />
                </>
              )}
            </Grid.Column>

            <Grid.Column
              mobile={12}
              tablet={12}
              computer={4}
              className="col-right"
            >
              <ContentMetadata {...props} />
            </Grid.Column>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default OrganisationView;
