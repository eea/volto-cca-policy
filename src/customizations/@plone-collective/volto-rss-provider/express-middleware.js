import express from 'express';
import superagent from 'superagent';
import RSS from 'rss';
import { findBlocks, toPublicURL } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import { addHeadersFactory } from '@plone/volto/helpers/Proxy/Proxy';

/**
 * Retrieves the query data (search criteria) used by the listing block of the rss_feed content type
 * as well as the language, description, title, subjects (tags), date, max_description_length, and
 * max_title_length of the rss_feed.
 *
 * The returned query object will have the following format:
 * {
 *   query: [
 *     {
 *       i: <index>,
 *       o: <operator>,
 *       v: <value of the search criteria>
 *     }
 *   ],
 *   sort_order: 'ascending',
 *   b_size: 25,
 *   metadata_fields: '_all',
 *   b_start: 0
 * }
 *
 * @function getRssFeedData
 * @param {string} apiPath - The base path for the API requests.
 * @param {string} APISUFFIX - The suffix added to the API path depending on the environment.
 * @param {Object} req - The incoming Express request object.
 * @param {Object} settings - Configuration settings for the application.
 * @return {Object} An object containing the query data, language, description, and title of the rss_feed.
 * @throws Will throw an error if no query data is found in the listing block or if the request fails.
 */
async function getRssFeedData(apiPath, APISUFFIX, req, settings) {
  try {
    const request = superagent
      .get(
        `${apiPath}${__DEVELOPMENT__ ? '' : APISUFFIX}${req.path.replace(
          '/rss.xml',
          '',
        )}`,
      )
      .accept('json')
      .use(addHeadersFactory(req));

    const authToken = req.universalCookies?.get?.('auth_token');
    if (authToken) {
      request.set('Authorization', `Bearer ${authToken}`);
    }

    const response = await request;
    const json = JSON.parse(JSON.stringify(response.body));
    const listingBlock = findBlocks(json.blocks, 'listing');
    const queryData = json.blocks?.[listingBlock]?.querystring;
    const language = json.language?.token ?? 'en';
    const description = json.description ?? 'A Volto RSS Feed';
    const title = json.title;
    const subjects = json.subjects;
    const date = json.effective;
    const max_description_length = json.max_description_length;
    const max_title_length = json.max_title_length;
    if (!queryData) {
      throw new Error('No query data found in listing block');
    }

    if (queryData?.sort_order != null) {
      if (typeof queryData.sort_order === 'boolean') {
        queryData.sort_order = queryData.sort_order
          ? 'descending'
          : 'ascending';
      }
    }

    const query = {
      ...queryData,
      ...(!queryData.b_size && {
        b_size: settings.defaultPageSize,
      }),
      query: queryData?.query,
      metadata_fields: '_all',
      b_start: 0,
    };

    return {
      query,
      language,
      description,
      title,
      subjects,
      date,
      max_description_length,
      max_title_length,
    };
  } catch (err) {
    throw err;
  }
}

/**
 * Fetches the listing block items based on the provided query data.
 *
 * The function sends a POST request to the @querystring-search endpoint with the query data
 * and returns the items that match the search criteria.
 * ref: https://6.docs.plone.org/plone.restapi/docs/source/endpoints/querystringsearch.html
 *
 * @function fetchListingItems
 * @param {Object} query - The query data used for fetching items.
 * @param {string} apiPath - The base path for the API requests.
 * @param {string} APISUFFIX - The suffix added to the API path depending on the environment.
 * @param {string} authToken - The authentication token for authorized requests.
 * @return {Array} An array of items that match the query criteria.
 * @throws Will throw an error if the request fails.
 */
async function fetchListingItems(query, apiPath, APISUFFIX, authToken, req) {
  try {
    const request = superagent
      .post(`${apiPath}${__DEVELOPMENT__ ? '' : APISUFFIX}/@querystring-search`)
      .send(query)
      .accept('json')
      .use(addHeadersFactory(req));

    if (authToken) {
      request.set('Authorization', `Bearer ${authToken}`);
    }

    const response = await request;
    return response.body?.items || [];
  } catch (err) {
    throw err;
  }
}

