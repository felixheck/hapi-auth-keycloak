const fs = require('fs')
const jsonwebtoken = require('jsonwebtoken')

/**
 * @function
 * @private
 *
 * Compose content object for JWT
 *
 * @param {boolean} access Whether `accessBase` should be added
 * @param {boolean} dates Whether date data should be added
 * @param {Object} [customs] The custom data to be added
 * @returns {Object} The composed content object
 */
const composeContent = (access, dates, customs = {}) => (
  Object.assign(customs, contentBase,
    access ? accessBase : {},
    dates ? { exp: 5, iat: 1 } : {}
  )
)

/**
 * @function
 * @public
 *
 * Compose JWT with private key and payload
 *
 * @param {string} key The key of the `content` object to be signed
 * @returns {string} The composed JWT
 */
const composeJwt = (key) => (
  jsonwebtoken.sign(content[key], fs.readFileSync('./test/fixtures/private-rsa.pem'), { algorithm: 'RS256' })
)

/**
 * @type Object
 * @public
 *
 * Various config
 */
const token = 'abc.def.ghi'
const baseUrl = 'http://localhost:8080'
const clientId = 'foobar'
const secret = '1234-bar-4321-foo'
const realmPath = '/auth/realms/test-me'
const introspectPath = '/protocol/openid-connect/token/introspect'
const entitlementPath = `/authz/entitlement/${clientId}`
const realmUrl = `${baseUrl}${realmPath}`
const publicKeyBuffer = fs.readFileSync('./test/fixtures/public-rsa.pem')
const publicKeyRsa = publicKeyBuffer.toString()
const publicKey = fs.readFileSync('./test/fixtures/public.pem').toString()
const publicKeyCert = fs.readFileSync('./test/fixtures/public.cert').toString()
const publicKeyJwk = {
  kty: 'RSA',
  n: 'ALq_ejKEGv25YOXiRapjf_1eKEIymgSZeihL1khgFYEZtj7JxSswiSvWia1IxE0uO9_8enwB18heUCrp-mrzcaVrNlc8JTuLfAYthKUltsNJXndjs0fzBQmFF9QYNNDly5nYdJL3pgAR10ji-GbOJzfea6--ybHRup7cpVprZ2ZaH8ksC4xa1wdiRabp5eJ-3he8vLw-GcsnL4vsZfjrjAOqqJi0JnyAxdKiYdEDLf8YeggeKKCuWhculRzkVOYEujKEoCe_GT4apimskXelNK4Qzqu21olcpJLUz3QdV_2JTG0B6J8qmdM9rIe3u6Ja6FHRNRbA4tEncVdmc733_CCD0hk--IELmlOG7qFVKTI0nVw3ycPZuIv5obGcF9fzFFPDqtQLAR3YE5DVWlcBXOmewKiUhlv5sTCkKrKTq_vwQDPKZ8OQQkf0Z2QSXzIwGIkoeq1WLhFlAQS4GViETQDMkcEvDrVsQA3zgbVcJ_H5sPLHIa6PVw9e1XKk3Y5UtTJK-92aA9RmoFmb7kjms9j9D4Z32qUVBdSpG44528sy6X0_DIKL78QUCQyHEWC-aHrV7v_1eazQK9J2uMzAZDzotwK6RafmeGCrpWJkhBv_9teqy5s45VihJB9Tit_Y3XQ6zE4nZcQymPkx4XskAT2eqRX2yhDOdvNYJWI5HkKR',
  e: 'AQAB'
}
const invalidJwk = {
  kty: 'RS',
  n: 'ALq_ejKEGv25YOXiRapjf_1eKEIymgSZeihL1khgFYEZtj7JxSswiSvWia1IxE0uO9_8enwB18heUCrp-mrzcaVrNlc8JTuLfAYthKUltsNJXndjs0fzBQmFF9QYNNDly5nYdJL3pgAR10ji-GbOJzfea6--ybHRup7cpVprZ2ZaH8ksC4xa1wdiRabp5eJ-3he8vLw-GcsnL4vsZfjrjAOqqJi0JnyAxdKiYdEDLf8YeggeKKCuWhculRzkVOYEujKEoCe_GT4apimskXelNK4Qzqu21olcpJLUz3QdV_2JTG0B6J8qmdM9rIe3u6Ja6FHRNRbA4tEncVdmc733_CCD0hk--IELmlOG7qFVKTI0nVw3ycPZuIv5obGcF9fzFFPDqtQLAR3YE5DVWlcBXOmewKiUhlv5sTCkKrKTq_vwQDPKZ8OQQkf0Z2QSXzIwGIkoeq1WLhFlAQS4GViETQDMkcEvDrVsQA3zgbVcJ_H5sPLHIa6PVw9e1XKk3Y5UtTJK-92aA9RmoFmb7kjms9j9D4Z32qUVBdSpG44528sy6X0_DIKL78QUCQyHEWC-aHrV7v_1eazQK9J2uMzAZDzotwK6RafmeGCrpWJkhBv_9teqy5s45VihJB9Tit_Y3XQ6zE4nZcQymPkx4XskAT2eqRX2yhDOdvNYJWI5HkKR',
  e: 'AQAB'
}

/**
 * @type Object
 * @public
 *
 * Common attributes
 */
const common = {
  realmUrl,
  clientId,
  secret,
  publicKey,
  publicKeyRsa,
  publicKeyCert,
  publicKeyBuffer,
  publicKeyJwk,
  invalidJwk,
  baseUrl,
  token,
  realmPath,
  introspectPath,
  entitlementPath
}

/**
 * @type Array
 * @public
 *
 * Scope list to be targeted
 */
const targetScope = ['account:manage-account', 'editor', 'otherApp:creator', 'realm:admin']

/**
 * @type Object
 * @private
 *
 * Base attributes for JWT generation
 */
const contentBase = {
  iss: realmUrl,
  sub: '1234567890',
  name: 'John Doe',
  email: 'john.doe@mail.com',
  admin: true,
  active: true
}

/**
 * @type Object
 * @private
 *
 * Access attributes for JWT generation
 */
const accessBase = {
  realm_access: { roles: ['admin'] },
  resource_access: {
    account: { roles: ['manage-account'] },
    foobar: { roles: ['editor'] },
    otherApp: { roles: ['creator'] }
  }
}

/**
 * @type Object
 * @public
 *
 * Content Parts of JWTs
 */
const content = {
  expired: composeContent(true, true),
  noExp: composeContent(true, false),
  noScope: composeContent(false, true),
  current: composeContent(true, false, {
    exp: parseInt(Date.now() / 1000) + 60 * 60
  }),
  rpt: composeContent(true, true, {
    authorization: {
      permissions: [{
        scopes: ['foo.READ', 'foo.WRITE']
      }]
    }
  })
}

module.exports = {
  common,
  composeJwt,
  targetScope,
  content
}
