import express from 'express';
import { getAPIResourceWithAuth } from '@plone/volto/helpers/Api/APIResourceWithAuth';

const HEADERS = [
  'Accept-Ranges',
  'Cache-Control',
  'Content-Disposition',
  'Content-Range',
  'Content-Type',
];

/**
 * Forwards headers for binary/image responses. Vary: Cookie is added so shared
 * caches (Varnish) don't serve a private image response to anonymous users.
 */
const BINARY_HEADERS = [
  ...HEADERS,
  'Content-Length',
  'Content-Transfer-Encoding',
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

/**
 * Proxies classic-traversed binary endpoints (images, file downloads) to Plone
 * *with* the user's JWT, which the classic request handlers do not read
 * (they only honor `__ac` cookies or `Authorization` headers on `++api++`).
 *
 * Without this, logged-in users hitting a protected `<img src="…/@@images/…">`
 * get 302 → login and a broken image, because the browser cannot send an
 * `Authorization` header on a plain `<img>` request and Volto replaced the
 * classic login (which used to set a real `__ac` cookie) with JWT login.
 *
 * The request is forwarded server-side by `getAPIResourceWithAuth`, which adds
 * `Authorization: Bearer <auth_token cookie>`. If the token is missing or
 * invalid, Plone simply returns 401/404, so anonymous behavior is unchanged.
 */
function binaryViewMiddleware(req, res, next) {
  getAPIResourceWithAuth(req)
    .then((resource) => {
      const hasAuth = req.universalCookies?.get?.('auth_token') //betterleaks:allow
        ? true
        : false;
      BINARY_HEADERS.forEach((header) => {
        if (resource.get(header)) {
          res.set(header, resource.get(header));
        }
      });
      // Never let a shared cache store an authenticated (private) response as
      // generic; vary on the presence of a cookie.
      if (hasAuth) {
        res.set('Vary', 'Cookie');
        // The response is only valid for *this* user; shared caches must not
        // store it.
        const cacheControl = resource.get('Cache-Control');
        res.set(
          'Cache-Control',
          cacheControl ? `${cacheControl}, private` : 'private',
        );
      }
      res.status(resource.statusCode);
      // superagent hands us a Buffer for binary payloads; that is fine.
      res.send(resource.body);
    })
    .catch(next);
}

const viewsMiddlewareConfigurator = (config) => {
  const middleware = express.Router();

  // TODO: do we want catch all?
  // middleware.all(['**/@@*'], viewMiddleware);

  middleware.all(
    [
      '**/@@case-studies-map.arcgis.json',
      '**@countries-metadata-extract',
      '**@countries-metadata-extract-2025',
      '**@@countries-heat-index-json',
      '**@@translate-this-async',
    ],
    viewMiddleware,
  );

  // Serve classic image/download endpoints through the authenticated API so
  // that logged-in users can load images of protected content in <img> tags
  // (classic URLs never see the `auth_token` cookie; see binaryViewMiddleware).
  middleware.all(['**/@@images/**', '**/@@download/**'], binaryViewMiddleware);
  middleware.id = 'viewsMiddleware';
  config.settings.expressMiddleware.push(middleware);
  return config;
};

export default viewsMiddlewareConfigurator;
