// import { openlayers as ol } from '@eeacms/volto-openlayers-map';

// const flagRenderer = ({ stroke, fill }) => (pixelCoordinates, state) => {
//   const context = state.context;
//   const geometry = state.geometry.clone();
//   geometry.setCoordinates(pixelCoordinates);
//   const extent = geometry.getExtent();
//   const width = ol.extent.getWidth(extent);
//   const height = ol.extent.getHeight(extent);
//   const flag = state.feature.get('flag');
//   if (!flag || height < 1 || width < 1) {
//     return;
//   }

//   // Stitch out country shape from the blue canvas
//   context.save();
//   const renderContext = ol.render.toContext(context, {
//     pixelRatio: 1,
//   });
//   renderContext.setFillStrokeStyle(fill, stroke);
//   renderContext.drawGeometry(geometry);
//   context.clip();

//   // Fill transparent country with the flag image
//   const bottomLeft = ol.extent.getBottomLeft(extent);
//   const left = bottomLeft[0];
//   const bottom = bottomLeft[1];
//   context.drawImage(flag, left, bottom, width, height);
//   context.restore();
// };

export const makeStyles = (highlight, ol) => {
  const fill = new ol.style.Fill({ color: 'rgb(251,250,230, 0.8)' });
  const stroke = new ol.style.Stroke({
    // color: 'rgba(255,255,255,0.8)',
    color: '#333333',
    width: 1,
  });

  const colored = new ol.style.Fill({
    color: 'rgb(138, 156, 58, 0.8)',
  });

  const getFillColor = (feature) => {
    const countryCode = feature.get('id');
    const countriesUE = [
      'AT',
      'BE',
      'BG',
      'CH',
      'CZ',
      'CY',
      'DE',
      'DK',
      'EE',
      'EL',
      'ES',
      'FI',
      'FR',
      'GR',
      'HR',
      'HU',
      'IE',
      'IS',
      'IT',
      'LI',
      'LT',
      'LU',
      'LV',
      'MT',
      'NL',
      'NO',
      'PL',
      'PT',
      'RO',
      'SE',
      'SI',
      'SK',
      'TR',
    ];
    const countriesCoopereting = ['RS', 'BA', 'MK', 'ME', 'AL', 'XK'];
    const countriesEastern = ['UA', 'MO', 'MD', 'GE'];
    const countriesEEAMemberCountries = ['IS', 'NO', 'CH', 'LI', 'TR'];
    if (countriesEEAMemberCountries.includes(countryCode)) {
      return new ol.style.Fill({ color: '#50B0A4' });
    }
    if (countriesCoopereting.includes(countryCode)) {
      return new ol.style.Fill({ color: '#A0E5DC' });
    }
    if (countriesEastern.includes(countryCode)) {
      return new ol.style.Fill({ color: '#C8FFF8' });
    }
    if (countriesUE.includes(countryCode)) {
      return new ol.style.Fill({ color: '#007B6C' });
    }
    return fill;
  };

  const eucountriesStyle = new ol.style.Style({
    renderer: (pixelCoordinates, state) => {
      const context = state.context;
      const geometry = state.geometry.clone();
      geometry.setCoordinates(pixelCoordinates);
      // const extent = geometry.getExtent();
      // const width = ol.extent.getWidth(extent);
      // const height = ol.extent.getHeight(extent);
      const feature = state.feature;
      const name = feature.get('na');

      context.save();
      const renderContext = ol.render.toContext(context, {
        pixelRatio: 1,
      });
      renderContext.setFillStrokeStyle(
        name === highlight.current ? colored : getFillColor(feature),
        stroke,
      );
      // console.log(highlight.current);

      renderContext.drawGeometry(geometry);
      context.clip();
      context.restore();
    },
  });

  return { eucountriesStyle };
};
