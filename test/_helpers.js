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
const defaults = Object.assign({}, fixtures.clientConfig, { secret: undefined })

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
      config: {
        auth: 'keycloak-jwt',
        handler (req, reply) {
          reply(req.auth.credentials.scope)
        }
      }
    },
    {
      method: 'GET',
      path: '/role',
      config: {
        auth: {
          strategies: ['keycloak-jwt'],
          access: {
            scope: ['editor']
          }
        },
        handler (req, reply) {
          reply(req.auth.credentials.scope)
        }
      }
    },
    {
      method: 'GET',
      path: '/role/guest',
      config: {
        auth: {
          strategies: ['keycloak-jwt'],
          access: {
            scope: ['guest']
          }
        },
        handler (req, reply) {
          reply(req.auth.credentials.scope)
        }
      }
    },
    {
      method: 'GET',
      path: '/role/rpt',
      config: {
        auth: {
          strategies: ['keycloak-jwt'],
          access: {
            scope: ['scope:foo.READ']
          }
        },
        handler (req, reply) {
          reply(req.auth.credentials.scope)
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
function registerPlugin (server, options = defaults, done = () => {}) {
  server.register({
    register: authKeycloak,
    options
  }, () => {
    server.auth.strategy('keycloak-jwt', 'keycloak-jwt')
    registerRoutes(server)
    done(server)
  })
}

/**
 * @function
 * @public
 *
 * Create server with routes, plugin and error handler
 *
 * @param {Object|false} options The plugin related options
 * @param {Function} done The success callback handler
 */
function getServer (options, done) {
  const server = new hapi.Server()

  server.connection()
  server.initialize((err) => {
    if (err) throw err

    if (options === false) {
      return done(server)
    }

    return registerPlugin(server, options, done)
  })
}

module.exports = {
  getOptions,
  mockIntrospect,
  mockEntitlement,
  mockRequest,
  log,
  getServer,
  registerPlugin
}
