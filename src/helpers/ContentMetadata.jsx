import {
  ACE_COUNTRIES,
  BIOREGIONS,
  SUBNATIONAL_REGIONS,
} from '@eeacms/volto-cca-policy/helpers';

function GeoChar(props) {
  const { value } = props;
  const j = JSON.parse(value);

  const { geoElements } = j;

  function render(value, valueType) {
    if (valueType === 'element') {
      return BIOREGIONS[value];
    }
    if (valueType === 'macrotrans') {
      return BIOREGIONS[value];
    }
    // if (valueType === 'biotrans') {
    //   return BIOREGIONS[value];
    // }
    if (valueType === 'countries') {
      if (Array.isArray(value)) {
        let out = [];
        for (let country of value) {
          out.push(ACE_COUNTRIES[country]);
        }
        return out.join(', ');
      } else {
        return ACE_COUNTRIES[value];
      }
    }

    if (valueType === 'subnational') {
      if (Array.isArray(value)) {
        let out = [];
        for (let region of value) {
          out.push(SUBNATIONAL_REGIONS[region]);
        }
        return out.join(', ');
      } else {
        return SUBNATIONAL_REGIONS[value];
      }
    }

    if (valueType === 'city') {
      if (Array.isArray(value)) {
        return value.join(', ');
      }
    }

    return value;
  }

  function renderGeochar(geoElements, isObservatoryPage = false) {
    // u'{"geoElements":{"element":"EUROPE",
    //                   "macrotrans":["TRANS_MACRO_ALP_SPACE"],
    //                   "biotrans":[],
    //                   "countries":[],
    //                   "subnational":[],
    //                   "city":""}}'
    if (!geoElements) {
      return '';
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

    if (isObservatoryPage) {
      order = ['element', 'macrotrans'];
    }

    for (let key of order) {
      let element = geoElements[key];

      if (element) {
        let rendered = render(element, key);
        console.log(rendered);
        out.push(rendered);
      }
    }

    return out.join(' ');
  }

  console.log("ZZZZZZZZZZ");
  console.log(renderGeochar(geoElements));
  console.log(geoElements);

  // if (geoElements.element === 'GLOBAL') elements.push('Global');

  return renderGeochar(geoElements);

  /* TODO
    https://github.com/eea/eea.climateadapt.plone/blob/master/eea/climateadapt/browser/pt/ace_macros.pt#L245
    geochar = view.render_geochar(context.geochars)
    DA geochar --> structure geochar
    NU geochar -->
      ? spatial_layer
      ? spatial_values, adica Countries: join context.spatial_values
  */
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
