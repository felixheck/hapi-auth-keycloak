const axios = require('axios')
const { GrantManager } = require('keycloak-auth-utils')
const KeycloakToken = require('keycloak-auth-utils/lib/token')
const cache = require('./cache')
const token = require('./token')
const { error, fakeToolkit, verify } = require('./utils')
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
 * Verify the signed token offline with help of the related
 * public key or online with the Keycloak server and JWKS.
 * Both are non-live. Resolve if the verification succeeded.
 *
 * @param {string} tkn The token to be validated
 * @returns {Promise} The error-handled promise
 */
async function verifySignedJwt (tkn) {
  const kcTkn = new KeycloakToken(tkn, options.clientId)
  await manager.validateToken(kcTkn)

  return tkn
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
 *
 * @throws {Error} If token is invalid
 */
async function introspect (tkn) {
  const res = await manager.validateAccessToken(tkn)

  if (res === false) {
    throw Error(error.msg.invalid)
  }

  return tkn
}

/**
 * @function
 * @private
 *
 * Retrieve the Requesting Party Token from the Keycloak Server.
 *
 * @param {string} tkn The token to be used for authentication
 * @returns {Promise} The modified, non-error-handling promise
 *
 * @throws {Error} If request failed or token is invalid
 */
async function getRpt (tkn) {
  const { data } = await axios.get(`${options.realmUrl}/authz/entitlement/${options.clientId}`, {
    headers: { authorization: `bearer ${tkn}` }
  })

  return data.rpt
}

/**
 * @function
 * @private
 *
 * Get validation strategy based on the options.
 * If `secret` is set the token gets introspected.
 * If `entitlement` is truthy it retrieves the RPT.
 * Else perform a non-live validation with public keys.
 *
 * @returns {Function} The related validation strategy
 */
function getValidateFn () {
  return options.secret ? introspect : options.entitlement ? getRpt : verifySignedJwt
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
 * @param {Function} h The toolkit
 */
async function handleKeycloakValidation (tkn, h) {
  try {
    const info = await getValidateFn()(tkn)
    const { expiresIn, credentials } = token.getData(info || tkn, options)
    const userData = { credentials }

    await cache.set(store, tkn, userData, expiresIn)
    return h.authenticated(userData)
  } catch (err) {
    throw error('unauthorized', null, error.msg.invalid)
  }
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
 * @param {Object} h The reply toolkit
 */
async function validate (field, h = (data) => data) {
  const tkn = token.create(field)
  const reply = fakeToolkit(h)

  if (!tkn) {
    throw error('unauthorized', error.msg.missing)
  }

  const cached = await cache.get(store, tkn)
  return cached ? reply.authenticated(cached) : handleKeycloakValidation(tkn, reply)
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
    authenticate (request, h) {
      return validate(request.raw.req.headers.authorization, h)
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
 */
function plugin (server, opts) {
  options = verify(opts)
  manager = new GrantManager(options)
  store = cache.create(server, options.cache)

  server.auth.scheme('keycloak-jwt', strategy)
  server.decorate('server', 'kjwt', { validate })
}

module.exports = {
  register: plugin,
  pkg
}
