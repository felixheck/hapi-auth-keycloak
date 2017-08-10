const { GrantManager } = require('keycloak-auth-utils')
const KeycloakToken = require('keycloak-auth-utils/lib/token')
const cache = require('./cache')
const token = require('./token')
const { error, fakeReply, verify } = require('./utils')
const pkg = require('../package.json')

/**
 * @type {Object|GrantManager}
 * @private
 *
 * The plugin related options and instances.
 */
let options
let manager
let store

/**
 * @function
 * @private
 *
 * Validate the signed token offline with help of the related
 * public key or online with help of the Keycloak server and
 * JWKS. Resolve if the verification succeeded.
 *
 * @param {string} tkn The token to be validated
 * @returns {Promise} The error-handled promise
 */
function validateSignedJwt (tkn) {
  const kcTkn = new KeycloakToken(tkn, options.clientId)
  return manager.validateToken(kcTkn)
}

/**
 * @function
 * @private
 *
 * Validate the token online with help of the related
 * Keycloak server, the client identifier and its secret.
 * Resolve if the request succeeded and token is valid.
 *
 * @param {string} tkn The token to be validated
 * @returns {Promise} The error-handled promise
 */
function validateSecret (tkn) {
  return manager.validateAccessToken(tkn).then((res) => {
    if (res === false) {
      throw Error(error.msg.invalid)
    }

    return tkn
  })
}

/**
 * @function
 * @public
 *
 * Validate a token either with the help of Keycloak
 * or a related public key. Store the user data in
 * cache if enabled.
 *
 * @param {string} token The token to be validated
 * @param {Function} reply The callback handler
 */
function handleKeycloakValidation (tkn, reply) {
  const validateFn = options.secret ? validateSecret : validateSignedJwt

  validateFn(tkn).then(() => {
    const { expiresIn, credentials } = token.getData(tkn, options.userInfo)
    const userData = { credentials }

    cache.set(store, tkn, userData, expiresIn)
    reply.continue(userData)
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
  const tkn = token.create(field)
  const done = fakeReply(reply)

  if (!tkn) {
    return done(error('unauthorized', error.msg.missing))
  }

  cache.get(store, tkn, (err, cached) => {
    const isCached = cached && !err
    isCached ? done.continue(cached) : handleKeycloakValidation(tkn, done)
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
  manager = new GrantManager(options)
  store = cache.create(server, options.cache)

  server.auth.scheme('keycloak-jwt', strategy)
  server.decorate('server', 'kjwt', { validate })

  next()
}

module.exports = plugin
module.exports.attributes = {
  pkg
}
