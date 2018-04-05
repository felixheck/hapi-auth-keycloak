const nock = require('nock')
const test = require('ava')
const helpers = require('./_helpers')
const fixtures = require('./fixtures')

const cfg = helpers.getOptions({ secret: fixtures.common.secret })

test.afterEach.always('reset instances and prototypes', () => {
  nock.cleanAll()
})

test('authentication does succeed', async (t) => {
  const mockReq = helpers.mockRequest(`bearer ${fixtures.composeJwt('current')}`)

  helpers.mockIntrospect(200, fixtures.content.current)

  const server = await helpers.getServer(cfg)
  const res = await server.inject(mockReq)
  t.truthy(res)
  t.is(res.statusCode, 200)
})

test('authentication does succeed – cached', async (t) => {
  const mockReq = helpers.mockRequest(`bearer ${fixtures.composeJwt('current')}`)

  helpers.mockIntrospect(200, fixtures.content.current)

  const server = await helpers.getServer(Object.assign({ cache: true }, cfg))
  const res = await server.inject(mockReq)

  t.truthy(res)
  t.is(res.statusCode, 200)
})

test('authentication does success – valid roles', async (t) => {
  const mockReq = helpers.mockRequest(`bearer ${fixtures.composeJwt('current')}`, '/role')

  helpers.mockIntrospect(200, fixtures.content.current)

  const server = await helpers.getServer(cfg)
  const res = await server.inject(mockReq)

  t.truthy(res)
  t.is(res.statusCode, 200)
})

test('authentication does fail – invalid roles', async (t) => {
  const mockReq = helpers.mockRequest(`bearer ${fixtures.composeJwt('current')}`, '/role/guest')

  helpers.mockIntrospect(200, fixtures.content.current)

  const server = await helpers.getServer(cfg)
  const res = await server.inject(mockReq)

  t.truthy(res)
  t.is(res.statusCode, 403)
})

test('authentication does fail – invalid token', async (t) => {
  const mockReq = helpers.mockRequest(`bearer ${fixtures.composeJwt('current')}`)

  helpers.mockIntrospect(200, { active: false })

  const server = await helpers.getServer(cfg)
  const res = await server.inject(mockReq)

  t.truthy(res)
  t.is(res.statusCode, 401)
  t.is(res.headers['www-authenticate'], 'Bearer strategy="keycloak-jwt", error="Invalid credentials"')
})

test('authentication does fail – invalid header', async (t) => {
  const mockReq = helpers.mockRequest(fixtures.common.token)

  const server = await helpers.getServer(cfg)
  const res = await server.inject(mockReq)

  t.truthy(res)
  t.is(res.statusCode, 401)
  t.is(res.headers['www-authenticate'], 'Bearer strategy="keycloak-jwt", error="Invalid credentials"')
})
