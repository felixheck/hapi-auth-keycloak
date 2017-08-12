const axios = require('axios')
const { GrantManager } = require('keycloak-auth-utils')
const KeycloakToken = require('keycloak-auth-utils/lib/token')
const cache = require('./cache')
const token = require('./token')
const { error, fakeReply, verify } = require('./utils')
const pkg = require('../package.json')

/**
 * @type {Object}
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
 * public key or online with the Keycloak server and JWKS.
 * Both are non-live. Resolve if the verification succeeded.
 *
 * @param {string} tkn The token to be validated
 * @returns {Promise} The error-handled promise
 */
function validateSignedJwt (tkn) {
  const kcTkn = new KeycloakToken(tkn, options.clientId)
  return manager.validateToken(kcTkn).then(() => tkn)
}

/**
 * @function
 * @private
 *
 * Validate the token live with help of the related
 * Keycloak server, the client identifier and its secret.
 * Resolve if the request succeeded and token is valid.
 *
 * @param {string} tkn The token to be validated
 * @returns {Promise} The error-handled promise
 */
function validateLive (tkn) {
  return manager.validateAccessToken(tkn).then((res) => {
    if (res === false) {
      throw Error(error.msg.invalid)
    }

    return tkn
  })
}

/**
 * @function
 * @private
 *
 * Retrieve the Requesting Party Token from the Keycloak Server.
 *
 * @param {string} tkn The token to be used for authentication
 * @returns {Promise} The modified, non-error-handling promise
 */
function getRpt (tkn) {
  return axios.get(`${options.realmUrl}/authz/entitlement/${options.clientId}`, {
    headers: {
      authorization: `bearer ${tkn}`
    }
  }).then(({ data }) => data.rpt).catch(() => {
    throw Error(error.msg.invalid)
  })
}

/**
 * @function
 * @private
 *
 * Get validation strategy based on the options.
 * If `live` is enabled and no secret provided.
 * it retrieves the RPT, otherwise the token gets
 * introspected. Else perform a non-live validation
 * with public keys.
 *
 * @returns {Function} The related validation strategy
 */
function getValidateFn () {
  return options.live ? options.secret ? validateLive : getRpt : validateSignedJwt
}

/**
 * @function
 * @public
 *
 * Validate a token either with the help of Keycloak
 * or a related public key. Store the user data in
 * cache if enabled.
 *
 * @param {string} tkn The token to be validated
 * @param {Function} reply The callback handler
 */
function handleKeycloakValidation (tkn, reply) {
  getValidateFn()(tkn).then((info) => {
    const { expiresIn, credentials } = token.getData(info || tkn, options.userInfo)
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
 * @param {string} d The authorization field, e.g. the value of `Authorization`
 * @param {Function} done The callback handler
 */
function validate (field, done) {
  const tkn = token.create(field)
  const reply = fakeReply(done)

  if (!tkn) {
    return reply(error('unauthorized', error.msg.missing))
  }

  cache.get(store, tkn, (err, cached) => {
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
      return validate(request.raw.req.headers.authorization, reply)
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
