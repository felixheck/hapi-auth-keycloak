const hapi = require('hapi')
const nock = require('nock')
const authKeycloak = require('../src')
const fixtures = require('./fixtures')

/**
 * @type Object
 * @private
 *
 * The default plugin configuration
 */
const defaults = {
  realmUrl: fixtures.common.realmUrl,
  clientId: fixtures.common.clientId
}

/**
 * @function
 * @public
 *
 * Get overridden valid default options with customs.
 *
 * @param {Object} customs The options to be changed
 * @returns {Object} The customized options
 */
function getOptions (customs) {
  return Object.assign({}, defaults, customs)
}

/**
 * @function
 * @public
 *
 * Mock introspect request to the Keycloak server.
 *
 * @param {number} code The status code to be returned
 * @param {Object} data The response object to be returned
 * @param {boolean} [isError=false] Whether to reply with an error
 */
function mockIntrospect (code, data, isError = false) {
  const base = nock(fixtures.common.baseUrl)
    .post(`${fixtures.common.realmPath}${fixtures.common.introspectPath}`)

  isError ? base.replyWithError(data) : base.reply(code, data)
}

/**
 * @function
 * @public
 *
 * Mock entitlement request to the Keycloak server.
 *
 * @param {number} code The status code to be returned
 * @param {Object} data The response object to be returned
 * @param {boolean} [isError=false] Whether to reply with an error
 */
function mockEntitlement (code, data, isError = false) {
  const base = nock(fixtures.common.baseUrl)
    .get(`${fixtures.common.realmPath}${fixtures.common.entitlementPath}`)

  isError ? base.replyWithError(data) : base.reply(code, data)
}

/**
 * @function
 * @public
 *
 * Mock request to the api key service.
 *
 * @param {number} code The status code to be returned
 * @param {Object} data The response object to be returned
 */
function mockApiKey (code, data) {
  nock('http://barfoo.com').get('/foo/bar').reply(code, data)
}

/**
 * @function
 * @public
 *
 * Mock request object to be injected.
 *
 * @param {string} field The `authorization` header its value
 * @param {string} [url] The url of the request
 * @returns {Object} The composed request object
 */
function mockRequest (field, url = '/') {
  return {
    method: 'GET',
    url,
    headers: {
      authorization: field
    }
  }
}

/**
 * @function
 * @public
 *
 * Log the option name with the asserted value.
 *
 * @param {string} option The name of the option
 * @param {*} value The value to be asserted
 * @returns {string} The aggregated log message
 */
function log (option, value) {
  return `${option}: ${value && value.toString()}`
}

/**
 * @function
 * @private
 *
 * Register protected routes.
 *
 * @param {Hapi.Server} server The server to be decorated
 */
function registerRoutes (server) {
  server.route([
    {
      method: 'GET',
      path: '/',
      options: {
        auth: 'keycloak-jwt',
        handler (req) {
          return req.auth.credentials.scope
        }
      }
    },
    {
      method: 'GET',
      path: '/role',
      options: {
        auth: {
          strategies: ['keycloak-jwt'],
          access: {
            scope: ['editor']
          }
        },
        handler (req) {
          return req.auth.credentials.scope
        }
      }
    },
    {
      method: 'GET',
      path: '/role/guest',
      options: {
        auth: {
          strategies: ['keycloak-jwt'],
          access: {
            scope: ['guest']
          }
        },
        handler (req) {
          return req.auth.credentials.scope
        }
      }
    },
    {
      method: 'GET',
      path: '/role/rpt',
      options: {
        auth: {
          strategies: ['keycloak-jwt'],
          access: {
            scope: ['scope:foo.READ']
          }
        },
        handler (req) {
          return req.auth.credentials.scope
        }
      }
    },
    {
      method: 'GET',
      path: '/proxy',
      options: {
        handler (req) {
          return {
            headers: req.headers,
            query: req.query
          }
        }
      }
    },
    {
      method: 'GET',
      path: '/mode-optional',
      options: {
        auth: { strategy: 'keycloak-jwt', mode: 'optional' },
        handler (req) {
          return {
            headers: req.headers,
            query: req.query
          }
        }
      }
    },
    {
      method: 'GET',
      path: '/mode-try',
      options: {
        auth: { strategy: 'keycloak-jwt', mode: 'try' },
        handler (req) {
          return {
            headers: req.headers,
            query: req.query
          }
        }
      }
    }
  ])
}

/**
 * @function
 * @public
 *
 * Register the plugin with passed options
 *
 * @param {Hapi.Server} server The server to be decorated
 * @param {Object} options The plugin related options
 * @param {Function} done The success callback handler
 */
async function registerPlugin (server, options = defaults) {
  await server.register({
    plugin: authKeycloak,
    options
  })

  server.auth.strategy('keycloak-jwt', 'keycloak-jwt')
  registerRoutes(server)

  return server
}

/**
 * @function
 * @public
 *
 * Create server with routes, plugin and error handler
 *
 * @param {Object|false} options The plugin related options
 */
async function getServer (options) {
  const server = hapi.server()

  await server.initialize()

  if (options === false) {
    registerRoutes(server)
    return server
  }

  return registerPlugin(server, options)
}

module.exports = {
  getOptions,
  mockIntrospect,
  mockEntitlement,
  mockRequest,
  mockApiKey,
  log,
  getServer,
  registerPlugin
}
