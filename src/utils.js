const boom = require('boom')
const joi = require('joi')

/**
 * @type `joi.scheme`
 * @private
 *
 * The plugin options scheme
 */
const scheme = joi.object({
  realmUrl: joi.string().uri().required(),
  clientId: joi.string().min(1).required(),
  secret: joi.string().min(1),
  publicKey: joi.string().regex(/^-----BEGIN(?: RSA)? PUBLIC KEY-----[\s\S]*-----END(?: RSA)? PUBLIC KEY-----$/ig, 'PEM'),
  verifyOpts: joi.object().unknown(true),
  cache: joi.alternatives().try(joi.object({
    segment: joi.string().default('keycloakJwt')
  }), joi.boolean()).default(false),
  userInfo: joi.array().items(joi.string().min(1))
})
.xor('secret', 'publicKey')
.without('secret', 'verifyOpts')
.forbidden('verifyOpts.ignoreExpiration', 'verifyOpts.ignoreNotBefore')
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
 */
function fakeReply (reply) {
  if (!reply.continue) {
    reply.continue = reply.bind(undefined, null)
  }
}

module.exports = {
  error,
  fakeReply,
  verify
}
