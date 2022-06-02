const got = require('got')
const GrantManager = require('keycloak-connect/middleware/auth-utils/grant-manager')
const KeycloakToken = require('keycloak-connect/middleware/auth-utils/token')
const apiKey = require('./apiKey')
const cache = require('./cache')
const token = require('./token')
const { verifyStrategyOptions, verifyPluginOptions } = require('./utils')
const { raiseUnauthorized, errorMessages, fakeToolkit } = require('./utils')
const pkg = require('../package.json')

/**
 * @type {Object}
 * @private
 *
 * The plugin & strategy related options and instances.
 */
const manager = {}
const store = {}
let options = {}
let pluginOptions

/**
 * @function
 * @private
 *
 * Verify the signed token offline with help of the related
 * public key or online with the Keycloak server and JWKS.
 * Both are non-live. Resolve if the verification succeeded.
 *
 * @param {string} tkn The token to be validated
 * @param {string} name The unique name of the strategy
 * @returns {Promise} The error-handled promise
 */
async function verifySignedJwt (tkn, name) {
  const { clientId } = options[name]
  const kcTkn = new KeycloakToken(tkn, clientId)
  await manager[name].validateToken(kcTkn, 'Bearer')

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
 * @param {string} name The unique name of the strategy
 * @returns {Promise} The error-handled promise
 *
 * @throws {Error} If token is invalid or request failed
 */
async function introspect (tkn, name) {
  try {
    const isValid = await manager[name].validateAccessToken(tkn)
    if (isValid === false) throw Error(errorMessages.invalid)
  } catch (err) {
    throw Error(errorMessages.invalid)
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
 * @param {string} name The unique name of the strategy
 * @returns {Promise} The modified, non-error-handling promise
 *
 * @throws {Error} If token is invalid or request failed
 */
async function getRpt (tkn, name) {
  const { realmUrl, clientId } = options[name]
  let body = {}

  try {
    ({ body } = await got.get(`${realmUrl}/authz/entitlement/${clientId}`, {
      headers: { authorization: `bearer ${tkn}` }
    }))
  } catch (err) {
    throw Error(errorMessages.rpt)
  }

  return body.rpt
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
 * @param {string} name The unique name of the strategy
 * @returns {Function} The related validation strategy
 */
function getValidateFn (name) {
  const { secret, entitlement } = options[name]
  return secret ? introspect : entitlement ? getRpt : verifySignedJwt
}

/**
 * @function
 * @public
 *
 * Validate a token either with the help of Keycloak or a
 * related public key. Store the user data in cache if enabled.
 *
 * @param {string} tkn The token to be validated
 * @param {string} name The unique name of the strategy
 * @param {Function} h The toolkit
 *
 * @throws {Boom.unauthorized} If previous validation fails
 */
async function handleKeycloakValidation (tkn, name, h) {
  try {
    const info = await getValidateFn(name)(tkn, name)
    const { expiresIn, credentials } = token.getData(info || tkn, options[name])
    const userData = { credentials }

    await cache.set(store[name], tkn, userData, expiresIn)
    return h.authenticated(userData)
  } catch (err) {
    throw raiseUnauthorized(errorMessages.invalid, err.message, name)
  }
}

/**
 * @function
 * @public
 *
 * Expect `Authorization: bearer x.y.z` as header.
 * If the token was sent before and is still cached,
 * return the cached user data as credentials.
 * Otherwise handle validation with help of Keycloak.
 *
 * @param {string} field The authorization field, e.g. the value of `Authorization`
 * @param {string} name The unique name of the strategy
 * @param {Object} [h = (data)  => data] The reply toolkit
 *
 * @throws {Boom.unauthorized} If header is missing or has an invalid format
 */
async function validate (field, name, h = (data) => data) {
  if ((!!name && !(name in options)) || (Object.keys(options).length > 1 && !name)) {
    throw raiseUnauthorized(errorMessages.missingName)
  }

  if (sharing) {
    return h.authenticated({
      credentials: {
        isValid: true,
        sharing
      }
    })
  }

  if (!field) {
    throw raiseUnauthorized(errorMessages.missing, null, name)
  }

  const tkn = token.create(field)
  const reply = fakeToolkit(h)

  if (!tkn) {
    throw raiseUnauthorized(errorMessages.invalid, null, name)
  }

  const cached = await cache.get(store[name], tkn)
  return cached ? reply.authenticated(cached) : handleKeycloakValidation(tkn, name, reply)
}

/**
 * @function
 * @private
 *
 * The authentication strategy based on keycloak.
 * Initialize memory cache, grant manager for keycloak.
 *
 * @param {Hapi.Server} server The created server instance
 * @param {Object} strategyOptions The strategy related options
 * @returns {Object} The authentication scheme
 */
function strategy (server, strategyOptions) {
  const mergedOptions = { ...pluginOptions, ...strategyOptions }
  delete mergedOptions.apiKey

  const opts = verifyStrategyOptions(mergedOptions)

  if (process.env.NODE_ENV !== 'test' && opts.name in options) {
    throw Error(`The passed name '${opts.name}' already exists.`)
  }

  options[opts.name] = opts
  manager[opts.name] = new GrantManager(opts)
  store[opts.name] = cache.create(server, opts.cache)

  return {
    authenticate (request, h) {
      return validate(request.raw.req.headers.authorization, opts.name, h)
    }
  }
}

/**
 * @function
 * @public
 *
 * The authentication plugin handler.
 * Initialize api key handler and register auth schemes.
 *
 * @param {Hapi.Server} server The created server instance
 * @param {Object} opts The plugin related options
 */
function register (server, opts) {
  pluginOptions = verifyPluginOptions(opts)
  apiKey.init(server, pluginOptions)

  server.auth.scheme('keycloak-jwt', strategy)
  server.decorate('server', 'kjwt', {
    validate,
    getOptions: () => options,
    resetOptions: () => { options = {} }
  })
}

module.exports = { register, pkg }
