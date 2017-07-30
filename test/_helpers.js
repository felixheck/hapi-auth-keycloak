const hapi = require('hapi')
const authKeycloak = require('../src')
const fixtures = require('./_fixtures')

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

  server.connection({
    host: '127.0.0.1',
    port: 1337
  })

  process.on('SIGINT', () => {
    server.stop({ timeout: 10000 }).then((err) => {
      process.exit((err) ? 1 : 0)
    })
  })

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
  registerPlugin
}