/** Truncates the text to the specified length.
 * If the text is longer than the specified length, it will be truncated and '...' will be appended.
 * @function truncateText
 * @param {string} text - The text to be truncated.
 * @param {number} maxLength - The maximum length of the text.
 * @return {string} The truncated text.
 */
function truncateText(text = '', maxLength) {
  if (!maxLength || typeof text !== 'string') return text || '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

/**
 * Creates an Express middleware for generating an RSS feed using the listing block of the
 * rss_feed content type.
 *
 * The middleware fetches the query data of the listing block, retrieves the matching items,
 * and generates an RSS feed in XML format, which is sent as the response.
 *
 * @function make_rssMiddleware
 * @return {Function} An Express middleware function for generating the RSS feed.
 */
function make_rssMiddleware() {
  const { settings } = config;
  const APISUFFIX = settings.legacyTraverse ? '' : '/++api++';
  let apiPath = '';
  if (settings.internalApiPath && __SERVER__) {
    apiPath = settings.internalApiPath;
  } else if (__DEVELOPMENT__ && settings.devProxyToApiPath) {
    apiPath = settings.devProxyToApiPath;
  } else {
    apiPath = settings.apiPath;
  }

  async function rssMiddleware(req, res, next) {
    try {
      const {
        query,
        language,
        description,
        title,
        subjects,
        date,
        max_description_length,
        max_title_length,
      } = await getRssFeedData(apiPath, APISUFFIX, req, settings);
      const items = await fetchListingItems(
        query,
        apiPath,
        APISUFFIX,
        req.universalCookies?.get?.('auth_token'),
        req,
      );
      const feedOptions = {
        title: truncateText(title, max_title_length),
        description: truncateText(description, max_description_length),
        feed_url: `${settings.publicURL}${req.path}`,
        site_url: settings.publicURL,
        generator: 'RSS Feed Generator',
        language: language,
        pubDate: new Date(date),
        categories: subjects || [],
      };

      const feed = new RSS(feedOptions);

      items.forEach((item) => {
        let link = toPublicURL(item['getURL']);
        let enclosure = undefined;
        if (
          item.image_field &&
          item.image_scales &&
          item.image_scales[item.image_field] &&
          item.image_scales[item.image_field].length > 0
        ) {
          const imageData = item.image_scales[item.image_field][0];
          const scales = imageData.scales || {};
          const scale =
            scales.preview ||
            scales.large ||
            scales.teaser ||
            Object.values(scales)[0];

          if (scale && scale.download) {
            const imageUrl = `${link}/${scale.download}`;
            const mimeType = item['content-type'];
            const originalSize = imageData.size;
            enclosure = {
              url: imageUrl,
              type: mimeType,
              size: originalSize,
            };
          }
        }
        feed.item({
          title: truncateText(item.title, max_title_length),
          description: truncateText(
            item.description || item.Description || '',
            max_description_length,
          ),
          url: link,
          guid: item.UID,
          date: new Date(item.effective),
          author: item.listCreators?.join(', '),
          categories: item.Subject ? item.Subject : [],
          enclosure: enclosure || undefined,
        });
      });

      const xml = feed.xml({ indent: true });
      res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
      res.send(xml);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Handle unauthorized errors
        res.status(401).json({
          error: 'Unauthorized',
          message:
            'You are not authorized to access the requested RSS feed. Please log in and try again.',
        });
      } else if (err.response && err.response.status === 404) {
        // Handle not found errors
        res.status(404).json({
          error: 'Not Found',
          message:
            'The requested RSS feed could not be found. Please verify the URL and try again.',
        });
      } else {
        // Handle other errors
        res.status(500).json({
          error: 'Internal Server Error',
          message:
            'An unexpected error occurred while generating the RSS feed. Please try again later.',
        });
      }
      return;
    }
  }

  return rssMiddleware;
}

export default function makeMiddlewares() {
  const middleware = express.Router();
  middleware.use(express.urlencoded({ extended: true }));
  middleware.all('**/rss.xml', make_rssMiddleware());

  middleware.id = 'rss-middleware';

  return middleware;
}
