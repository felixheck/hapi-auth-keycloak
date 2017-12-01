const test = require('ava')
const helpers = require('./_helpers')
const fixtures = require('./fixtures')
const apiKey = require('../src/apiKey')

const cfg = helpers.getOptions({ publicKey: fixtures.common.publicKeyJwk })
const mockResponse = {
  access_token: 'barfoo'
}
const defaults = {
  url: 'http://barfoo.com/foo/bar',
  in: 'headers',
  prefix: 'Api-Key ',
  name: 'authorization',
  request: {},
  tokenPath: 'access_token'
}

test('Do not replace api key with bearer token because of missing options', async (t) => {
  const server = await helpers.getServer(cfg, false)

  apiKey.init(server, cfg)

  const { result } = await server.inject({
    url: '/proxy',
    headers: {
      authorization: 'Api-Key foobar'
    }
  })

  t.is(result.headers.authorization, 'Api-Key foobar')
  t.is(Object.keys(result.query).length, 0)
})

test('Do not replace api key with bearer token because of missing api key', async (t) => {
  const server = await helpers.getServer(cfg, false)

  apiKey.init(server, Object.assign({
    apiKey: defaults
  }, cfg))

  const { result } = await server.inject({
    url: '/proxy'
  })

  t.falsy(result.headers.authorization)
  t.is(Object.keys(result.query).length, 0)
})

test('Do not replace api key with bearer token because of failing request', async (t) => {
  helpers.mockApiKey(401, mockResponse, false)
  const server = await helpers.getServer(cfg, false)

  apiKey.init(server, Object.assign({
    apiKey: defaults
  }, cfg))

  const res = await server.inject({
    url: '/proxy',
    headers: {
      authorization: 'Api-Key foobar'
    }
  })

  t.is(res.statusCode, 401)
  t.truthy(res.result.attributes.reason)
})

test('Replace api key with bearer token', async (t) => {
  helpers.mockApiKey(200, mockResponse, false)
  const server = await helpers.getServer(cfg, false)

  apiKey.init(server, Object.assign({
    apiKey: defaults
  }, cfg))

  const { result } = await server.inject({
    url: '/proxy',
    headers: {
      authorization: 'Api-Key foobar'
    }
  })

  t.is(result.headers.authorization, 'Bearer barfoo')
  t.is(Object.keys(result.query).length, 0)
})
