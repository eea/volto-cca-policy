import { openlayers as ol } from '@eeacms/volto-openlayers-map';

export const makeStyles = () => {
  const fill = new ol.style.Fill();
  const stroke = new ol.style.Stroke({
    // color: 'rgba(255,255,255,0.8)',
    color: '#A0A0A0',
    width: 2,
  });

  const overlayStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#A0A0A0',
      width: 2,
    }),
    fill: new ol.style.Fill({
      color: 'rgb(1, 112, 183, 0.8)',
    }),
    renderer: function(pixelCoordinates, state) {
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
    },
  });

  const emptyStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgb(1, 1, 1, 0)',
      width: 1,
    }),
    fill: new ol.style.Fill({
      color: 'rgb(1, 1, 1, 0)',
    }),
  });

  const eucountriesStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#A0A0A0',
      width: 1,
    }),
    fill: new ol.style.Fill({
      color: 'rgb(1, 112, 183, 0.3)',
    }),
  });

  return { eucountriesStyle, emptyStyle, overlayStyle };
};
