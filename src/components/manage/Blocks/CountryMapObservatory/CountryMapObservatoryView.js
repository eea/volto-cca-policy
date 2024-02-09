import React, { useRef, useEffect } from 'react';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
import { compose } from 'redux';
import { clientOnly } from '@eeacms/volto-cca-policy/helpers';
import withResponsiveContainer from './../withResponsiveContainer.js';
import { renderCountriesBox } from './map-utils.js';
import {
  getFocusCountriesFeature,
  getFocusCountryNames,
  withCountriesData,
} from '@eeacms/volto-cca-policy/helpers/country_map/countryMap.js';

import './styles.less';

const CountryMapObservatoryView = (props) => {
  const svgRef = useRef(null);
  const { d3, d3Geo, size, cpath } = props;
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
    console.log('d3geo', d3Geo);
    renderCountriesBox(opts, d3, d3Geo);
    // Draw Circle
    //container.append("circle").attr("r", 25).style("color","blue");
  }, [props.Data, d3, width, height, cpath, d3Geo]); // redraw chart if data changes

  return <svg ref={svgRef} />;
};

export default compose(
  clientOnly,
  injectLazyLibs(['d3', 'd3Geo']),
  withResponsiveContainer('countryMapObservatory'),
  withCountriesData,
)(CountryMapObservatoryView);

// import loadable from '@loadable/component';
//import * as d3 from 'd3';
// import cpath from './euro-countries-simplified';
//
