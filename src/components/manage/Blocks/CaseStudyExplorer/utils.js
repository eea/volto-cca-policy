import { openlayers as ol } from '@eeacms/volto-openlayers-map';

export function getFeatures(cases) {
  const Feature = ol.ol.Feature;

  return cases.map((c, index) => {
    const {
      geometry: { coordinates },
    } = c;
    const point = new Feature(
      new ol.geom.Point(ol.proj.fromLonLat(coordinates)),
    );
    point.setId(index);
    point.setProperties(
      {
        title: c.properties.title,
        image: c.properties.image,
        adaptations: c.properties.sectors_str,
        impacts: c.properties.impacts_str,
        adaptation_options_links: c.properties.adaptation_options_links,
        index: index,
        url: c.properties.url,
        origin_adaptecca: c.properties.origin_adaptecca,
        color: c.properties.origin_adaptecca === 20 ? '#005c96' : '#00FFFF',
      },
      false,
    );
    //return new Feature({ labelPoint: point, index: index });
    return point;
  });
}

export function filterCases(cases, activeFilters) {
  const data = cases.filter((_case) => {
    if (
      activeFilters.sectors.length === 0 &&
      activeFilters.measures.length === 0 &&
      activeFilters.impacts.length === 0
    )
      return _case;

    let flag = false;

    activeFilters.sectors.forEach((filter) => {
      if (_case.properties.sectors.includes(',' + filter + ',')) flag = true;
    });

    activeFilters.impacts.forEach((filter) => {
      if (_case.properties.impacts.includes(',' + filter + ',')) flag = true;
    });

    activeFilters.measures.forEach((filter) => {
      if (_case.properties.ktms.includes(',' + filter + ',')) flag = true;
    });

    return flag ? _case : false;
  });

  return data;
}

export function getFilters(cases) {
  let _filters = { sectors: {}, impacts: {}, measures: {} };

  for (let key of Object.keys(cases)) {
    const _case = cases[key];

    let sectorKeys = _case.properties.sectors.split(',');
    let sectorNames = _case.properties.sectors_str.split(',');
    for (let i = 0; i < sectorNames.length; i++) {
      if (!_filters.sectors.hasOwnProperty(sectorKeys[i + 1])) {
        _filters.sectors[sectorKeys[i + 1]] = sectorNames[i];
      }
    }

    let impactKeys = _case.properties.impacts.split(',');
    let impactNames = _case.properties.impacts_str.split(',');
    for (let i = 0; i < impactNames.length; i++) {
      if (!_filters.impacts.hasOwnProperty(impactKeys[i + 1])) {
        _filters.impacts[impactKeys[i + 1]] = impactNames[i];
      }
    }

    // let ktmKeys = _case.properties.ktms.split(',');
    // let ktmNames = _case.properties.impacts_str.split(',');
    // for (let i = 0; i < ktmKeys.length; i++) {
    //   if (!_filters.ktms.hasOwnProperty(ktmKeys[i])) {
    //     _filters.ktms[ktmKeys[i]] = 1;
    //   }
    // }
  }
  // console.log('getFilters:', _filters);

  return _filters;
}
