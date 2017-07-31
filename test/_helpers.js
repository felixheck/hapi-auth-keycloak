const hapi = require('hapi')
const _ = require('lodash')
const { GrantManager } = require('keycloak-auth-utils')
const authKeycloak = require('../src')
const fixtures = require('./_fixtures')

const GrantManagerClone = {}

/**
 * @type Object
 * @private
 *
 * The default plugin configuration
 */
const defaults = {
  client: fixtures.config,
  cache: false
}

/**
 * @type Object.<Function>
 * @public
 *
 * Provide several functions to clone, reset and
 * stub methods of `GrantManager`.
 */
const prototypes = {
  clone () {
    GrantManagerClone.prototype = _.cloneDeep(GrantManager.prototype)
  },
  reset () {
    GrantManager.prototype = GrantManagerClone.prototype
  },
  stub (name, value, type = 'resolve') {
    GrantManager.prototype[name] = function () {
      return Promise[type](value)
    }
  }
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
          reply({ foo: 42 })
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
          reply({ foo: 42 })
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
          reply({ foo: 42 })
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
  getServer,
  registerPlugin,
  prototypes
}
