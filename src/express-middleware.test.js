/**
 * Tests for the express middleware, specifically the authenticated proxy for
 * classic `@@images` / `@@download` endpoints (JWT cookie auth for images).
 *
 * `superagent` is mocked because `getAPIResourceWithAuth` (imported by the
 * middleware) would otherwise make a real HTTP call to the Plone backend.
 */
import superagent from 'superagent';

// superagent is isomorphic: the CJS entry assigns `superagent.get` at load
// time (node client), the browser build exposes it as a property. The helper
// does `import superagent from 'superagent'` then `superagent.get(url)`, so the
// mock factory must define `get` on the default export.
jest.mock('superagent', () => {
  const fn = jest.fn();
  fn.get = jest.fn();
  return { __esModule: true, default: fn };
});

import viewsMiddlewareConfigurator from './express-middleware'; // eslint-disable-line import/first
import config from '@plone/volto/registry'; // eslint-disable-line import/first

/**
 * Builds a fake chained superagent request. All config methods return the
 * request itself; `then`/`catch` complete the Promise chain with the given
 * response (or reject with the given error).
 */
const fakeRequest = ({ response, error } = {}) => {
  const request = {
    maxResponseSize: jest.fn(),
    responseType: jest.fn(),
    set: jest.fn(),
    use: jest.fn(),
  };
  request.maxResponseSize.mockReturnValue(request);
  request.responseType.mockReturnValue(request);
  request.set.mockReturnValue(request);
  request.use.mockReturnValue(request);
  // Mirrors superagent: `.then(resolve)` rejects internally and the caller
  // attaches `.catch(reject)`. We must NOT return a rejected promise here,
  // otherwise the `.then()` call is itself an unhandled rejection.
  request.then = (onOk) =>
    new Promise((resolve, reject) =>
      Promise.resolve().then(() =>
        error ? reject(error) : resolve(onOk(response)),
      ),
    );
  request.catch = (onErr) =>
    Promise.resolve().then(() => (error ? onErr(error) : undefined));
  return request;
};

const fakeResponse = (body, headers = {}, statusCode = 200) => ({
  statusCode,
  body,
  get: (h) => headers[h],
});

const fakeConfig = (settings = {}) => ({
  settings: {
    expressMiddleware: [],
    ...settings,
  },
});

