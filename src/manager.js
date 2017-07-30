const { GrantManager } = require('keycloak-auth-utils')
const { error } = require('./utils')

let instance

/**
 * @function
 * @public
 *
 * Initiate `GrantManager` singleton
 *
 * @param {Object} opts The instance its options
 * @returns {GrantManager} The current instance
 */
function init (opts) {
  if (instance === undefined) {
    instance = new GrantManager(opts)
  }

  return instance
}

/**
 * @function
 * @public
 *
 * Get user information out of the token.
 * Handle errors internally.
 *
 * @param {string} tkn The `access_token` to be checked
 * @param {Function} reply The requests its reply interface
 * @param {Function} done The success handler
 */
function userInfo (tkn, reply, done) {
  instance.userInfo(tkn, (err, res) => {
    if (err) {
      return reply(error('unauthorized', err))
    }

    return done(res)
  })
}

/**
 * @function
 * @public
 *
 * Validate passed `access_token`.
 * Handle errors internally.
 *
 * @param {string} tkn The `access_token` to be validated
 * @param {Function} reply The requests its reply interface
 * @param {Function} done The success handler
 */
function validateAccessToken (tkn, reply, done) {
  instance.validateAccessToken(tkn, (err, res) => {
    if (!res || err) {
      return reply(error('unauthorized', err, error.msg.invalid))
    }

    return done(res)
  })
}

/**
 * @function
 * @public
 *
 * Reset the current `GrantManager` instance
 *
 */
function reset () {
  instance = undefined
}

module.exports = {
  init,
  userInfo,
  validateAccessToken,
  reset
}
