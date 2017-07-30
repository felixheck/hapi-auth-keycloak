const cache = require('./cache')
const manager = require('./manager')
const token = require('./token')
const { error, fakeReply, verify } = require('./utils')
const pkg = require('../package.json')

/**
 * @function
 * @public
 *
 * Validate a token with help of Keycloak.
 * If all validations and requests are successful,
 * save the token and its user data in memory cache.
 *
 * @param {string} token The token to be validated
 * @param {Function} reply The callback handler
 */
function handleKeycloakValidation (tkn, reply) {
  const rawTkn = tkn.get()

  manager.validateAccessToken(rawTkn, reply, () => {
    manager.userInfo(rawTkn, reply, (userInfo) => {
      const { scope, expiresIn } = tkn.getData()
      const userData = { credentials: Object.assign({ scope }, userInfo) }
      cache.set(tkn.get(), userData, expiresIn)

      return reply.continue(userData)
    })
  })
}

/**
 * @function
 * @public
 *
 * Check if token is already cached in memory.
 * If yes, return cached user data. Otherwise
 * handle validation with help of Keycloak.
 *
 * @param {string} field The authorization field, e.g. the value of `Authorization`
 * @param {Function} reply The callback handler
 */
function validate (field, reply) {
  const tkn = token(field)
  fakeReply(reply)

  if (!tkn) {
    return reply(error('unauthorized', error.msg.missing))
  }

  cache.get(tkn.get(), (err, cached) => {
    if (cached && !err) {
      return reply.continue(cached)
    }

    return handleKeycloakValidation(tkn, reply)
  })
}

/**
 * @function
 * @private
 *
 * The authentication strategy based on keycloak.
 * Expect `Authorization: bearer x.y.z` as header.
 * If the token was sent before and is still cached,
 * return the cached user data as credentials.
 *
 * @param {Hapi.Server} server The created server instance
 * @returns {Object} The authentication scheme
 */
function strategy (server) {
  return {
    authenticate (request, reply) {
      return server.kjwt.validate(
        request.raw.req.headers.authorization,
        reply
      )
    }
  }
}

/**
 * @function
 * @public
 *
 * The authentication plugin handler.
 * Initialize memory cache, grant manager for
 * Keycloak and register Basic Auth.
 *
 * @param {Hapi.Server} server The created server instance
 * @param {Object} opts The plugin related options
 * @param {Function} next The callback handler
 */
function plugin (server, opts, next) {
  opts = verify(opts)
  manager.init(opts.client)
  cache.init(server, opts.cache)

  server.auth.scheme('keycloak-jwt', strategy)
  server.decorate('server', 'kjwt', { validate })

  next()
}

module.exports = plugin
module.exports.attributes = {
  pkg
}
