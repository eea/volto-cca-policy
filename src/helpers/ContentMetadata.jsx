import {
  ACE_COUNTRIES,
  BIOREGIONS,
  SUBNATIONAL_REGIONS,
} from '@eeacms/volto-cca-policy/helpers';
import { Fragment } from 'react';
import { UniversalLink } from '@plone/volto/components';

function renderElement(value) {
  return [BIOREGIONS[value]];
}

function renderMacrotrans(value) {
  if (value === null) {
    return null;
  }
  let out = [];
  let temp = null;
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return null;
    }
  } else {
    temp = BIOREGIONS[value];
    if (temp !== undefined) {
      return [temp];
    } else {
      return [value];
    }
  }
  for (let region of value) {
    temp = BIOREGIONS[region];
    if (temp !== undefined) {
      out.push(temp);
    } else {
      out.push(region);
    }
  }
  return out;
}

function renderBiotrans(value) {
  if (value === null) {
    return null;
  }
  let out = [];
  let temp = null;
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return null;
    }
  } else {
    temp = BIOREGIONS[value];
    if (temp !== undefined) {
      return [temp];
    } else {
      return [value];
    }
  }
  for (let region of value) {
    temp = BIOREGIONS[region];
    if (temp !== undefined) {
      out.push(temp);
    } else {
      out.push(region);
    }
  }
  return out;
}

function renderCountries(value) {
  let out = [];
  let temp = null;
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return null;
    }
  } else {
    temp = ACE_COUNTRIES[value];
    if (temp !== undefined) {
      return [temp];
    } else {
      return [value];
    }
  }
  for (let region of value) {
    temp = ACE_COUNTRIES[region];
    if (temp !== undefined) {
      out.push(temp);
    } else {
      out.push(region);
    }
  }
  return out;
}

function renderSubnational(value) {
  let out = [];
  let temp = null;
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return null;
    }
  } else {
    temp = SUBNATIONAL_REGIONS[value];
    if (temp !== undefined) {
      return [temp];
    } else {
      return [value];
    }
  }
  for (let region of value) {
    temp = SUBNATIONAL_REGIONS[region];
    if (temp !== undefined) {
      out.push(temp);
    } else {
      // Show only defined terms, or show all (including missing IDs):
      // out.push(region);
    }
  }
  return out;
}

function renderCity(value) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return null;
    }
    return value;
  } else {
    if (value.length === 0) {
      return null;
    }
    let out = [];
    out.push(value);
    return out;
  }
}

function renderSection(value, valueType) {
  if (valueType === 'element') {
    return renderElement(value);
  }

  if (valueType === 'macrotrans') {
    return renderMacrotrans(value);
  }

  if (valueType === 'biotrans') {
    return renderBiotrans(value);
  }

  if (valueType === 'countries') {
    return renderCountries(value);
  }

  if (valueType === 'subnational') {
    return renderSubnational(value);
  }

  if (valueType === 'city') {
    return renderCity(value);
  }
  return null;
}

function renderGeochar(geoElements, isObservatoryPage = false) {
  // u'{"geoElements":{"element":"EUROPE",
  //                   "macrotrans":["TRANS_MACRO_ALP_SPACE"],
  //                   "biotrans":[],
  //                   "countries":[],
  //                   "subnational":[],
  //                   "city":""}}'
  if (!geoElements) {
    return null;
  }

  let out = [];
  let orderedSections = [
    'element',
    'macrotrans',
    'biotrans',
    'countries',
    'subnational',
    'city',
  ];

  const sectionTitles = {
    element: null,
    macrotrans: 'Macro-Transnational region:',
    biotrans: 'Biogeographical regions:',
    countries: 'Countries:',
    subnational: 'Sub Nationals:',
    city: 'City:',
  };

  if (isObservatoryPage) {
    orderedSections = ['element', 'macrotrans'];
  }

  for (let key of orderedSections) {
    let section = geoElements[key];

    if (section !== undefined) {
      let rendered = renderSection(section, key);
      out[key] = out.push({
        title: sectionTitles[key],
        value: rendered,
      });
    }
  }

  return out;
}

function GeoChar(props) {
  const { value } = props;
  const j = JSON.parse(value);

  if (j === null) {
    return '';
  }

  const { geoElements } = j;

  let rendered = renderGeochar(geoElements);

  if (rendered === null) {
    return <div>TODO: .spatial_layer / .spatial_values case</div>;
    /* https://github.com/eea/eea.climateadapt.plone/blob/master/eea/climateadapt/browser/pt/ace_macros.pt#L245 */
  }

  return (
    <div className="geochar">
      {rendered.map(
        (section, index) =>
          section.value && (
            <Fragment key={index}>
              {section.title && <h5>{section.title}</h5>}
              <p>{section.value.join(', ')}</p>
            </Fragment>
          ),
      )}
    </div>
  );
}

