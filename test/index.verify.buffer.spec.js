const test = require('ava')
const helpers = require('./_helpers')
const fixtures = require('./fixtures')

const cfg = helpers.getOptions({ publicKey: fixtures.common.publicKeyBuffer })

test('authentication does succeed', async (t) => {
  const mockReq = helpers.mockRequest(`bearer ${fixtures.composeJwt('current')}`)
  const server = await helpers.getServer(cfg)
  const res = await server.inject(mockReq)

  t.truthy(res)
  t.is(res.statusCode, 200)
})

test('authentication does succeed – cached', async (t) => {
  const mockReq = helpers.mockRequest(`bearer ${fixtures.composeJwt('current')}`)
  const server = await helpers.getServer(Object.assign({ cache: true }, cfg))
  await server.inject(mockReq)
  const res = await server.inject(mockReq)

  t.truthy(res)
  t.is(res.statusCode, 200)
})

test('authentication does success – valid roles', async (t) => {
  const mockReq = helpers.mockRequest(`bearer ${fixtures.composeJwt('current')}`, '/role')
  const server = await helpers.getServer(cfg)
  const res = await server.inject(mockReq)

  t.truthy(res)
  t.is(res.statusCode, 200)
})

test('authentication does fail – invalid roles', async (t) => {
  const mockReq = helpers.mockRequest(`bearer ${fixtures.composeJwt('current')}`, '/role/guest')
  const server = await helpers.getServer(cfg)
  const res = await server.inject(mockReq)

  t.truthy(res)
  t.is(res.statusCode, 403)
})

test('authentication does fail – expired token', async (t) => {
  const mockReq = helpers.mockRequest(`bearer ${fixtures.composeJwt('expired')}`)

  const server = await helpers.getServer(cfg)
  const res = await server.inject(mockReq)

  t.truthy(res)
  t.is(res.statusCode, 401)
  t.is(res.headers['www-authenticate'], 'Bearer strategy="keycloak-jwt", reason="invalid token (expired)", error="Invalid credentials"')
})

test('authentication does fail – invalid header', async (t) => {
  const mockReq = helpers.mockRequest(fixtures.common.token)
  const server = await helpers.getServer(cfg)
  const res = await server.inject(mockReq)

  t.truthy(res)
  t.is(res.statusCode, 401)
  t.is(res.headers['www-authenticate'], 'Bearer strategy="keycloak-jwt", error="Invalid credentials"')
})
