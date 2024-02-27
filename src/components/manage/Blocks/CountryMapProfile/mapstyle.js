import { openlayers as ol } from '@eeacms/volto-openlayers-map';

const flagRenderer = ({ stroke, fill }) => (pixelCoordinates, state) => {
  const context = state.context;
  const geometry = state.geometry.clone();
  geometry.setCoordinates(pixelCoordinates);
  const extent = geometry.getExtent();
  const width = ol.extent.getWidth(extent);
  const height = ol.extent.getHeight(extent);
  const flag = state.feature.get('flag');
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
  const fill = new ol.style.Fill();
  const stroke = new ol.style.Stroke({
    // color: 'rgba(255,255,255,0.8)',
    color: '#000000',
    width: 1,
  });

  const overlayStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      // color: '#A0A0A0',
      color: '#000000',
      width: 1,
    }),
    fill: new ol.style.Fill({
      color: 'rgb(138, 156, 58, 0.8)',
      // color: 'rgb(245, 245, 245, 0.8)',
    }),
    // renderer: flagRenderer({ fill, stroke }),
  });

  const colored = new ol.style.Fill({
    color: 'red',
  });

  const eucountriesStyle = new ol.style.Style({
    renderer: (pixelCoordinates, state) => {
      console.log('render', state.feature.get('na'));
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
        name === highlight.current ? colored : fill,
        stroke,
      );
      console.log(highlight.current);

      renderContext.drawGeometry(geometry);
      context.clip();
      context.restore();
    },
  });

  const blue1Style = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#d1d1d1',
      width: 1,
    }),
    fill: new ol.style.Fill({
      color: 'rgb(0, 75, 127, 0.8)',
    }),
  });

  const blue2Style = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#d1d1d1',
      width: 1,
    }),
    fill: new ol.style.Fill({
      color: 'rgb(10, 153, 255, 0.8)',
    }),
  });

  const blue3Style = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#d1d1d1',
      width: 1,
    }),
    fill: new ol.style.Fill({
      color: 'rgb(120, 217, 252, 0.8)',
    }),
  });

  return { eucountriesStyle, overlayStyle, blue1Style, blue2Style, blue3Style };
};
