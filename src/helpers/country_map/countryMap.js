import React, { useEffect } from 'react';
import flags from './flags.js';

export const euCountryNames = [
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

export function getFocusCountryNames() {
  return euCountryNames;
}

export const getFocusCountriesFeature = (world) => {
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
};

export function removeTooltip() {
  const elem = document.getElementById('map-tooltip');
  if (elem) {
    elem.parentElement.removeChild(elem);
  }
}

export const withCountriesData = (WrappedComponent) => {
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

export function setTooltipVisibility(node, label, event, visible) {
  if (!node) return;
  if (visible) {
    node.innerHTML = label;
    node.style.visibility = 'visible';
    node.style.left = `${Math.floor(event.layerX)}px`;
    node.style.top = `${Math.floor(event.layerY)}px`;
  } else {
    node.innerHTML = '';
    node.style.visibility = 'hidden';
  }
}

export const getClosestFeatureToCoordinate = (coordinate, features) => {
  if (!features.length) return null;
  const x = coordinate[0];
  const y = coordinate[1];
  let closestFeature = null;
  const closestPoint = [NaN, NaN];
  let minSquaredDistance = Infinity;

  features.forEach((feature) => {
    const geometry = feature.getGeometry();
    const previousMinSquaredDistance = minSquaredDistance;
    minSquaredDistance = geometry.closestPointXY(
      x,
      y,
      closestPoint,
      minSquaredDistance,
    );
    if (minSquaredDistance < previousMinSquaredDistance) {
      closestFeature = feature;
    }
  });

  return closestFeature;
};
