export function getFocusCountryNames() {
  return [
    'Austria',
    'Belgium',
    'Bulgaria',
    'Cyprus',
    'Croatia',
    'Czechia',
    'Denmark',
    'Estonia',
    'Finland',
    'France',
    'Germany',
    'Greece',
    'Hungary',
    'Iceland',
    'Ireland',
    'Italy',
    'Latvia',
    'Lithuania',
    'Luxembourg',
    'Malta',
    'Netherlands',
    'Poland',
    'Portugal',
    'Romania',
    'Slovakia',
    'Slovenia',
    'Spain',
    'Sweden',
    'United Kingdom',
    'Liechtenstein',
    'Norway',
    'Switzerland',
    'Turkey',
  ];
}

export function getFocusCountriesFeature(world) {
  const focusCountryNames = getFocusCountryNames();
  let features = {
    type: 'FeatureCollection',
    features: [],
  };
  world.features.forEach(function (c) {
    if (focusCountryNames.indexOf(c.properties.SHRT_ENGL) === -1) {
      return;
    }
    features.features.push(c);
  });
  return features;
}

// tooltip with country names on hover
let countryNameTooltip = null;

export function renderCountriesBox(opts, d3, d3Geo) {
  countryNameTooltip = d3.select('body').append('div').attr('class', 'tooltip');

  const coords = opts.coordinates;
  const countries = opts.focusCountries;
  const countries_metadata = opts.countries_metadata;
  if (opts.thematic_map_mode.toLowerCase().indexOf('policy') > -1) {
    window._selectedMapSection = 'overview';
  } else if (opts.thematic_map_mode.toLowerCase().indexOf('climate') > -1) {
    window._selectedMapSection = 'climate';
  } else {
    window._selectedMapSection = 'portals';
  }

  const svg = opts.svg;
  const world = opts.world;
  const zoom = opts.zoom;
  const cprectid = makeid(); // unique id for this map drawing

  const globalMapProjection = d3Geo.geoAzimuthalEqualArea();

  globalMapProjection.scale(1).translate([0, 0]);

  // the path transformer
  let path = d3Geo.geoPath().projection(globalMapProjection);

  const x = coords.x;
  const y = coords.y;
  const width = coords.width;
  const height = coords.height;

  const b = path.bounds(countries.feature);
  const cwRatio = (b[1][0] - b[0][0]) / width; // bounds to width ratio
  const chRatio = (b[1][1] - b[0][1]) / height; // bounds to height ratio
  const s = zoom / Math.max(cwRatio, chRatio);
  const t = [
    (width - s * (b[1][0] + b[0][0])) / 2 + x,
    (height - s * (b[0][1] + b[1][1])) / 2 + y,
  ];

  globalMapProjection.scale(s).translate(t);

  let defs = svg.append('defs'); // rectangular clipping path for the whole drawn map
  defs
    .append('clipPath')
    .attr('id', cprectid)
    .append('rect')
    .attr('x', x)
    .attr('y', y)
    .attr('height', height)
    .attr('width', width);

  // NAS + NAP + SAP
  let pattern = defs
    .append('pattern')
    .attr('id', 'nasnapsap')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', '8')
    .attr('height', '5')
    .attr('patternTransform', 'scale(1) rotate(45)');
  pattern
    .append('rect')
    .attr('x', '0')
    .attr('y', '0')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('fill', '#007db6');
  pattern
    .append('line')
    .attr('x1', '0')
    .attr('y', '0')
    .attr('x2', '0')
    .attr('y2', '11')
    .attr('stroke-linecap', 'square')
    .attr('stroke-width', '1')
    .attr('stroke', 'black')
    .attr('fill', '');

  // NAS + SAP
  pattern = defs
    .append('pattern')
    .attr('id', 'nassap')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', '8')
    .attr('height', '5')
    .attr('patternTransform', 'scale(1) rotate(45)');
  pattern
    .append('rect')
    .attr('x', '0')
    .attr('y', '0')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('fill', '#78d9fc');
  pattern
    .append('line')
    .attr('x1', '0')
    .attr('y', '0')
    .attr('x2', '0')
    .attr('y2', '11')
    .attr('stroke-linecap', 'square')
    .attr('stroke-width', '1')
    .attr('stroke', 'black')
    .attr('fill', '');

  // NAP + SAP
  pattern = defs
    .append('pattern')
    .attr('id', 'napsap')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', '8')
    .attr('height', '5')
    .attr('patternTransform', 'scale(1) rotate(45)');
  pattern
    .append('rect')
    .attr('x', '0')
    .attr('y', '0')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('fill', '#11cbff');
  pattern
    .append('line')
    .attr('x1', '0')
    .attr('y', '0')
    .attr('x2', '0')
    .attr('y2', '11')
    .attr('stroke-linecap', 'square')
    .attr('stroke-width', '1')
    .attr('stroke', 'black')
    .attr('fill', '');

  const map = svg // the map will be drawn in this group
    .append('g');
  // .attr('clip-path', 'url(#' + cprectid + ')')
  //.attr("clip-path", opts.isMaplet ? "url(#" + cprectid + ")" : null
  map // the world sphere, acts as ocean
    .append('path')
    .datum({
      type: 'Sphere',
    })
    .attr('class', 'sphere')
    .attr('d', path);

  renderGraticule(map, 'graticule', [20, 10], path, d3Geo);
  renderGraticule(map, 'semi-graticule', [5, 5], path, d3Geo);

  world.forEach(function (country) {
    renderCountry(map, country, path, countries, x, y, d3, countries_metadata);
  });

  return path;
}

