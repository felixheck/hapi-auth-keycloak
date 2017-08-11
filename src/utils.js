const boom = require('boom')
const joi = require('joi')

/**
 * @type `joi.scheme`
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
  ).description('The related public key of the Keycloak client/application'),
  addScopes: joi.boolean().default(false)
    .description('Whether the RPT should be retrieved and the scopes be added to `request.auth.credentials.scope`')
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
.nand('secret', 'publicKey')
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
 * @throws Options are invalid
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
function error (type, err, msg) {
  return boom[type](err ? err.message || err.toString() : msg, 'Bearer')
}

/**
 * @type Object
 *
 * Error messages
 */
error.msg = {
  missing: 'Missing or invalid authorization header',
  invalid: 'Invalid credentials'
}

/**
 * @function
 * @public
 *
 * Fake `Hapi` reply interface to provide an
 * error-first but error-less `continue` method.
 *
 * @param {Function} reply
 * @returns {Function} The decorated function
 */
function fakeReply (reply) {
  if (!reply.continue) {
    reply.continue = reply.bind(undefined, null)
  }

  return reply
}

module.exports = {
  error,
  fakeReply,
  verify
}