describe('express-middleware viewsMiddleware', () => {
  let middleware;
  let settingsBefore;

  beforeEach(() => {
    // Jest re-transforms @plone/volto for every addon under test, so the
    // registry's load-volto-addons runs (other addons' middleware included)
    // and config.settings is shared/mutated between suites. Snapshot it.
    settingsBefore = { ...config.settings };
    config.settings = {
      ...settingsBefore,
      expressMiddleware: [],
      legacyTraverse: false,
      apiPath: 'http://plone:8080',
      maxResponseSize: 1000,
    };

    const cfg = viewsMiddlewareConfigurator(fakeConfig());
    middleware = cfg.settings.expressMiddleware[0];
    expect(middleware.id).toBe('viewsMiddleware');
  });

  afterEach(() => {
    config.settings = settingsBefore;
  });

  /** Express stores multi-path routes with `path` as an array; normalize. */
  const pathsOf = (layer) =>
    Array.isArray(layer.route.path) ? layer.route.path : [layer.route.path];

  const findLayer = (path) =>
    middleware.stack.find((l) => l.route && pathsOf(l).includes(path));

  const lastHandler = (layer) =>
    layer.route.stack[layer.route.stack.length - 1].handle;

  // The value is a throwaway test token, not a real credential.
  const makeReq = ({ authToken } = {}) => ({
    path: '/en/sandbox/jwt-probe/@@images/image/large',
    headers: {},
    universalCookies: {
      //betterleaks:allow
      get: (name) => (name === 'auth_token' ? authToken : undefined),
    },
  });

  const makeRes = () => {
    const res = {};
    res.headers = {};
    res.sendSent = undefined;
    res.set = jest.fn((k, v) => {
      res.headers[k.toLowerCase()] = v;
      return res;
    });
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn((body) => {
      res.sendSent = body;
      return res;
    });
    return res;
  };

  const runHandler = (handler, req, res) =>
    new Promise((resolve, reject) => {
      // The middleware does NOT call next() on success — it just sends the
      // response. Resolve when res.send is invoked; reject if next gets an error.
      const originalSend = res.send;
      res.send = (...args) => {
        const r = originalSend(...args);
        resolve('sent');
        return r;
      };
      const next = (err) => (err ? reject(err) : resolve('next'));
      handler(req, res, next);
    });

  it('registers routes for the existing @@ views and the image/download proxy', () => {
    const paths = middleware.stack
      .filter((l) => l.route)
      .flatMap((l) => pathsOf(l));
    expect(paths).toEqual(
      expect.arrayContaining([
        '**/@@case-studies-map.arcgis.json',
        '**@countries-metadata-extract',
        '**@countries-metadata-extract-2025',
        '**@@countries-heat-index-json',
        '**@@translate-this-async',
        '**/@@images/**',
        '**/@@download/**',
      ]),
    );
  });

  describe('@@images proxy', () => {
    it('sends the request to the Plone API with the auth_token as Bearer', async () => {
      const body = Buffer.from('PNGDATA');
      const request = fakeRequest({
        response: fakeResponse(body, { 'Content-Type': 'image/png' }),
      });
      superagent.get.mockReturnValue(request);

      const req = makeReq({ authToken: 'jwt-token' }); //betterleaks:allow
      const res = makeRes();

      await runHandler(lastHandler(findLayer('**/@@images/**')), req, res);

      // legacyTraverse=false → /++api++ prefix
      expect(superagent.get).toHaveBeenCalledWith(
        'http://plone:8080/++api++/en/sandbox/jwt-probe/@@images/image/large',
      );
      // the auth_token cookie is forwarded as a Bearer header
      expect(request.set).toHaveBeenCalledWith(
        'Authorization',
        'Bearer jwt-token',
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.sendSent).toEqual(body);
      expect(res.headers['content-type']).toBe('image/png');
      // authenticated → private caching + Vary
      expect(res.headers.vary).toBe('Cookie');
      expect(res.headers['cache-control']).toBe('private');
    });

    it('does not add Vary for anonymous requests', async () => {
      const body = Buffer.from('PNGDATA');
      const request = fakeRequest({
        response: fakeResponse(body, {
          'Content-Type': 'image/png',
          'Cache-Control': 'max-age=3600',
        }),
      });
      superagent.get.mockReturnValue(request);

      const req = makeReq();
      const res = makeRes();

      await runHandler(lastHandler(findLayer('**/@@images/**')), req, res);

      // no token → no Authorization header set on the request
      expect(request.set).not.toHaveBeenCalledWith(
        'Authorization',
        expect.anything(),
      );
      expect(res.headers.vary).toBeUndefined();
      // anonymous → public caching preserved (no , private appended)
      expect(res.headers['cache-control']).toBe('max-age=3600');
    });

    it('passes errors to next (e.g. 404 for missing images)', async () => {
      const request = fakeRequest({
        error: Object.assign(new Error('404'), { status: 404 }),
      });
      superagent.get.mockReturnValue(request);

      const req = makeReq({ authToken: 'jwt-token' }); //betterleaks:allow
      const res = makeRes();

      // runHandler rejects when next(err) is called with an error
      await expect(
        runHandler(lastHandler(findLayer('**/@@images/**')), req, res),
      ).rejects.toMatchObject({ status: 404 });
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('@@download proxy', () => {
    it('is registered and forwards the response', async () => {
      const layer = findLayer('**/@@download/**');
      expect(layer).toBeDefined();

      const body = Buffer.from('FILE');
      const request = fakeRequest({
        response: fakeResponse(body, {
          'Content-Disposition': 'attachment; filename=x.pdf',
        }),
      });
      superagent.get.mockReturnValue(request);

      const req = makeReq({ authToken: 'jwt-token' }); //betterleaks:allow
      const res = makeRes();

      await runHandler(lastHandler(layer), req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.sendSent).toEqual(body);
      expect(res.headers['content-disposition']).toBe(
        'attachment; filename=x.pdf',
      );
    });
  });
});
