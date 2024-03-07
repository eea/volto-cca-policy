import {
  ACE_COUNTRIES,
  BIOREGIONS,
  SUBNATIONAL_REGIONS,
} from '@eeacms/volto-cca-policy/helpers';
import {
  VIDEO,
  GUIDANCE,
  INDICATOR,
  PUBICATION_REPORT,
} from '@eeacms/volto-cca-policy/helpers/Constants';
import { Fragment } from 'react';
import { Popup, Segment } from 'semantic-ui-react';
import { isObservatoryURL } from '@eeacms/volto-cca-policy/helpers/Utils';
import { useLocation } from 'react-router-dom';

function renderElement(value) {
  return [BIOREGIONS[value]];
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
    return renderBiotrans(value);
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

  if (portaltype === VIDEO) {
    tooltipText = 'The date refers to the date of release of the video';
  }
  if (
    portaltype === GUIDANCE ||
    portaltype === INDICATOR ||
    portaltype === PUBICATION_REPORT
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
  const {
    sectors,
    geochars,
    keywords,
    elements,
    duration,
    spatial_layer,
    health_impacts,
    climate_impacts,
    governance_level,
    key_type_measures,
    funding_programme,
  } = content;
  const type = content['@type'];
  const location = useLocation();
  const isObservatoryItem = isObservatoryURL(location.pathname);
  const hasGeoChars = geochars !== null || spatial_layer.length > 0;

  let date_title;
  if (type === VIDEO) {
    date_title = 'Date of release:';
  } else if (
    type === PUBICATION_REPORT ||
    type === INDICATOR ||
    type === GUIDANCE
  ) {
    date_title = 'Date of publication:';
  } else {
    date_title = 'Date of creation:';
  }

  return (
    <Segment>
      <div className="content-metadata">
        <PublicationDateInfo
          title={date_title}
          value={content?.publication_date}
          portaltype={content?.portal_type}
        />

        {isObservatoryItem && (
          <>
            {health_impacts && health_impacts?.length > 0 && (
              <>
                <h5>Health impact:</h5>
                <ItemsList value={health_impacts} />
              </>
            )}
          </>
        )}

        {keywords && keywords?.length > 0 && (
          <>
            <h5>Keywords:</h5>
            <span>{keywords?.sort().join(', ')}</span>
          </>
        )}

        {key_type_measures && key_type_measures?.length > 0 && (
          <>
            <h5>Key Type Measures:</h5>
            <ItemsList value={key_type_measures} />
          </>
        )}

        {!isObservatoryItem && (
          <>
            {climate_impacts && climate_impacts?.length > 0 && (
              <>
                <h5>Climate impacts:</h5>
                <ItemsList value={climate_impacts} />
              </>
            )}

            {elements && elements?.length > 0 && (
              <>
                <h5> Adaptation elements:</h5>
                <ItemsList value={elements} />
              </>
            )}

            {sectors && sectors?.length > 0 && (
              <>
                <h5>Sectors:</h5>
                <ItemsList value={sectors} />
              </>
            )}
          </>
        )}

        {governance_level && governance_level?.length > 0 && (
          <>
            <h5>Governance level:</h5>
            <ItemsList value={governance_level} join="<br />" />
          </>
        )}

        {!isObservatoryItem && (
          <>
            {funding_programme && funding_programme?.title?.length > 0 && (
              <>
                <h5>Funding Programme:</h5>
                <span>{funding_programme.title}</span>
              </>
            )}
          </>
        )}

        {duration && (
          <>
            <h5>Duration:</h5>
            <span>{duration}</span>
          </>
        )}

        {hasGeoChars && (
          <>
            <h5>Geographic characterisation:</h5>
            <GeoChar {...props} />
          </>
        )}
      </div>
    </Segment>
  );
}

export default ContentMetadata;