function PublicationDateInfo(props) {
  const { value, portaltype } = props;
  let tooltipText =
    'The date refers to the moment in which the item has been prepared or updated by contributing experts to be submitted for the publication in Climate ADAPT';

  if (portaltype === 'eea.climateadapt.video') {
    tooltipText = 'The date refers to the date of release of the video';
  }
  if (portaltype === 'eea.climateadapt.guidancedocument') {
    tooltipText =
      'The date refers to the latest date of publication of the item';
  }

  const publicationYear = new Date(value).getFullYear();
  return (
    <>
      <p>
        {publicationYear}
        <i className="ri-question-fill" title={tooltipText}></i>
      </p>
    </>
  );
} // TODO: (?) tooltip

function ItemsList(props) {
  // Usage:
  // <ItemsList value={content.governance_level} join="<br />" />
  // result: items on per line
  //
  // <ItemsList value={content.governance_level} />
  // result: item1, item2, item3
  let { value, join } = props;
  if (join === undefined) {
    join = ', ';
  }
  if (join === '<br />') {
    return (
      <span>
        {value.map((item, index) => (
          <Fragment key={index}>
            <span>{item.title}</span>
            <br />
          </Fragment>
        ))}
      </span>
    );
  }
  return <span>{value.map((item) => item.title).join(join)}</span>;
}

function ContentMetadata(props) {
  const { content } = props;

  if (content['@type'] === 'eea.climateadapt.adaptationoption') {
    return (
      <div className="content-metadata">
        <h5>Date of creation:</h5>
        <PublicationDateInfo
          value={content.publication_date}
          portaltype={content.portal_type}
        />
        {content?.keywords?.length > 0 && (
          <>
            <h5>Keywords:</h5>
            <span>{content?.keywords?.sort().join(', ')}</span>
          </>
        )}
        {content.sectors?.length > 0 && (
          <>
            <h5>Sectors:</h5>
            <ItemsList value={content.sectors} />
          </>
        )}
        {content.climate_impacts?.length > 0 && (
          <>
            <h5>Climate impacts:</h5>
            <ItemsList value={content.climate_impacts} />
          </>
        )}
        {content.governance_level?.length > 0 && (
          <>
            <h5>Governance level:</h5>
            <ItemsList value={content.governance_level} join="<br />" />
          </>
        )}
        {content.elements?.length > 0 && (
          <>
            <h5>Elements:</h5>
            <ItemsList value={content.elements} />
          </>
        )}
        {content.geochars && (
          <>
            <h5>Geographic characterisation:</h5>
            <GeoChar value={content.geochars} />
          </>
        )}
        {content.related_case_studies?.length > 0 && (
          <>
            <h5>Case studies related to this option</h5>
            <ul className="related-case-studies">
              {content.related_case_studies.map((item, index) => (
                <li key={index}>
                  <UniversalLink key={index} href={item.url}>
                    {item.title}
                  </UniversalLink>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  }

  if (content['@type'] === 'eea.climateadapt.casestudy') {
    return (
      <div className="content-metadata">
        <h5>Date of creation:</h5>
        <PublicationDateInfo
          value={content.publication_date}
          portaltype={content.portal_type}
        />
        {content?.keywords?.length > 0 && (
          <>
            <h5>Keywords:</h5>
            <span>{content?.keywords?.sort().join(', ')}</span>
          </>
        )}
        {content.sectors?.length > 0 && (
          <>
            <h5>Sectors:</h5>
            <ItemsList value={content.sectors} />
          </>
        )}
        {content.climate_impacts?.length > 0 && (
          <>
            <h5>Climate impacts:</h5>
            <ItemsList value={content.climate_impacts} />
          </>
        )}
        {content.elements?.length > 0 && (
          <>
            <h5>Elements:</h5>
            <ItemsList value={content.elements} />
          </>
        )}
        {content.governance_level?.length > 0 && (
          <>
            <h5>Governance level:</h5>
            <ItemsList value={content.governance_level} join="<br />" />
          </>
        )}
        {content.geochars && (
          <>
            <h5>Geographic characterisation:</h5>
            <GeoChar value={content.geochars} />
          </>
        )}
      </div>
    );
  }

  // Default render
  return (
    <div className="content-metadata">
      <h5>Date of creation:</h5>
      <PublicationDateInfo
        value={content.publication_date}
        portaltype={content.portal_type}
      />
      {content?.keywords?.length > 0 && (
        <>
          <h5>Keywords:</h5>
          <span>{content?.keywords?.sort().join(', ')}</span>
        </>
      )}
      {content.climate_impacts?.length > 0 && (
        <>
          <h5>Climate impacts:</h5>
          <ItemsList value={content.climate_impacts} />
        </>
      )}
      {content.elements?.length > 0 && (
        <>
          <h5>Elements:</h5>
          <ItemsList value={content.elements} />
        </>
      )}
      {content.sectors?.length > 0 && (
        <>
          <h5>Sectors:</h5>
          <ItemsList value={content.sectors} />
        </>
      )}
      {content.geochars && (
        <>
          <h5>Geographic characterisation:</h5>
          <GeoChar value={content.geochars} />
        </>
      )}
    </div>
  );
}

export default ContentMetadata;
