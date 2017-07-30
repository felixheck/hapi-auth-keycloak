let instance

/**
 * @function
 * @public
 *
 * Initiate a cache singleton
 *
 * @param {Hapi.Server} server The created server instance
 * @param {Object|false} opts The instance its options
 * @returns {Object} The cache instance
 */
function init (server, opts) {
  if (instance === undefined) {
    if (opts === false) {
      instance = false
    } else {
      instance = server.cache(opts)
    }
  }

  return instance
}

/**
 * @function
 * @public
 *
 * Get value out of cache by key.
 * Just if cache is initiated.
 *
 * @param {*} key The key to be searched
 * @param {Function} done The callback handler
 */
function get (key, done) {
  instance ? instance.get(key, done) : done(null, false)
}

/**
 * @function
 * @public
 *
 * Set value specified by key in cache.
 * Just if cache is initiated.
 *
 * @param {*} key The key to be indexed
 * @param {*} value The value to be stored
 * @param {number} ttl The time to live
 * @param {Function} done The callback handler
 */
function set (key, value, ttl, done) {
  instance && instance.set(key, value, ttl, done)
}

/**
 * @function
 * @public
 *
 * Reset the current cache instance
 *
 */
function reset () {
  instance = undefined
}

module.exports = {
  init,
  get,
  set,
  reset
}