function renderGraticule(container, klass, steps, pathTransformer, d3Geo) {
  container // draw primary graticule lines
    .append('g')
    .attr('class', klass)
    .selectAll('path')
    .data(d3Geo.geoGraticule().step(steps).lines())
    .enter()
    .append('path')
    .attr('d', pathTransformer);
}

function makeid() {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function renderCountry(
  map,
  country,
  path,
  countries,
  x,
  y,
  d3,
  countries_metadata,
) {
  var cprectid = makeid(); // unique id for this map drawing
  var klass = getCountryClass(country, countries, countries_metadata);
  var cId = 'c-' + cprectid + '-' + country.properties.id;
  var cpId = 'cp-' + cprectid + '-' + country.properties.id;

  var available = countries.names.indexOf(country.properties.SHRT_ENGL) !== -1;
  if (available) {
    klass += ' ue';
  }

  var parent = map.append('g').attr('class', klass);
  parent // define clipping path for this country
    .append('defs')
    .append('clipPath')
    .attr('id', cpId)
    .append('path')
    .attr('d', path(country))
    .attr('x', x)
    .attr('y', y);

  var outline = parent // this is the country fill and outline
    .append('path')
    .attr('id', cId)
    .attr('x', x)
    .attr('y', y)
    .attr('d', path(country));
  if (available) {
    var bbox = outline.node().getBBox();
    renderCountryFlag(parent, country, bbox, cpId, d3, countries_metadata);
  }
}

function getCountryClass(country, countries, countries_metadata) {
  let k = 'country-outline';
  const countryName = country.properties.SHRT_ENGL;
  if (!countries_metadata) {
    return 'country-outline';
  }
  if (countries_metadata.length < 1) {
    return 'country-outline';
  }
  if (!countries_metadata[0].hasOwnProperty(countryName)) {
    return 'country-outline';
  }
  const countryNoData = ['United Kingdom'];
  const discodata = countries_metadata[0][countryName][0];
  if (window._selectedMapSection === 'overview') {
    let { nap_info, nas_info, sap_info, notreported } = discodata;
    const nasNapSapAdopted = nap_info && nas_info && sap_info;
    const nasSapAdopted = !nap_info && nas_info && sap_info;
    const napSapAdopted = nap_info && !nas_info && sap_info;
    const nasNapAdopted = nap_info && nas_info && !sap_info;
    const onlyNasAdopted = !nap_info && nas_info && !sap_info;
    const onlyNapAdopted = nap_info && !nas_info && !sap_info;
    const noneAdopted = !(nap_info && nas_info && sap_info);

    if (notreported) {
      k += ' country-notreported';
    } else if (nasNapSapAdopted) {
      k += ' country-nasnapsap';
    } else if (nasSapAdopted) {
      k += ' country-nassap';
    } else if (napSapAdopted) {
      k += ' country-napsap';
    } else if (nasNapAdopted) {
      k += ' country-nasnap';
    } else if (onlyNapAdopted) {
      k += ' country-nap';
    } else if (onlyNasAdopted) {
      k += ' country-nas';
    } else if (noneAdopted) {
      k += ' country-none';
    }
  }

  if (window._selectedMapSection === 'climate') {
    let { cciva_info, notreported } = discodata;

    if (notreported) {
      k += ' country-notreported';
    } else if (cciva_info) {
      k += ' country-nasnap';
    } else if (!cciva_info) {
      k += ' country-none';
    }

    if (countryNoData.indexOf(countryName) > -1) {
      k += ' country-nodata';
    }
  }
  if (window._selectedMapSection === 'portals') {
    let { focus_info, notreported } = discodata;

    if (notreported) {
      k += ' country-notreported';
    } else if (
      ['both', 'hazard', 'adaptation', 'not_specified'].includes(focus_info)
    ) {
      k += ' country-nasnap';
    } else {
      k += ' country-noportal';
    }

    if (countryNoData.indexOf(countryName) > -1) {
      k += ' country-nodata';
    }
  }
  return k;
}

function renderCountryFlag(
  parent,
  country,
  bbox,
  cpId,
  d3,
  countries_metadata,
) {
  const countryName = country.properties.SHRT_ENGL;
  var flag = parent
    .on('click', function () {
      showMapTooltip(country, countries_metadata, d3);
    })
    .on('mouseover', function () {
      d3.select(this).attr('opacity', 1);
      return countryNameTooltip.style('display', 'block').html(countryName);
    })
    .on('mousemove', function (event) {
      const cmt = countryNameTooltip
        .style('display', 'block')
        .style('top', d3.event.pageY + 'px')
        .style('left', d3.event.pageX + 10 + 'px')
        .html(countryName);
      return cmt;
    })
    .on('mouseout', function () {
      return countryNameTooltip.style('display', 'none');
    });
  return flag;
}

/*function getIEVersion() {
  var sAgent = window.navigator.userAgent;
  var Idx = sAgent.indexOf('MSIE');

  // If IE, return version number.
  if (Idx > 0)
    return parseInt(sAgent.substring(Idx + 5, sAgent.indexOf('.', Idx)));
  // If IE 11 then look for Updated user agent string.
  else if (navigator.userAgent.match(/Trident\/7\./)) return 11;
  else return 0; //It is not IE
}*/

function showMapTooltip(d, countries_metadata, d3) {
  const countryName = d.properties.SHRT_ENGL;
  const info = countries_metadata[0][countryName];
  if (!info) return;
  let content = info[0];
  const url = info[1];

  const noDataReportedMsg =
    'No data reported through the reporting mechanism of the Governance Regulation. Last information is available <a href="' +
    url +
    '">here</a>';
  const coords = [d3.event.pageY, d3.event.pageX];

  if (window._selectedMapSection === 'overview') {
    let napInfo, nasInfo, sapInfo;
    if (content['nap_info']) {
      napInfo = '<span>National Adaptation Plan:</span>' + content['nap_info'];
    } else {
      napInfo = '';
    }

    if (content['nas_info']) {
      nasInfo =
        '<span>National Adaptation Strategy:</span>' + content['nas_info'];
    } else {
      nasInfo = '';
    }

    if (content['sap_info']) {
      sapInfo = '<span>Sectoral Adaptation Plan:</span>' + content['sap_info'];
    } else {
      sapInfo = '';
    }

    if (content['notreported']) {
      content = noDataReportedMsg;
    } else {
      content = nasInfo + napInfo + sapInfo || 'NAS and NAP not reported';
    }
  }

  if (window._selectedMapSection === 'climate') {
    var ccivaInfo;

    if (content['cciva_info']) {
      ccivaInfo = content['cciva_info'];
    } else {
      ccivaInfo = 'No assessment reported';
    }

    if (content['notreported']) {
      content = noDataReportedMsg;
    } else {
      content = ccivaInfo;
    }
  }

  if (window._selectedMapSection === 'portals') {
    var ccivportalInfo;
    if (content['ccivportal_info']) {
      ccivportalInfo = content['ccivportal_info'];
    } else {
      ccivportalInfo = 'No portal or platform reported';
    }

    if (content['notreported']) {
      content = noDataReportedMsg;
    } else {
      content = ccivportalInfo;
    }
  }

  if (content)
    createTooltip({
      coords: coords,
      content: content,
      name: d.properties.SHRT_ENGL,
      flagUrl: d.url,
      url: url,
    });

  document.body.addEventListener('click', function (evt) {
    removeTooltip();
  });
  d3.event.stopPropagation();
}

function removeTooltip() {
  const elem = document.getElementById('map-tooltip');
  if (elem) {
    elem.parentElement.removeChild(elem);
  }
}

function createTooltip(opts) {
  const x = opts['coords'][0];
  const y = opts['coords'][1];
  const content = opts['content'];
  const name = opts['name'];
  const url = opts['url'];
  const flagUrl = opts['flagUrl'];

  removeTooltip();

  const contentHeader =
    '<div id="country-name"><a href="' +
    url +
    '"><h3>' +
    name +
    '</h3></a><img class="tooltip-country-flag" src="' +
    flagUrl +
    '" height="33" width="54"></div>';

  const style = 'top:' + x + 'px; left: ' + y + 'px';

  const node = document.createElement('div');
  node.setAttribute('id', 'map-tooltip');
  node.setAttribute('style', style);
  const body = document.getElementsByTagName('body')[0];
  node.innerHTML =
    contentHeader + '<div id="tooltip-content">' + content + '</div>';
  body.appendChild(node);
}
