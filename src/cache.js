/**
 * @function
 * @public
 *
 * Initiate a cache
 *
 * @param {Hapi.Server} server The created server instance
 * @param {Object|boolean} opts The instance its options
 * @returns {Object|false} The cache instance
 */
function create (server, opts) {
  return opts
    ? server.cache(opts === true ? { segment: 'keycloakJwt' } : opts)
    : false
}

/**
 * @function
 * @public
 *
 * Get value out of cache by key.
 * Just if cache is initiated.
 *
 * @param {Object} The cache instance
 * @param {*} key The key to be searched
 */
async function get (cache, key) {
  return cache ? cache.get(key) : false
}

/**
 * @function
 * @public
 *
 * Set value specified by key in cache.
 * Just if cache is initiated.
 *
 * @param {Object} The cache instance
 * @param {*} key The key to be indexed
 * @param {*} value The value to be stored
 * @param {number} ttl The time to live
 */
async function set (cache, key, value, ttl) {
  cache && await cache.set(key, value, ttl)
}

module.exports = {
  create,
  get,
  set
}
