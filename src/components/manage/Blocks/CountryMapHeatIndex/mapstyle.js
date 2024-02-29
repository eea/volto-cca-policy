import { openlayers as ol } from '@eeacms/volto-openlayers-map';

const flagRenderer = ({ stroke, fill }) => (pixelCoordinates, state) => {
  const context = state.context;
  const geometry = state.geometry.clone();
  geometry.setCoordinates(pixelCoordinates);
  const extent = geometry.getExtent();
  const width = ol.extent.getWidth(extent);
  const height = ol.extent.getHeight(extent);
  const flag = state.feature.get('flag');
  console.log('flag', flag);
  if (!flag || height < 1 || width < 1) {
    return;
  }

  // Stitch out country shape from the blue canvas
  context.save();
  const renderContext = ol.render.toContext(context, {
    pixelRatio: 1,
  });
  renderContext.setFillStrokeStyle(fill, stroke);
  renderContext.drawGeometry(geometry);
  context.clip();

  // Fill transparent country with the flag image
  const bottomLeft = ol.extent.getBottomLeft(extent);
  const left = bottomLeft[0];
  const bottom = bottomLeft[1];
  context.drawImage(flag, left, bottom, width, height);
  context.restore();
};

export const makeStyles = (highlight) => {
  const fill = new ol.style.Fill({ color: 'rgb(251,250,230, 0.8)' });
  const stroke = new ol.style.Stroke({
    // color: 'rgba(255,255,255,0.8)',
    color: '#d1d1d1',
    width: 1,
  });

  const getFillColor = (feature) => {
    switch (feature.get('fillColor')) {
      case 'blue1':
        return new ol.style.Fill({ color: 'rgb(0,75,127,0.8)' });
        break;
      case 'blue2':
        return new ol.style.Fill({ color: 'rgb(139,174,206,0.8)' });
        break;
      case 'gray1':
        return new ol.style.Fill({ color: 'rgb(134,134,134,0.8)' });
        break;
      case 'gray2':
        return new ol.style.Fill({ color: 'rgb(191,191,191,0.8)' });
        break;
      default:
    }

    return fill;
  };

  const eucountriesStyle = new ol.style.Style({
    renderer: (pixelCoordinates, state) => {
      const context = state.context;
      const geometry = state.geometry.clone();
      geometry.setCoordinates(pixelCoordinates);
      const extent = geometry.getExtent();
      const width = ol.extent.getWidth(extent);
      const height = ol.extent.getHeight(extent);
      const feature = state.feature;
      const name = feature.get('na');

      context.save();
      const renderContext = ol.render.toContext(context, {
        pixelRatio: 1,
      });
      renderContext.setFillStrokeStyle(getFillColor(feature), stroke);
      // console.log(highlight.current);

      renderContext.drawGeometry(geometry);
      context.clip();
      const flag = state.feature.get('flag');
      // if (!flag || height < 1 || width < 1) {
      //   return;
      // }
      if (name == highlight.current && flag && height > 1 && width > 1) {
        // Fill transparent country with the flag image
        const bottomLeft = ol.extent.getBottomLeft(extent);
        const left = bottomLeft[0];
        const bottom = bottomLeft[1];
        context.drawImage(flag, left, bottom, width, height);
      }
      context.restore();
    },
  });

  return { eucountriesStyle };
};
