const boom = require('boom')
const joi = require('joi')
const jwkToPem = require('jwk-to-pem')

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
    joi.string().regex(/^-----BEGIN RSA PUBLIC KEY-----[\s\S]*-----END RSA PUBLIC KEY-----\s?$/ig, 'PEM'),
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
    .example(['name', 'email']),
  apiKey: joi.object({
    in: joi.string().valid('headers', 'query').default('headers')
      .description('Whether the api key is placed in the headers or query')
      .example('query'),
    name: joi.string().min(1).default('authorization')
      .description('The name of the related headers field or query key')
      .example('x-api-key'),
    prefix: joi.string().min(1).default('Api-Key ')
      .description('An optional prefix of the related api key value')
      .example('Apikey '),
    url: joi.string().min(1).required()
      .description('The absolute url to be requested')
      .example('https://foobar.com/api'),
    request: joi.object().default({})
      .description('The detailed request options for `got`')
      .example({ retries: 2 }),
    tokenPath: joi.string().min(1).default('access_token')
      .description('The path to the access token in the response its body as dot notation')
      .example('foo.bar')
  }).unknown(false)
    .description('The configuration of an optional api key strategy interaction with another service')
})
  .without('entitlement', ['secret', 'publicKey'])
  .without('secret', ['entitlement', 'publicKey'])
  .without('publicKey', ['entitlement', 'secret'])
  .unknown(false)
  .required()

/**
 * @function
 * @private
 *
 * Check whether the passed in value is a JSON Web Key.
 *
 * @param {*} key The value to be tested
 * @returns {boolean} Whether the value is a JWK
 */
function isJwk (key) {
  return !!(key && key.kty)
}

/**
 * @function
 * @public
 *
 * Validate the plugin related options.
 * If `publicKey` is JWK transform to PEM.
 *
 * @param {Object} opts The plugin related options
 * @returns {Object} The validated options
 *
 * @throws {TypeError} If JWK is malformed or invalid
 * @throws {Error} If JWK has an unsupported key type
 * @throws {Error} If options are invalid
 */
function verify (opts) {
  if (isJwk(opts.publicKey)) {
    opts.publicKey = jwkToPem(opts.publicKey)
  }

  return joi.attempt(opts, scheme)
}

/**
 * @function
 * @public
 *
 * Get `Boom.unauthorized` error with bound scheme and
 * further attributes If error is available, use its
 * message. Otherwise the provided message.
 *
 * @param {Error|null|undefined} err The error object
 * @param {string} message The error message
 * @param {string} reason The reason for the thrown error
 * @param {string} [scheme = 'Bearer'] The related scheme
 * @returns {Boom.unauthorized} The created `Boom` error
 */
function raiseUnauthorized (error, reason, scheme = 'Bearer') {
  return boom.unauthorized(
    error !== errorMessages.missing ? error : null,
    scheme,
    {
      strategy: 'keycloak-jwt',
      ...(error === errorMessages.missing ? { error } : {}),
      ...(reason && error !== reason ? { reason } : {})
    }
  )
}

/**
 * @type Object
 * @public
 *
 * Used pre-defined error messages
 */
const errorMessages = {
  invalid: 'Invalid credentials',
  missing: 'Missing authorization header',
  rpt: 'Retrieving the RPT failed',
  apiKey: 'Retrieving the token with the api key failed'
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
  isJwk,
  raiseUnauthorized,
  errorMessages,
  fakeToolkit,
  verify
}
