let _selectedMapSection = null;
export function getFocusCountryNames() {
  return [
    'Albania',
    'Austria',
    'Belgium',
    'Bosnia-Herzegovina',
    'Bosnia and Herzegovina',
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
    'Montenegro',
    'Netherlands',
    'North Macedonia',
    'Poland',
    'Portugal',
    'Romania',
    'Serbia',
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
  window._selectedMapSection = opts.thematic_map_mode;

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

  var map = svg // the map will be drawn in this group
    .append('g');
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
  if (!countries_metadata.hasOwnProperty(countryName)) {
    return 'country-outline';
  }
  const countryNoData = ['United Kingdom'];
  const meta = countries_metadata[countryName];
  if (window._selectedMapSection === 'hhap') {
    switch (meta.hhap) {
      case 'National HHAP':
        k += ' country-nationalhhap';
        break;
      case 'Subnational or local HHAP':
        k += ' country-subnationalhhap';
        break;
      case 'No HHAP':
        k += ' country-no-hhap';
        break;
      case 'No information':
        k += ' country-none';
        break;
      default:
    }
  }

  if (window._selectedMapSection === 'hhws') {
    switch (meta.hhws) {
      case 'HWWS exists':
        k += ' country-nationalhhap';
        break;
      case 'No information':
        k += ' country-none';
        break;
      default:
    }
  }

  return k;
}

export function renderCountryLabel(country, path, force, d3) {
  var parent = d3.select('.svg-map-container svg');
  var klass = force ? 'country-label maplet-label' : 'country-label';
  var g = parent.append('g').attr('class', klass);
  if (
    // these are very small countries that we will create a maplet for;
    (country.properties.SHRT_ENGL === 'Liechtenstein' ||
      country.properties.SHRT_ENGL === 'Luxembourg' ||
      country.properties.SHRT_ENGL === 'Malta') &&
    !force
  ) {
    return;
  }

  var delta = force ? 20 : 0;

  var pId = 'pl-' + country.id;
  var center = path.centroid(country);
  // console.log(center, path);

  var label = g
    .append('text')
    // .attr('class', 'place-label')
    .attr('id', pId)
    .attr('x', center[0])
    .attr('y', center[1] + delta)
    .attr('text-anchor', 'middle')
    .text(country.properties.SHRT_ENGL.toUpperCase());
  var bbox = label.node().getBBox();

  g.append('rect')
    // .attr('class', 'place-label-bg')
    .attr('x', bbox.x - 1)
    .attr('y', bbox.y - 1)
    .attr('width', bbox.width + 2)
    .attr('height', bbox.height + 2);

  label.raise();
  //passThruEvents(g);
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
    .append('image')
    .attr('class', 'country-flag')
    .attr('href', function () {
      if (getIEVersion() > 0) {
        return '++theme++climateadaptv2/static/images/fallback.svg';
      } else {
        return country.url;
      }
    })
    .attr('preserveAspectRatio', 'none')
    .attr('opacity', '0')
    .attr('clip-path', 'url(#' + cpId + ')')
    .attr('x', bbox.x)
    .attr('y', bbox.y)

    .attr('height', bbox.height)
    .attr('width', bbox.width)
    .on('click', function () {
      if (
        window._selectedMapSection === 'hhws' &&
        countries_metadata[countryName].hhws == 'HWWS exists'
      ) {
        // console.log(
        //   'Popup :',
        //   countryName,
        //   countries_metadata[countryName].hhws,
        //   d3.select(this).parent,
        // );
        showMapTooltip(country, countries_metadata, d3);
      }
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
      d3.select(this).attr('opacity', 0);
      return countryNameTooltip.style('display', 'none');
    });
  return flag;
}

function getIEVersion() {
  var sAgent = window.navigator.userAgent;
  var Idx = sAgent.indexOf('MSIE');

  // If IE, return version number.
  if (Idx > 0)
    return parseInt(sAgent.substring(Idx + 5, sAgent.indexOf('.', Idx)));
  // If IE 11 then look for Updated user agent string.
  else if (navigator.userAgent.match(/Trident\/7\./)) return 11;
  else return 0; //It is not IE
}

function showMapTooltip(d, countries_metadata, d3) {
  const countryName = d.properties.SHRT_ENGL;
  const coords = [d3.event.pageY, d3.event.pageX];
  // debugger;
  const info = countries_metadata[countryName];
  const website = info['website'];
  if (!info) return;
  let content = info['heat_index_description'];

  if (content)
    createTooltip({
      coords: coords,
      content: content,
      name: countryName,
      website: website,
    });

  // TODO: are there multiple onclick handlers here??
  // $('body').on('click', function () {
  //   $('#map-tooltip').remove();
  // });

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
  const website = opts['website'];

  removeTooltip();

  let contentHTML =
    '<div id="country-name"><h3>' +
    name +
    '</h3><i class="fa fa-times close-tooltip"></i></div>' +
    '<div id="tooltip-content"><div class="tooltip-content"><div class="heat_index_value">' +
    '<strong>Heat index of HHWS:</strong><span class="value">' +
    content +
    '</span></div>';
  if (website) {
    contentHTML +=
      '<p class="heat_index_website" style="margin-top:2em"><span class="link-https"><a href="' +
      website +
      '" target="_blank">HHWS website</a></span></p>';
  }
  contentHTML += '</div></div>';

  const style = 'top:' + x + 'px; left: ' + y + 'px';

  const node = document.createElement('div');
  node.setAttribute('id', 'map-tooltip');
  node.setAttribute('style', style);
  const body = document.getElementsByTagName('body')[0];
  node.innerHTML = contentHTML;
  body.appendChild(node);
}
