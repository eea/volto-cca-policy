import React from 'react';
import { HTMLField, ContentMetadata } from '@eeacms/volto-cca-policy/helpers';

function OrganisationView(props) {
  const { content } = props;

  let organisationDocuments = [];
  let relatedItems = [];
  if (content?.relatedItems?.length > 0) {
    organisationDocuments = content.relatedItems.filter(item => item['@type']=='File');
    relatedItems = content.relatedItems.filter(item => item['@type'].includes('eea.climateadapt'));
  }

  return (
    <div className="tool-view">
    <div className="ui container">
      <div className="ui grid">
        <div className="row">
          <div className="nine wide column left-col">
            <div className="ui label">Organisation</div>
            <h1>{content.title}</h1>
            <h4>Description</h4>
            <HTMLField
              value={content.long_description}
              className="long_description"
            />
            <hr />
            <h4>Reference information</h4>

            {content?.websites?.length > 0 && (
              <>
                <h5>Websites</h5>

                {content.websites.map((url) => (
                  <a key={url} href={url}>
                    {url}
                  </a>
                ))}
              </>
            )}
            {relatedItems.length > 0 && (
              <>
                <h5>Related content:</h5>

                {relatedItems
                  .map((item, index) => (
                    <>
                      <a key={index} href={item['@id']}>
                        {item.title}
                      </a><br />
                    </>
                ))}
              </>
            )}

            </div>
            <div className="three wide column right-col">
            {organisationDocuments.length > 0 && (
              <>
                <h5>Organisation Documents ({organisationDocuments.length})</h5>

                {organisationDocuments.map((item, index) => (
                    <>
                      <a key={index} href={item['@id']}>
                        {item.title}
                      </a><br />
                    </>
                ))}
                <br />
              </>
            )}
              <div style={{}}>
                <ContentMetadata {...props} />
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
}

export default OrganisationView;
