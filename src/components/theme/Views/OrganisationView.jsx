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
import { Segment, Divider } from 'semantic-ui-react';

function OrganisationView(props) {
  const { content } = props;

  let organisationDocuments = [];
  let relatedItems = [];
  if (content?.relatedItems?.length > 0) {
    organisationDocuments = content.relatedItems.filter(
      (item) => item['@type'] === 'File',
    );

    relatedItems = content.relatedItems.filter((item) =>
      item['@type'].includes('eea.climateadapt'),
    );
  }

  return (
    <div className="db-item-view organisation-view">
      <BannerTitle content={content} type="Organisation" />

      <div className="ui container">
        <div>
          <h2>Description:</h2>
          <HTMLField value={content.long_description} />
          <Divider />
          <h2>Reference information</h2>
        </div>

        {content?.websites?.length > 0 && (
          <LinksList title="Websites:" value={content.websites} />
        )}

        {relatedItems.length > 0 && (
          <>
            <h5>Related content:</h5>

            {relatedItems.map((item, index) => (
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
        <div class="content-box">
          <div class="content-box-inner">
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
