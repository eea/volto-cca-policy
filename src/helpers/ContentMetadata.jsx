import {
  ACE_COUNTRIES,
  BIOREGIONS,
  SUBNATIONAL_REGIONS,
} from '@eeacms/volto-cca-policy/helpers';

function render(value, valueType) {
  if (valueType === 'element') {
    return [BIOREGIONS[value]];
  }

  if (valueType === 'macrotrans') {
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

  if (valueType === 'biotrans') {
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

  if (valueType === 'countries') {
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

  if (valueType === 'subnational') {
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
        out.push(region);
      }
    }
    return out;
  }

  if (valueType === 'city') {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return null;
      }
      return value;
    } else {
      let out = [];
      out.push(value);
      return out;
    }
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
  let order = [
    'element',
    'macrotrans',
    'biotrans',
    'countries',
    'subnational',
    'city',
  ];

  const sectionTitles = {
    element: '',
    macrotrans: 'Macro-Transnational region',
    biotrans: 'Biogeographical regions',
    countries: 'Countries',
    subnational: 'Sub Nationals',
    city: 'City',
  };

  if (isObservatoryPage) {
    order = ['element', 'macrotrans'];
  }

  for (let key of order) {
    let element = geoElements[key];

    if (element) {
      let rendered = render(element, key);
      console.log(rendered);
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
  console.log('geoElements', geoElements);
  console.log('rendered', rendered);

  // element
  // --
  // <p>BIOREGIONS[v]</p>
  //
  // macrotrans
  // <div class='sidebar_bold'>
  // <h5>Macro-Transnational region:</h5>
  // <p>join BIOREGIONS[v]</p>
  // </div>
  //
  // biotrans
  // <div class='sidebar_bold'>
  // <h5>Biogeographical regions</h5>
  // <p>join BIOREGIONS[v] sau v</p>
  // </div>
  //
  // countries
  // <div class='sidebar_bold'>
  // h5 Countries
  // p join COUNTRIES[v] sau v
  // </div>
  //
  // subnational
  // <div class='sidebar_bold'>
  // h5 Sub Nationals
  // p join SUBNATIONALS[v] sau v
  // </div>
  //
  // city
  // <div class='sidebar_bold'>
  // h5 City
  // p join v
  // <div>

  if (rendered === null) {
    return <div>TODO</div>;
    /* TODO
      https://github.com/eea/eea.climateadapt.plone/blob/master/eea/climateadapt/browser/pt/ace_macros.pt#L245
      geochar = view.render_geochar(context.geochars)
      DA geochar --> structure geochar
      NU geochar -->
        ? spatial_layer
        ? spatial_values, adica Countries: join context.spatial_values
    */
  }

  return (
    <div className="geochar">
      {rendered.map(
        (section, index) =>
          section.value && (
            <div className="geochar-section" key={index}>
              <h5>{section.title}</h5>
              <p>{section.value.join(', ')}</p>
            </div>
          ),
      )}
    </div>
  );
}

function ContentMetadata(props) {
  const { content } = props;

  return (
    <div className="content-metadata">
      <h5>Keywords</h5>
      <span>{content.keywords.sort().join(', ')}</span>
      <h5>Geographic characterisation:</h5>
      <GeoChar value={content.geochars} />
    </div>
  );
}

export default ContentMetadata;
