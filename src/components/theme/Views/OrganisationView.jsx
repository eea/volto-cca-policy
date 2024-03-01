import React, { Fragment } from 'react';
import { UniversalLink } from '@plone/volto/components';
import {
  HTMLField,
  ContentMetadata,
  LinksList,
  PublishedModifiedInfo,
  ShareInfo,
  BannerTitle,
} from '@eeacms/volto-cca-policy/helpers';
import { Segment, Divider, Image } from 'semantic-ui-react';
import cx from 'classnames';

function OrganisationView(props) {
  const { content } = props;
  const { long_description, websites, relatedItems, logo } = content;

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
      <BannerTitle content={content} type="Organisation" />

      <div className="ui container">
        <div>
          <div className={cx({ 'has-logo': logo })}>
            <h2>Description</h2>

            <Image
              src={logo.scales?.mini?.download}
              alt={content.title}
              className="org-logo"
            />
          </div>

          <HTMLField value={long_description} />
          <Divider />
          <h2>Reference information</h2>
        </div>

        {websites && websites?.length > 0 && (
          <LinksList title="Websites:" value={websites} />
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
            <h5>Organisation Documents ({organisationDocuments.length})</h5>

            {organisationDocuments.map((item, index) => (
              <>
                <a key={index} href={item['@id']}>
                  <i class="ri-file-line" />
                  {item.title}
                </a>
                <br />
              </>
            ))}
            <br />
          </>
        )}
        <div className="content-box">
          <div className="content-box-inner">
            <Segment>
              <ContentMetadata {...props} />
            </Segment>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganisationView;
