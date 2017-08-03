const axios = require('axios')
const cache = require('./cache')
const token = require('./token')
const { error, fakeReply, verify } = require('./utils')
const pkg = require('../package.json')

/**
 * @type Object
 * @private
 *
 * The plugin related options
 */
let options

function validateOnline (token) {
  return axios.post(`${options.realmUrl}/protocol/openid-connect/token/introspect`, {
    token,
    client_secret: options.secret,
    client_id: options.clientId
  }).then(({ data }) => {
    if (!data.active) {
      throw Error(error.msg.invalid)
    }

    return token
  })
}

/**
 * @function
 * @public
 *
 * Validate a token with help of Keycloak.
 *
 * @param {string} token The token to be validated
 * @param {Function} reply The callback handler
 */
function handleKeycloakValidation (tkn, reply) {
  validateOnline(tkn.get()).then((res) => {
    const { expiresIn, credentials } = tkn.getData(options.userInfo)
    const userData = { credentials }

    cache.set(tkn.get(), userData, expiresIn)
    return reply.continue(userData)
  }).catch((err) => {
    reply(error('unauthorized', err, error.msg.invalid))
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
    const isCached = cached && !err
    isCached ? reply.continue(cached) : handleKeycloakValidation(tkn, reply)
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
  options = verify(opts)
  cache.init(server, options.cache)

  server.auth.scheme('keycloak-jwt', strategy)
  server.decorate('server', 'kjwt', { validate })

  next()
}

module.exports = plugin
module.exports.attributes = {
  pkg
}
