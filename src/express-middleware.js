import express from 'express';
import { getAPIResourceWithAuth } from '@plone/volto/helpers';

const HEADERS = [
  'Accept-Ranges',
  'Cache-Control',
  'Content-Disposition',
  'Content-Range',
  'Content-Type',
];

function viewMiddleware(req, res, next) {
  getAPIResourceWithAuth(req)
    .then((resource) => {
      // Just forward the headers that we need
      HEADERS.forEach((header) => {
        if (resource.get(header)) {
          res.set(header, resource.get(header));
        }
      });
      res.status(resource.statusCode);
      res.send(resource.body);
    })
    .catch(next);
}

export default function (config) {
  const middleware = express.Router();

  // TODO: do we want catch all?
  // middleware.all(['**/@@*'], viewMiddleware);

  middleware.all(['**/@@case-studies-map.arcgis.json'], viewMiddleware);
  middleware.id = 'viewsMiddleware';
  config.settings.expressMiddleware.push(middleware);
  return config;
}
