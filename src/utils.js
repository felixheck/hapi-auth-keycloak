const boom = require('boom')
const joi = require('joi')

/**
 * @type Object
 * @private
 *
 * The plugin options scheme
 */
const scheme = joi.object({
  realmUrl: joi.string().uri().required()
    .description('The absolute uri of the Keycloak realm')
    .example('https://localhost:8080/auth/realms/testme'),
  clientId: joi.string().min(1).required()
    .description('The identifier of the Keycloak client/application')
    .example('foobar'),
  secret: joi.string().min(1)
    .description('The related secret of the Keycloak client/application')
    .example('1234-bar-4321-foo'),
  publicKey: joi.alternatives().try(
    joi.string().regex(/^-----BEGIN((( RSA)? PUBLIC KEY)| CERTIFICATE)-----[\s\S]*-----END((( RSA)? PUBLIC KEY)| CERTIFICATE)-----\s?$/ig, 'PEM'),
    joi.object().type(Buffer),
    joi.object({
      kty: joi.string().required()
    }).unknown(true)
  ).description('The realm its public key related to the private key used to sign the token'),
  entitlement: joi.boolean().invalid(false)
    .description('The token should be validated with the entitlement API')
    .example('true'),
  minTimeBetweenJwksRequests: joi.number().integer().positive().allow(0).default(0)
    .description('The minimum time between JWKS requests in seconds')
    .example(15),
  cache: joi.alternatives().try(joi.object({
    segment: joi.string().default('keycloakJwt')
  }), joi.boolean()).default(false)
    .description('The configuration of the hapi.js cache powered by catbox')
    .example('true'),
  userInfo: joi.array().items(joi.string().min(1))
    .description('List of properties which should be included in the `request.auth.credentials` object')
    .example(['name', 'email'])
})
.without('entitlement', ['secret', 'publicKey'])
.without('secret', ['entitlement', 'publicKey'])
.without('publicKey', ['entitlement', 'secret'])
.unknown(false)
.required()

/**
 * @function
 * @public
 *
 * Validate the plugin related options.
 *
 * @param {Object} opts The plugin related options
 * @returns {Object} The validated options
 *
 * @throws {Error} Options are invalid
 */
function verify (opts) {
  return joi.attempt(opts, scheme)
}

/**
 * @function
 * @public
 *
 * Get `Boom` error with bound scheme.
 * If error is available, use its message.
 * Otherwise the provided message.
 *
 * @param {string} type The `Boom` error type
 * @param {Error|null} err The error object
 * @param {string} msg The error message
 * @returns {Boom} The created `Boom` error
 */
function raiseError (type, err, msg) {
  return boom[type](err ? err.message : msg, 'Bearer')
}

const errors = {
  invalid: 'Invalid credentials',
  missing: 'Missing or invalid authorization header',
  rpt: 'Retrieving the RPT failed'
}

/**
 * @function
 * @public
 *
 * Fake `Hapi` reply toolkit to provide an `authenticated` method.
 *
 * @param {Object|Function} h The original toolkit/mock
 * @returns {Object|Function} The decorated toolkit/mock
 */
function fakeToolkit (h) {
  if (!h.authenticated && typeof h === 'function') {
    h.authenticated = h
  }

  return h
}

module.exports = {
  raiseError,
  errors,
  fakeToolkit,
  verify
}
