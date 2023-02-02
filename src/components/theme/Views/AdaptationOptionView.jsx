import React from 'react';
import { HTMLField, ContentMetadata } from '@eeacms/volto-cca-policy/helpers';
import { Fragment } from 'react';

function AdaptationOptionView(props) {
  const { content } = props;

  let dataDisplay = [
    {
      type: 'TODO',
      field: 'TODO',
      section: 'ao_category',
      title: 'Category',
    },
    {
      type: 'TODO',
      field: 'TODO',
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
      field: 'life_time',
      section: 'life_time',
      title: 'Life Time',
    },
  ];

  const findSection = (title) => {
    const found = dataDisplay.filter((item) => item.title === title);
    console.log("SEARCH", title);
    console.log("FOUND", found);
    if (found.length > 0) {
      console.log(found[0]);
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

              <div id={sectionID('Category')}>
                <p>
                  <i>Category</i>
                </p>
                {content.category
                  .map((item) => item.token)
                  .sort()
                  .map((cat, index) => (
                    <Fragment key={index}>
                      {cat}
                      <br />
                    </Fragment>
                  ))}
              </div>
              <br />

              <div id={sectionID('IPCC categories')}>
                <p>
                  <i>IPCC categories</i>
                </p>
                {content.ipcc_category
                  .map((item) => item.title)
                  .sort()
                  .join(', ')}
                {dataDisplay.length > 0 && (
                  <>
                    {dataDisplay.map(
                      (data, index) =>
                        content.hasOwnProperty(data.field) && (
                          <Fragment key={index}>
                            <br />

                            <div id={sectionID(data.title)}>
                              <p>
                                <i>{data.title}</i>
                              </p>
                              <HTMLField
                                value={content[data.field]}
                                className="long_description"
                              />
                            </div>
                          </Fragment>
                        ),
                    )}
                  </>
                )}
              </div>
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
