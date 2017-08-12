const _ = require('lodash')
const jwt = require('jsonwebtoken')

/**
 * @function
 * @private
 *
 * Extract bearer token out of header.
 * https://tools.ietf.org/html/rfc7519
 *
 * @param {string} field The header field to be scanned
 * @returns {string} The extracted header
 */
function getToken (field) {
  return /^(?:bearer) ([a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?)$/i.exec(field)
}

/**
 * @function
 * @private
 *
 * Get roles out of token content.
 * Exclude `account` roles and prefix realm roles
 * with `realm:`. Roles of other resources are prefixed
 * with their name.
 *
 * @param {Object} [realm] The realm access data
 * @param {Object} [resource] The resource access data
 * @returns {Array.<?string>} The list of roles
 */
function getRoles ({
  realm_access: realm = { roles: [] },
  resource_access: resource = {},
  authorization: auth = { permissions: [] }
}) {
  delete resource.account

  const realmRoles = realm.roles.map(role => `realm:${role}`)
  const appRoles = _.flatten(_.map(resource, 'roles'))
  const scopes = _.flatten(_.map(auth.permissions, 'scopes')).map(scope => `scope:${scope}`)

  return [...realmRoles, ...appRoles, ...scopes]
}

/**
 * @function
 * @private
 *
 * Get expiration out of token content.
 *
 * @param {number} [exp] The `expiration` timestamp in seconds
 * @param {number} [iat] The `issued at` timestamp in seconds
 * @returns {number} The expiration delta in milliseconds
 */
function getExpiration ({ exp = 60, iat = 0 }) {
  return (exp - iat) * 1000
}

/**
 * @function
 * @private
 *
 * Get necessary user information out of token content.
 *
 * @param {Object} content The token its content
 * @param {Array.<?string>} [fields] The necessary fields
 * @returns {Object} The collection of requested user info
 */
function getUserInfo (content, fields = []) {
  return _.pick(content, ['sub', ...fields])
}

/**
 * @function
 * @public
 *
 * Get various data out of token content.
 * Get the current scope of the user and
 * when the token expires.
 *
 * @param {string} tkn The token to be checked
 * @returns {Object} The extracted data
 */
function getData (tkn, userInfoFields) {
  const content = jwt.decode(tkn)
  const scope = getRoles(content)

  return {
    expiresIn: getExpiration(content),
    credentials: Object.assign({ scope }, getUserInfo(content, userInfoFields))
  }
}

/**
 * @function
 * @public
 *
 * Get token out of header field.
 *
 * @param {string} field The header field to be scanned
 * @returns {string|false} The token or `false` dependent on field
 */
function create (field) {
  const match = getToken(field)

  return match ? match[1] : false
}

module.exports = {
  create,
  getData
}
