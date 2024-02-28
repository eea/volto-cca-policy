import {
  ACE_COUNTRIES,
  BIOREGIONS,
  SUBNATIONAL_REGIONS,
} from '@eeacms/volto-cca-policy/helpers';
import { Fragment } from 'react';
import { Popup } from 'semantic-ui-react';

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
  const { content } = props;
  const { spatial_values, spatial_layer, geochars } = content;
  const j = JSON.parse(geochars);

  if (j === null) {
    if (spatial_layer) {
      return (
        <div className="geochar">
          <p>{spatial_layer}</p>
          <h5>Countries:</h5>
          {spatial_values && spatial_values.length > 0 && (
            <p>{spatial_values.map((item) => item.token).join(', ')}</p>
          )}
        </div>
      );
    }

    return '';
  }

  const { geoElements } = j;

  let rendered = renderGeochar(geoElements);

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
  const { value, portaltype, title } = props;
  let tooltipText =
    'The date refers to the moment in which the item has been prepared or updated by contributing experts to be submitted for the publication in Climate ADAPT';

  if (portaltype === 'eea.climateadapt.video') {
    tooltipText = 'The date refers to the date of release of the video';
  }
  if (
    portaltype === 'eea.climateadapt.guidancedocument' ||
    portaltype === 'eea.climateadapt.indicator' ||
    portaltype === 'eea.climateadapt.publicationreport'
  ) {
    tooltipText =
      'The date refers to the latest date of publication of the item';
  }

  const publicationYear = new Date(value).getFullYear();
  return publicationYear > 1970 ? (
    <>
      <h5>{title}</h5>
      <p>
        {publicationYear}
        <Popup
          content={tooltipText}
          trigger={<i className="ri-question-fill"></i>}
        />
      </p>
    </>
  ) : null;
}

function ItemsList(props) {
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

  const hasGeoChars =
    content.geochars !== null || content.spatial_layer !== null;

  if (content['@type'] === 'eea.climateadapt.adaptationoption') {
    return (
      <div className="content-metadata">
        <PublicationDateInfo
          title="Date of creation:"
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
        {hasGeoChars && (
          <>
            <h5>Geographic characterisation:</h5>
            <GeoChar {...props} />
          </>
        )}
      </div>
    );
  }

  if (content['@type'] === 'eea.climateadapt.casestudy') {
    return (
      <div className="content-metadata">
        <PublicationDateInfo
          title="Date of creation:"
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
        {hasGeoChars && (
          <>
            <h5>Geographic characterisation:</h5>
            <GeoChar {...props} />
          </>
        )}
      </div>
    );
  }

  if (content['@type'] === 'eea.climateadapt.guidancedocument') {
    return (
      <div className="content-metadata">
        <PublicationDateInfo
          title="Date of publication:"
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
        {hasGeoChars && (
          <>
            <h5>Geographic characterisation:</h5>
            <GeoChar {...props} />
          </>
        )}
      </div>
    );
  }

  if (content['@type'] === 'eea.climateadapt.indicator') {
    return (
      <div className="content-metadata">
        <PublicationDateInfo
          title="Date of publication:"
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
        {hasGeoChars && (
          <>
            <h5>Geographic characterisation:</h5>
            <GeoChar {...props} />
          </>
        )}
      </div>
    );
  }

  if (content['@type'] === 'eea.climateadapt.publicationreport') {
    return (
      <div className="content-metadata">
        <PublicationDateInfo
          title="Date of publication:"
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
        {hasGeoChars && (
          <>
            <h5>Geographic characterisation:</h5>
            <GeoChar {...props} />
          </>
        )}
      </div>
    );
  }

  if (content['@type'] === 'eea.climateadapt.video') {
    return (
      <div className="content-metadata">
        <PublicationDateInfo
          title="Date of release:"
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
        {hasGeoChars && (
          <>
            <h5>Geographic characterisation:</h5>
            <GeoChar {...props} />
          </>
        )}
      </div>
    );
  }

  if (content['@type'] === 'eea.climateadapt.aceproject') {
    return (
      <div className="content-metadata">
        <PublicationDateInfo
          title="Date of creation:"
          value={content.publication_date}
          portaltype={content.portal_type}
        />
        {content.funding_programme?.title?.length > 0 && (
          <>
            <h5>Funding Programme:</h5>
            <span>{content.funding_programme.title}</span>
          </>
        )}
        {content?.keywords?.length > 0 && (
          <>
            <h5>Keywords:</h5>
            <span>{content?.keywords?.sort().join(', ')}</span>
          </>
        )}
        {content.duration && (
          <>
            <h5>Duration:</h5>
            <span>{content.duration}</span>
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
        {hasGeoChars && (
          <>
            <h5>Geographic characterisation:</h5>
            <GeoChar {...props} />
          </>
        )}
      </div>
    );
  }
  // Default render
  return (
    <div className="content-metadata">
      <PublicationDateInfo
        title="Date of creation:"
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
      {hasGeoChars && (
        <>
          <h5>Geographic characterisation:</h5>
          <GeoChar {...props} />
        </>
      )}
    </div>
  );
}

export default ContentMetadata;
