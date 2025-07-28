// import React, { useEffect } from 'react';
// import flags from './flags.js';

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
  'Georgia',
  'Germany',
  'Greece',
  'Hungary',
  'Iceland',
  'Ireland',
  'Kosovo',
  'Italy',
  'Latvia',
  'Lithuania',
  'Luxembourg',
  'Malta',
  'Moldova',
  'Moldova, Republic of',
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
  'Ukraine',
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

export const getClosestFeatureToCoordinate = (coordinate, features, ol) => {
  if (!features.length) return null;
  const x = coordinate[0];
  const y = coordinate[1];
  let closestFeature = null;

  features.forEach((feature) => {
    const geometry = feature.getGeometry();
    const type = geometry.getType();

    if (type === 'MultiPolygon') {
      const polygons = geometry.getPolygons();
      for (let i = 0; i < polygons.length; i++) {
        if (polygons[i].containsXY(x, y)) {
          closestFeature = feature;
          break;
        }
      }
    } else if (type === 'Polygon') {
      if (geometry.containsXY(x, y)) {
        closestFeature = feature;
      }
    }
  });

  return closestFeature;
};

export const tooltipStyle = {
  position: 'absolute',
  zIndex: 2,
  display: 'inline-block',
  visibility: 'hidden',
  top: '0px',
  left: '0px',
  backgroundColor: 'black',
  color: 'white',
  padding: '0.3em',
  cursor: 'pointer',
  fontSize: '10px',
};

export function getImageUrl(feature) {
  let id = feature.get('id').toLowerCase();
  if (id === 'el') {
    id = 'gr'; // fix Greece
  }
  if (id === 'uk') {
    id = 'gb'; // fix Greece
  }
  return 'https://flagcdn.com/w320/' + id + '.png';
}

export function adjustEuCountryNames(euCountryNames) {
  for (let i = 0; i < euCountryNames.length; i++) {
    if (euCountryNames[i] === 'Turkey') {
      euCountryNames[i] = 'Türkiye';
    }
    if (euCountryNames[i] === 'United Kingdom') {
      euCountryNames[i] = 'United Kingdom DEL';
    }
  }
  return euCountryNames;
}
