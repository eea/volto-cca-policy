import React, { useRef, useEffect } from 'react';
import flags from './flags.js';
import './styles.css';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
import { Grid } from 'semantic-ui-react';
import { compose } from 'redux';
import { clientOnly } from '@eeacms/volto-cca-policy/helpers';
import withResponsiveContainer from './withResponsiveContainer.js';
import { addAppURL } from '@plone/volto/helpers';
import {
  getFocusCountriesFeature,
  getFocusCountryNames,
  renderCountriesBox,
} from './map-utils.js';

import Filter from './Filter';

import { useCountriesMetadata } from './hooks';

const countries_metadata_url = '/en/@@countries-heat-index-json';

const withCountriesData = (WrappedComponent) => {
  function WithCountriesDataWrapped(props) {
    let [cpath, setCpath] = React.useState();

    useEffect(() => {
      if (!cpath) {
        import('./euro-countries-simplified.js').then((mod) => {
          const _cpath = mod.default;
          _cpath.features = _cpath.features.map(function (c) {
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

          setCpath(_cpath);
        });
      }
    }, [cpath]);

    return cpath ? <WrappedComponent {...props} cpath={cpath} /> : null;
  }
  return WithCountriesDataWrapped;
};

const CountryMapObservatoryView = (props) => {
  const svgRef = useRef(null);
  const { d3, d3Geo, size, cpath } = props;
  const { height, width } = size;
  const [thematicMapMode, setThematicMapMode] = React.useState('hhap');

  const countries_metadata = useCountriesMetadata(
    addAppURL(countries_metadata_url),
  );

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
      countries_metadata: countries_metadata,
      thematic_map_mode: thematicMapMode,
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
    renderCountriesBox(opts, d3, d3Geo);
    // Draw Circle
    //container.append("circle").attr("r", 25).style("color","blue");
  }, [
    props.Data,
    d3,
    width,
    height,
    cpath,
    d3Geo,
    thematicMapMode,
    countries_metadata,
  ]); // redraw chart if data changes

  return (
    <div>
      <Grid columns="12">
        <Grid.Column mobile={9} tablet={9} computer={10} className="col-left">
          <svg ref={svgRef} />
        </Grid.Column>
        <Grid.Column
          mobile={3}
          tablet={3}
          computer={2}
          className="col-left"
          id="cse-filter"
        >
          <Filter
            thematicMapMode={thematicMapMode}
            setThematicMapMode={setThematicMapMode}
          />
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default compose(
  clientOnly,
  injectLazyLibs(['d3', 'd3Geo']),
  withResponsiveContainer,
  withCountriesData,
)(CountryMapObservatoryView);

// import loadable from '@loadable/component';
//import * as d3 from 'd3';
// import cpath from './euro-countries-simplified';
//
