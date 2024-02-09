import { getFocusCountryNames } from '@eeacms/volto-cca-policy/helpers/country_map/countryMap.js';

export function renderCountriesBox(opts, d3, d3Geo) {
  var coords = opts.coordinates;
  var countries = opts.focusCountries;

  var svg = opts.svg;
  var world = opts.world;
  var zoom = opts.zoom;
  var cprectid = makeid(); // unique id for this map drawing

  var globalMapProjection = d3Geo.geoAzimuthalEqualArea();

  globalMapProjection.scale(1).translate([0, 0]);

  // the path transformer
  var path = d3Geo.geoPath().projection(globalMapProjection);

  var x = coords.x;
  var y = coords.y;
  var width = coords.width;
  var height = coords.height;
  // var extent = [[x + 20, y + 20], [x + coords.width - 20 , y + coords.height - 20]];
  // console.log('fitting extent', extent);
  // globalMapProjection.fitExtent(extent, countries.feature);

  var b = path.bounds(countries.feature);
  var cwRatio = (b[1][0] - b[0][0]) / width; // bounds to width ratio
  var chRatio = (b[1][1] - b[0][1]) / height; // bounds to height ratio
  var s = zoom / Math.max(cwRatio, chRatio);
  var t = [
    (width - s * (b[1][0] + b[0][0])) / 2 + x,
    (height - s * (b[0][1] + b[1][1])) / 2 + y,
  ];

  globalMapProjection.scale(s).translate(t);

  svg
    .append('defs') // rectangular clipping path for the whole drawn map
    .append('clipPath')
    .attr('id', cprectid)
    .append('rect')
    .attr('x', x)
    .attr('y', y)
    .attr('height', height)
    .attr('width', width);

  var map = svg // the map will be drawn in this group
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

  //setCountryFlags(countries.feature.features, window._flags);

  world.forEach(function (country) {
    renderCountry(map, country, path, countries, x, y, d3);
  });

  var mo = {
    svg: svg,
    world: world,
    viewport: [width, height],
    countries: ['Malta', 'Liechtenstein', 'Luxembourg'],
    start: [width - 60, 10],
    side: 'left',
    // 'size': 80,
    // 'space': 6,
  };
  console.log('mo');
  // drawMaplets(mo);

  return path;
}

function drawMaplet(opts) {
  var msp = opts.coordinates;
  var svg = opts.svg;
  svg
    .append('rect')
    .attr('class', 'maplet-outline')
    .attr('x', msp.x)
    .attr('y', msp.y)
    .attr('width', msp.width)
    .attr('height', msp.height);

  var path = renderCountriesBox(opts);
  renderCountryLabel(opts.focusCountries.feature.features[0], path, true);
}

function filterCountriesByNames(countries, filterIds) {
  var features = {
    type: 'FeatureCollection',
    features: [],
  };
  countries.forEach(function (c) {
    if (filterIds.indexOf(c.properties.SHRT_ENGL) === -1) {
      return;
    }
    features.features.push(c);
  });
  return features;
}

function getMapletStartingPoint(
  viewport, // an array of two integers, width and height
  startPoint, // an array of two numbers, x, y for position in viewport
  index, // integer, position in layout
  side, // one of ['top', 'bottom', 'left', right']
  spacer, // integer with amount of space to leave between Maplets
  boxDim, // array of two numbers, box width and box height
  titleHeight, // height of title box
) {
  // return value is array of x,y
  // x: horizontal coordinate
  // y: vertical coordinate

  var bws = boxDim[0] + spacer; // box width including space to the right
  var bhs = boxDim[1] + spacer + titleHeight;

  var mutator = travelToOppositeMutator(startPoint, viewport, [bws, bhs]);

  var mutPoint = [startPoint[0], startPoint[1]];

  for (var i = 0; i < index; i++) {
    mutPoint = mutator(mutPoint, index);
  }

  // TODO: this could be improved, there are many edge cases
  switch (side) {
    case 'top':
      mutPoint[1] = startPoint[1];
      break;
    case 'bottom':
      mutPoint[1] = startPoint[1] - bhs;
      break;
    case 'left':
      mutPoint[0] = startPoint[0];
      break;
    case 'right':
      mutPoint[0] = startPoint[0] - bws;
      break;
  }

  return {
    x: mutPoint[0],
    y: mutPoint[1],
  };
}

function travelToOppositeMutator(start, viewport, delta) {
  // point: the point we want to mutate
  // start: starting point (the initial anchor point)
  // viewport: array of width, height
  // delta: array of dimensions to travel

  var center = [viewport[0] / 2, viewport[1] / 2];

  var dirx = start[0] > center[0] ? -1 : 1;
  var diry = start[1] > center[1] ? -1 : 1;

  return function (point) {
    var res = [point[0] + delta[0] * dirx, point[1] + delta[1] * diry];
    return res;
  };
}

