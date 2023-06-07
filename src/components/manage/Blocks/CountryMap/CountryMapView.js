import React, { useRef, useEffect } from 'react';
//import * as d3 from 'd3';
import cpath from './euro-countries-simplified';
import flags from './flags.js';
import './styles.css';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
import { compose } from 'redux';
import { clientOnly } from '@eeacms/volto-cca-policy/helpers';
// import loadable from '@loadable/component';
//
//
const withResponsiveContainer = (WrappedComponent) => {
  return (props) => {
    const [size, setSize] = React.useState();
    return (
      <div
        className="sized-wrapper"
        ref={(node) => {
          // console.log(node, node.clientHeight);
          if (node && !size)
            setSize({ height: node.clientHeight, width: node.clientWidth });
        }}
      >
        {size ? <WrappedComponent size={size} {...props} /> : null}
      </div>
    );
  };
};

const CountryMapView = (props) => {
  const svgRef = useRef(null);
  const { d3, size } = props;
  const { height, width } = size;

  useEffect(() => {
    // D3 Code

    // Dimensions
    //const parentDiv = document.getElementById('page-document');
    let dimensions = {
      //width: parentDiv.offsetWidth,
      width,
      height,
      margins: 50,
    };

    dimensions.containerWidth = dimensions.width - dimensions.margins * 2;
    dimensions.containerHeight = dimensions.height - dimensions.margins * 2;

    //const d3 = loadable.lib(() => import('d3'));
    // SELECTIONS
    const svg = d3
      .select(svgRef.current)
      .attr('id', 'country_map')
      //.classed("line-chart", true)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);
    //console.log('SVG x-y', svg.getBBox());
    /*
    const container = svg
      .append('g')
      .classed('container', true)
      .attr(
        'transform',
        `translate(${dimensions.margins}, ${dimensions.margins})`,
      );
      */

    cpath.features = cpath.features.map(function (c) {
      //console.log(c);
      var name = c.properties.SHRT_ENGL;
      if (!name) {
        // console.log('No flag for', c.properties);
        return c;
      } else if (name === 'Czechia') {
        name = 'Czech Republic';
      }
      var cname = name.replace(' ', '_');
      flags.forEach(function (f) {
        if (f.indexOf(cname) > -1) {
          c.url = f;
          //console.log(c.url);
        }
      });
      return c;
    });

    //console.log('cpath', cpath);
    //console.log(fpath);
    //console.log('Flags',flags);
    //console.log('filtered', getFocusCountriesFeature(cpath));

    window.countrySettings = cpath.features;

    var opts = {
      world: cpath.features,
      svg: svg,
      coordinates: {
        x: 0,
        y: 0,
        width: dimensions.containerWidth,
        height: dimensions.containerHeight,
      },
      focusCountries: {
        names: getFocusCountryNames(),
        feature: getFocusCountriesFeature(cpath),
      },
      zoom: 0.95,
    };
    renderCountriesBox(opts, d3);
    // Draw Circle
    //container.append("circle").attr("r", 25).style("color","blue");
  }, [props.Data, d3, width, height]); // redraw chart if data changes

  return <svg ref={svgRef} />;
};

function getFocusCountryNames() {
  return [
    'Austria',
    'Belgium',
    'Cyprus',
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
function getFocusCountriesFeature(world) {
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

function renderCountriesBox(opts, d3) {
  var coords = opts.coordinates;
  var countries = opts.focusCountries;

  var svg = opts.svg;
  var world = opts.world;
  var zoom = opts.zoom;
  var cprectid = makeid(); // unique id for this map drawing

  var globalMapProjection = d3.geoAzimuthalEqualArea();

  globalMapProjection.scale(1).translate([0, 0]);

  // the path transformer
  var path = d3.geoPath().projection(globalMapProjection);

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

  renderGraticule(map, 'graticule', [20, 10], path, d3);
  renderGraticule(map, 'semi-graticule', [5, 5], path, d3);

  //setCountryFlags(countries.feature.features, window._flags);

  world.forEach(function (country) {
    renderCountry(map, country, path, countries, x, y, d3);
  });

  return path;
}

function renderGraticule(container, klass, steps, pathTransformer, d3) {
  container // draw primary graticule lines
    .append('g')
    .attr('class', klass)
    .selectAll('path')
    .data(d3.geoGraticule().step(steps).lines())
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

//export default CountryMapView;
export default compose(
  clientOnly,
  injectLazyLibs(['d3']),
  withResponsiveContainer,
)(CountryMapView);
