import {
  ACE_COUNTRIES,
  BIOREGIONS,
  SUBNATIONAL_REGIONS,
} from '@eeacms/volto-cca-policy/helpers';

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
    macrotrans: 'Macro-Transnational region',
    biotrans: 'Biogeographical regions',
    countries: 'Countries',
    subnational: 'Sub Nationals',
    city: 'City',
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
            <div className="geochar-section" key={index}>
              {section.title && <h5>{section.title}</h5>}
              <p>{section.value.join(', ')}</p>
            </div>
          ),
      )}
    </div>
  );
}

function PublicationDateInfo(props) {
  const { value } = props;

  const publicationYear = new Date(value).getFullYear();
  return (
    <>
      <p>{publicationYear}</p>
      <span>
        The date refers to the moment in which the item has been prepared or
        updated by contributing experts to be submitted for the publication in
        Climate ADAPT
      </span>
    </>
  );
} // TODO: replace span with (?) tooltip

function ItemsList(props) {
  const { value } = props;

  return <span>{value.map((item) => item.title).join(', ')}</span>;
}

function ContentMetadata(props) {
  const { content } = props;

  return (
    <div className="content-metadata">
      <h5>Date of creation:</h5>
      <PublicationDateInfo value={content.publication_date} />
      <h5>Keywords:</h5>
      <span>{content.keywords.sort().join(', ')}</span>
      <h5>Climate impacts:</h5>
      <ItemsList value={content.climate_impacts} />
      <h5>Elements:</h5>
      <ItemsList value={content.elements} />
      <h5>Sectors:</h5>
      <ItemsList value={content.sectors} />
      <h5>Geographic characterisation:</h5>
      <GeoChar value={content.geochars} />
    </div>
  );
}

export default ContentMetadata;
