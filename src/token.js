const _ = require('lodash')

/**
 * @constructor
 * @public
 *
 * Wrap JSON Web Token to enable additional features.
 *
 * @param {string} field The bearer token field
 * @returns {token} The token wrapper
 */
function token (field) {
  let tkn

  /**
   * @function
   * @private
   *
   * Extract bearer token out of header.
   * https://tools.ietf.org/html/rfc7519
   *
   * @param {string} header The header to be scanned
   * @returns {string} The extracted header
   */
  function extractToken (header) {
    return /^(?:bearer) ([a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?)$/i.exec(header)
  }

  /**
   * @function
   * @private
   *
   * Get scope out of token content.
   * Exclude `account` roles and prefix realm roles
   * with `realm:`. Roles of other resources are prefixed
   * with their name.
   *
   * @param {Object} [realm] The realm access data
   * @param {Object} [resource] The resource access data
   * @returns {Array.<?string>} The list of roles
   */
  function getScope ({
    realm_access: realm = { roles: [] },
    resource_access: resource = {}
  }) {
    delete resource.account
    const realmRoles = realm.roles.map(role => `realm:${role}`)

    const appRoles = _.flatten(_.map(resource, 'roles'))

    return [...realmRoles, ...appRoles]
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
   * @param {Array.<?string>} fields The necessary fields
   * @returns {Object} The collection of requested user info
   */
  function getUserInfo (content, fields) {
    return _.pick(content, _.uniq(['sub', ...fields]))
  }

  /**
   * @function
   * @public
   *
   * Extract content out of token.
   * The content is the middle part.
   *
   * @returns {Object} The token its content
   */
  function getContent () {
    return JSON.parse(Buffer.from(tkn.split('.')[1], 'base64').toString())
  }

  /**
   * @function
   * @public
   *
   * Get various data out of token content.
   * Get the current scope of the user and
   * when the token expires.
   *
   * @returns {Object} The extracted data
   */
  function getData (userInfoFields) {
    const content = getContent()

    return {
      scope: getScope(content),
      expiresIn: getExpiration(content),
      ...getUserInfo(content, userInfoFields)
    }
  }

  /**
   * @function
   * @public
   *
   * Get the original token.
   *
   * @returns {string} The original token
   */
  function get () {
    return tkn
  }

  /**
   * @function
   * @private
   *
   * Initialize token instance.
   *
   * @returns {Object|false} The token instance or `false` dependent on field
   */
  function init () {
    const match = extractToken(field)

    if (!match) {
      return false
    }

    tkn = match[1]

    return {
      getContent,
      getData,
      get
    }
  }

  return init()
}

module.exports = token
