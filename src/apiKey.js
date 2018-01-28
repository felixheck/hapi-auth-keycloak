const _ = require('lodash')
const got = require('got')
const pupa = require('pupa')
const { raiseUnauthorized, errorMessages } = require('./utils')

/**
 * @function
 * @public
 *
 * Get api key endpoint its url with replaced placeholders.
 *
 * @param {Object} pluginOptions The plugin related options
 * @returns {string|false} The rendered url if available
 */
function parseUrl (pluginOptions) {
  const { apiKey, clientId, realmUrl } = pluginOptions

  return !!apiKey && pupa(apiKey.url, {
    realm: realmUrl.split('/').slice(-1),
    clientId
  })
}

/**
 * @function
 * @public
 *
 * Extract the api key out of the original
 * incoming request if possible. Otherwise
 * return `false`.
 *
 * @param {Hapi.request} request The incoming request object
 * @param {Object} options The api key related options
 * @returns {string|false} The extracted api key if premises matched
 */
function getApiKey (request, options) {
  const key = request[options.in][options.name]
  const hasApiKey = !!key && key.startsWith(options.prefix)

  return hasApiKey && key
}

/**
 * @function
 * @public
 *
 * Copy the authorization data of the original incoming request
 * to the request of the api key service. Extend headers or query
 * related to the settings. If there is no related key set or the
 * set key is not prefixed with the defined prefix, get `false`.
 * Otherwise the options for the proxied request.
 *
 * @param {Hapi.request} request The incoming request object
 * @param {Object} options The api key related options
 * @returns {Object|false} The request options if premises matched
 */
function getRequestOptions (request, options) {
  const key = getApiKey(request, options)
  const path = `${options.in}.${options.name}`
  const requestOptions = Object.assign({ [options.in]: {} }, options.request)

  return key && _.set(requestOptions, path, key)
}

/**
 * @function
 * @public
 *
 * Extend the hapi request life cycle with an
 * additional api key interceptor.
 *
 * @param {Hapi.server} server The related hapi server object
 * @param {Object} options The api key related options
 * @param {string} url The url to be requested
 *
 * @throws {Boom.unauthorized} If requesting the access token failed
 */
function extendLifeCycle (server, options, url) {
  server.ext('onRequest', async (request, h) => {
    const requestOptions = getRequestOptions(request, options)

    if (requestOptions) {
      try {
        const res = await got(url, requestOptions)
        const body = JSON.parse(res.body)
        const token = _.get(body, options.tokenPath)

        request.headers.authorization = `Bearer ${token}`
      } catch (err) {
        throw raiseUnauthorized(null, errorMessages.apiKey, err.message)
      }
    }

    return h.continue
  })
}

/**
 * @function
 * @public
 *
 * Initialize the api key strategy if enabled by
 * user: parse the url based on the settings and
 * extend request life cycle.
 *
 * @param {Hapi.server} server The related hapi server object
 * @param {Object} pluginOptions The plugin related options
 */
function init (server, pluginOptions) {
  const options = pluginOptions.apiKey
  const url = parseUrl(pluginOptions)

  if (options) {
    extendLifeCycle(server, options, url)
  }
}

module.exports = {
  parseUrl,
  getApiKey,
  getRequestOptions,
  extendLifeCycle,
  init
}