function drawMaplets(opts) {
  var svg = opts.svg;
  var world = opts.world;
  var viewport = opts.viewport;
  var start = opts.start;
  var side = opts.side;

  var g = svg // the map will be drawn in this group
    .append('g')
    .attr('class', 'maplet-container');
  var countries = opts.countries;

  countries.forEach(function (name, index) {
    var feature = filterCountriesByNames(world, [name]);
    var boxw = 50;
    var boxh = 50;
    var space = 10;

    var mapletWorld = world.filter(function (country) {
      return country.properties.SHRT_ENGL === name;
    });

    var msp = getMapletStartingPoint(
      viewport,
      start,
      index,
      side,
      space,
      [boxw, boxh],
      0,
    );

    var zo = {
      world: mapletWorld,
      svg: g,
      coordinates: {
        x: msp.x,
        y: msp.y,
        width: boxw,
        height: boxh,
      },
      focusCountries: {
        names: [name],
        feature: feature,
      },
      zoom: 0.5,
      isMaplet: true,
    };
    drawMaplet(zo);
  });
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

function renderCountry(map, country, path, countries, x, y, d3) {
  var cprectid = makeid(); // unique id for this map drawing
  var klass = getCountryClass(country, countries);
  var cId = 'c-' + cprectid + '-' + country.properties.id;
  var cpId = 'cp-' + cprectid + '-' + country.properties.id;

  var available = countries.names.indexOf(country.properties.SHRT_ENGL) !== -1;

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
    renderCountryFlag(parent, country, bbox, cpId, d3);
    //renderCountryLabel(country, path);
  }
}

function getCountryClass(country, countries) {
  //console.log('getCountryClass',country, countries);
  var k = 'country-outline';
  //var k = "country-blue";
  //var available =
  //window.countrySettings.indexOf(country.properties.SHRT_ENGL) !== -1;
  //if (available) k += " country-available";

  //var meta = window.countrySettings[country.properties.SHRT_ENGL];
  //var _selectedMapSection = null;

  if (getFocusCountryNames().includes(country.properties.SHRT_ENGL)) {
    k += ' country-available';
  }
  //if (available && meta && meta[0] && meta[0][_selectedMapSection]) {
  //  k += " country-blue";
  //}
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

// tooltip with country names on hover
/*
var countryNameTooltip = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip');
  */

function renderCountryFlag(parent, country, bbox, cpId, d3) {
  var flag = parent
    .append('image')
    .attr('class', 'country-flag')
    .attr('href', function () {
      return country.url;
    })
    .attr('preserveAspectRatio', 'none')
    .attr('opacity', '0')
    .attr('clip-path', 'url(#' + cpId + ')')
    .attr('x', bbox.x)
    .attr('y', bbox.y)

    .attr('height', bbox.height)
    .attr('width', bbox.width)
    .on('click', function () {
      // var link = country.properties.SHRT_ENGL.toLowerCase().replace(' ', '-');
      // if (getFocusCountryNames().indexOf(country.properties.SHRT_ENGL) > -1)
      //   // console.log('will redirect to country:', link);
      // //location.href = location.href.endsWith('/') ? location.href + link : location.href + '/' + link;
      // console.log(
      //   window.location.href.endsWith('/')
      //     ? window.location.href + link
      //     : window.location.href + '/' + link,
      // );
    })
    .on('mouseover', function () {
      // var countryName = country.properties.SHRT_ENGL.toUpperCase();
      d3.select(this).attr('opacity', 1);
      //return countryNameTooltip.style('display', 'block').html(countryName);
    })
    .on('mousemove', function (event) {
      // var countryName = country.properties.SHRT_ENGL.toUpperCase();
      //console.log(event, d3.select(this));
      //console.log(event.screenX, event.screenY, event, d3.select(this),this.getAttribute("cx"));
      //console.log(d3.mouse(this));
      // var bbox = this.getBBox();
      /*
      const cmt = countryNameTooltip
        .style('display', 'block')
        //.style("top", event.layerY+ "px")
        //.style("left", event.layerX+ 10 + "px")
        .style('top', event.layerY + bbox.height + 'px')
        .style('left', event.layerX + 50 + 'px')
        //.style("top", d3.currentEvent.pageY + "px")
        //.style("left", d3.currentEvent.pageX + 10 + "px")
        .html(countryName);
      return cmt;
      */
    })
    .on('mouseout', function () {
      d3.select(this).attr('opacity', 0);
      //return countryNameTooltip.style('display', 'none');
    });
  return flag;
}
