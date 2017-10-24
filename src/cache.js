/**
 * @function
 * @public
 *
 * Initiate a cache
 *
 * @param {Hapi.Server} server The created server instance
 * @param {Object|boolean} [opts=false] The instance its options
 * @returns {Object|false} The cache instance
 */
function create (server, opts = false) {
  return opts && server.cache(opts === true ? { segment: 'keycloakJwt' } : opts)
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
function get (cache, key) {
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
 * @param {Array} rest The arguments passed to hapi its `cache.set`
 */
async function set (cache, ...rest) {
  cache && await cache.set(...rest)
}

module.exports = {
  create,
  get,
  set
}
