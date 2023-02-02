import React from 'react';
import { HTMLField, ContentMetadata } from '@eeacms/volto-cca-policy/helpers';

function AdaptationOptionView(props) {
  const { content } = props;

  let dataDisplay = [
    {
      type: 'HTMLField',
      field: 'stakeholder_participation',
      title: 'Stakeholder participation',
    },
    {
      type: 'HTMLField',
      field: 'success_limitations',
      title: 'Success and Limiting Factors',
    },
    {
      type: 'HTMLField',
      field: 'cost_benefit',
      title: 'Costs and Benefits',
    },
    {
      type: 'HTMLField',
      field: 'legal_aspects',
      title: 'Legal Aspects',
    },
    {
      type: 'HTMLField',
      field: 'implementation_time',
      title: 'Implementation Time',
    },
    {
      type: 'HTMLField',
      field: 'life_time',
      title: 'Life Time',
    },
  ];

  return (
    <div className="adaptation-option-view">
      <div className="ui container">
        <div className="ui grid">
          <div className="row">
            <div className="nine wide column left-col">
              <div className="ui label">Adaptation option</div>
              <h1>{content.title}</h1>
              <HTMLField
                value={content.long_description}
                className="long_description"
              />

              {dataDisplay.length > 0 && (
                <>
                  <h5 className="Adaptation-option-selector">
                    Additional Details
                  </h5>
                  <ul>
                    {dataDisplay.map(
                      (data, index) =>
                        content.hasOwnProperty(data.field) && (
                          <li key={index}>
                            <a href="#ao_category">{data.title}</a>
                          </li>
                        ),
                    )}
                  </ul>
                </>
              )}

              <h5 className="Adaptation-option-selector">
                Additional Details Old
              </h5>
              <ul>
                <li>
                  <a href="#ao_category">Category</a>
                </li>
                <li>
                  <a href="#ipcc_category">IPCC categories</a>
                </li>
                <li>
                  <a href="#stakeholder_participation">
                    Stakeholder participation
                  </a>
                </li>
                <li>
                  <a href="#success_factors">Success and Limiting Factors</a>
                </li>
                <li>
                  <a href="#costs_benefits">Costs and Benefits</a>
                </li>
                <li>
                  <a href="#legal">Legal Aspects</a>
                </li>
                <li>
                  <a href="#implementation">Implementation Time</a>
                </li>
              </ul>

              <h5 className="Adaptation-option-selector">
                Reference information
              </h5>
              <ul>
                <li>
                  <a href="#websites">Websites</a>
                </li>
                <li>
                  <a href="#source">Source</a>
                </li>
              </ul>

              <h4>Adaptation Details</h4>
              <br />
              <p>
                <i>Category</i>
              </p>
              {content.category
                .map((item) => item.token)
                .sort()
                .map((cat) => (
                  <>
                    {cat}
                    <br />
                  </>
                ))}
              <br />
              <p>
                <i>IPCC Categories</i>
              </p>
              {content.ipcc_category
                .map((item) => item.title)
                .sort()
                .join(', ')}
              {dataDisplay.length > 0 && (
                <>
                  {dataDisplay.map(
                    (data) =>
                      content.hasOwnProperty(data.field) && (
                        <>
                          <br />
                          <p>
                            <i>{data.title}</i>
                          </p>
                          <HTMLField
                            value={content[data.field]}
                            className="long_description"
                          />
                        </>
                      ),
                  )}
                </>
              )}
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

              <h5>Source</h5>
              <HTMLField value={content.source} />
            </div>
            <div className="three wide column right-col">
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

export default AdaptationOptionView;
