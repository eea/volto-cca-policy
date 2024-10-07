import React from 'react';
import { openlayers as ol } from '@eeacms/volto-openlayers-map';
const _cached = {};

function getStyle(size, haveAdaptecca) {
  let style = _cached[size + '_' + haveAdaptecca];

  if (!style) {
    style =
      size === 1
        ? new ol.style.Style({
            image: new ol.style.Circle({
              radius: 5,
              stroke: new ol.style.Stroke({
                color: '#fff',
              }),
              fill: new ol.style.Fill({
                color: haveAdaptecca ? '#00ffff' : '#005c96',
              }),
            }),
          })
        : new ol.style.Style({
            image: new ol.style.Circle({
              radius: 10 + Math.min(Math.floor(size / 3), 10),
              stroke: new ol.style.Stroke({
                color: '#fff',
              }),
              fill: new ol.style.Fill({
                color: haveAdaptecca ? '#318CE7' : '#005c96',
              }),
            }),
            text: new ol.style.Text({
              text: size.toString(),
              fill: new ol.style.Fill({
                color: '#fff',
              }),
            }),
          });
    _cached[size + '_' + haveAdaptecca] = style;
  }
  return style;
}

export function useStyles() {
  const selectStyle = React.useCallback((feature) => {
    const selected = new ol.style.Style({
      image: new ol.style.Circle({
        radius: 12,
        fill: new ol.style.Fill({
          color: '#005c96',
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 92, 150, 0.9)',
          width: 2,
        }),
      }),
    });
    // const color = feature.get('COLOR') || '#eeeeee';
    // selected.getFill().setColor(color);
    const color = feature.values_.features[0].values_['color'] || '#ccc';
    selected.image_.getFill().setColor(color);
    return selected;
  }, []);

  const convexHullStroke = React.useMemo(
    () =>
      new ol.style.Stroke({
        color: 'rgba(204, 85, 0, 1)',
        width: 1.5,
      }),
    [],
  );

  const clusterMemberStyle = React.useMemo(() => {
    const darkIcon = new ol.style.Icon({
      src: 'data/icons/emoticon-cool.svg',
    });
    const lightIcon = new ol.style.Icon({
      src: 'data/icons/emoticon-cool-outline.svg',
    });
    const _clusterMemberStyle = (clusterMember) => {
      return new ol.style.Style({
        geometry: clusterMember.getGeometry(),
        image: clusterMember.get('LEISTUNG') > 5 ? darkIcon : lightIcon,
      });
    };
    return _clusterMemberStyle;
  }, []);

  const clusterCircleStyle = React.useCallback(
    (cluster, resolution) => {
      // if (cluster?.ol_uid) {
      //   console.log(cluster?.ol_uid, cluster);
      // }
      // console.log('clusterCircleStyle', {
      //   cluster,
      //   resolution,
      //   clickFeature,
      //   clickResolution,
      // });
      if (cluster !== clickFeature || resolution !== clickResolution) {
        // console.log('return null', {
        //   cluster,
        //   clickFeature,
        //   resolution,
        //   clickResolution,
        // });
        return null;
      }

      // console.log('members', cluster);
      const clusterMembers = cluster.get('features');
      const centerCoordinates = cluster.getGeometry().getCoordinates();
      return generatePointsCircle(
        clusterMembers.length,
        cluster.getGeometry().getCoordinates(),
        resolution,
      ).reduce((styles, coordinates, i) => {
        const point = new ol.geom.Point(coordinates);
        const line = new ol.geom.LineString([centerCoordinates, coordinates]);
        styles.unshift(
          new ol.style.Style({
            geometry: line,
            stroke: convexHullStroke,
          }),
        );
        styles.push(
          clusterMemberStyle(
            new ol.feature.Feature({
              ...clusterMembers[i].getProperties(),
              geometry: point,
            }),
          ),
        );
        return styles;
      }, []);
    },
    [convexHullStroke, clusterMemberStyle],
  );

  return { clusterCircleStyle, selectStyle };
}

let clickFeature, clickResolution;

export function setClicked(feature, resolution) {
  clickFeature = feature;
  clickResolution = resolution;
}

export function generatePointsCircle(count, clusterCenter, resolution) {
  const circumference =
    circleDistanceMultiplier * circleFootSeparation * (2 + count);
  let legLength = circumference / (Math.PI * 2); //radius from circumference
  const angleStep = (Math.PI * 2) / count;
  const res = [];
  let angle;

  legLength = Math.max(legLength, 35) * resolution; // Minimum distance to get outside the cluster icon.

  for (let i = 0; i < count; ++i) {
    // Clockwise, like spiral.
    angle = circleStartAngle + i * angleStep;
    res.push([
      clusterCenter[0] + legLength * Math.cos(angle),
      clusterCenter[1] + legLength * Math.sin(angle),
    ]);
  }

  return res;
}
export function clusterStyle(feature) {
  const size = feature.get('features').length;
  const cases = feature
    .get('features')
    .filter((_case) => _case['values_']['origin_adaptecca'] < 20);

  return getStyle(size, cases.length > 0 ? 1 : 0);
}

export function getExtentOfFeatures(features) {
  const points = features.map((f) => f.getGeometry().flatCoordinates);
  const point = new ol.geom.MultiPoint(points);
  return point.getExtent();
}

const circleDistanceMultiplier = 1;
const circleFootSeparation = 28;
const circleStartAngle = Math.PI / 2;
