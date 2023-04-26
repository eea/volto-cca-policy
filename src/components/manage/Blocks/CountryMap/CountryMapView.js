import React, { useRef, useEffect } from 'react';
//import * as d3 from 'd3';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
//import loadable from '@loadable/component';

const CountryMapView = (props) => {
  const svgRef = useRef(null);
  const { d3 } = props;

  useEffect(() => {
    // D3 Code

    // Dimensions
    let dimensions = {
      width: 1000,
      height: 500,
      margins: 50,
    };

    dimensions.containerWidth = dimensions.width - dimensions.margins * 2;
    dimensions.containerHeight = dimensions.height - dimensions.margins * 2;

    //const d3 = loadable.lib(() => import('d3'));
    // SELECTIONS
    const svg = d3
      .select(svgRef.current)
      .classed('line-chart', true)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);
    const container = svg
      .append('g')
      .classed('container', true)
      .attr(
        'transform',
        `translate(${dimensions.margins}, ${dimensions.margins})`,
      );

    // Draw Circle
    container.append('circle').attr('r', 50);
  }, [props.Data, svgRef.current]); // redraw chart if data changes

  return <svg ref={svgRef} />;
};

//export default CountryMapView;
export default injectLazyLibs(['d3'])(CountryMapView);
