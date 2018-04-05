const nock = require('nock')
const test = require('ava')
const helpers = require('./_helpers')
const fixtures = require('./fixtures')

const cfg = helpers.getOptions({ entitlement: true })
const targetScope = [...fixtures.targetScope, 'scope:foo.READ', 'scope:foo.WRITE']

test.afterEach.always('reset instances and prototypes', () => {
  nock.cleanAll()
})

test('authentication does succeed', async (t) => {
  const mockReq = helpers.mockRequest(`bearer ${fixtures.composeJwt('rpt')}`)

  helpers.mockEntitlement(200, fixtures.content.rpt)

  const server = await helpers.getServer(cfg)
  const res = await server.inject(mockReq)

  t.truthy(res)
  t.is(res.statusCode, 200)
  t.deepEqual(JSON.parse(res.payload).sort(), targetScope)
})

test('authentication does succeed – cached', async (t) => {
  const mockReq = helpers.mockRequest(`bearer ${fixtures.composeJwt('rpt')}`)

  helpers.mockEntitlement(200, fixtures.content.rpt)

  const server = await helpers.getServer(Object.assign({ cache: true }, cfg))
  const res = await server.inject(mockReq)

  t.truthy(res)
  t.is(res.statusCode, 200)
  t.deepEqual(JSON.parse(res.payload).sort(), targetScope)
})

test('authentication does success – valid roles', async (t) => {
  const mockReq = helpers.mockRequest(`bearer ${fixtures.composeJwt('rpt')}`, '/role')

  helpers.mockEntitlement(200, fixtures.content.rpt)

  const server = await helpers.getServer(cfg)
  const res = await server.inject(mockReq)

  t.truthy(res)
  t.is(res.statusCode, 200)
  t.deepEqual(JSON.parse(res.payload).sort(), targetScope)
})

test('authentication does success – valid roles', async (t) => {
  const mockReq = helpers.mockRequest(`bearer ${fixtures.composeJwt('rpt')}`, '/role/rpt')

  helpers.mockEntitlement(200, fixtures.content.rpt)

  const server = await helpers.getServer(cfg)
  const res = await server.inject(mockReq)

  t.truthy(res)
  t.is(res.statusCode, 200)
  t.deepEqual(JSON.parse(res.payload).sort(), targetScope)
})

test('authentication does fail – invalid roles', async (t) => {
  const mockReq = helpers.mockRequest(`bearer ${fixtures.composeJwt('rpt')}`, '/role/guest')

  helpers.mockEntitlement(200, fixtures.content.rpt)

  const server = await helpers.getServer(cfg)
  const res = await server.inject(mockReq)

  t.truthy(res)
  t.is(res.statusCode, 403)
})

test('authentication does fail – invalid token', async (t) => {
  const mockReq = helpers.mockRequest(`bearer ${fixtures.composeJwt('rpt')}`)

  helpers.mockEntitlement(400, fixtures.content.rpt)

  const server = await helpers.getServer(cfg)
  const res = await server.inject(mockReq)

  t.truthy(res)
  t.is(res.statusCode, 401)
  t.is(res.headers['www-authenticate'], 'Bearer strategy="keycloak-jwt", reason="Retrieving the RPT failed", error="Invalid credentials"')
})

test('authentication does fail – invalid header', async (t) => {
  const mockReq = helpers.mockRequest(fixtures.common.token)

  const server = await helpers.getServer(cfg)
  const res = await server.inject(mockReq)

  t.truthy(res)
  t.is(res.statusCode, 401)
  t.is(res.headers['www-authenticate'], 'Bearer strategy="keycloak-jwt", error="Invalid credentials"')
})
