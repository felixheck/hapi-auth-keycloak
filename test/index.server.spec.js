const nock = require('nock')
const test = require('ava')
const helpers = require('./_helpers')
const fixtures = require('./fixtures')

const cfg = helpers.getStrategyOptions({ secret: fixtures.common.secret })

test.afterEach.always('reset instances and prototypes', () => {
  nock.cleanAll()
})

test('server method – throw error because of missing name', async (t) => {
  helpers.mockIntrospect(200, fixtures.content.current)

  const server = await helpers.getServer(cfg)
  await t.throwsAsync(server.kjwt.validate(`bearer ${fixtures.composeJwt('current')}`))
})

test('server method – authentication does succeed', async (t) => {
  helpers.mockIntrospect(200, fixtures.content.current)

  const server = await helpers.getServer(cfg)
  const res = await server.kjwt.validate(`bearer ${fixtures.composeJwt('current')}`, 'BizApps')

  t.truthy(res)
  t.truthy(res.credentials)
})

test('server method – authentication does succeed – cache', async (t) => {
  helpers.mockIntrospect(200, fixtures.content.current)
  helpers.mockIntrospect(200, fixtures.content.current)

  const mockTkn = `bearer ${fixtures.composeJwt('current')}`

  const server = await helpers.getServer(cfg)
  await server.kjwt.validate(mockTkn, 'BizApps')
  const res = await server.kjwt.validate(mockTkn, 'BizApps')

  t.truthy(res)
  t.truthy(res.credentials)
})

test('server method – authentication does fail – invalid token', async (t) => {
  helpers.mockIntrospect(200, { active: false })

  const server = await helpers.getServer(cfg)
  const err = await t.throwsAsync(server.kjwt.validate(`bearer ${fixtures.composeJwt('current')}`, 'BizApps'))

  t.truthy(err)
  t.truthy(err.isBoom)
  t.is(err.output.statusCode, 401)
  t.is(err.output.headers['WWW-Authenticate'], 'Bearer strategy="keycloak-jwt (BizApps)", error="Invalid credentials"')
})

test('server method – authentication does fail – invalid header', async (t) => {
  const server = await helpers.getServer(cfg)
  const err = await t.throwsAsync(server.kjwt.validate(fixtures.composeJwt('current'), 'BizApps'))

  t.truthy(err)
  t.truthy(err.isBoom)
  t.is(err.output.statusCode, 401)
  t.is(err.output.headers['WWW-Authenticate'], 'Bearer strategy="keycloak-jwt (BizApps)", error="Invalid credentials"')
})

test('server method – authentication does fail – error', async (t) => {
  helpers.mockIntrospect(400, 'an error', true)

  const server = await helpers.getServer(cfg)
  const err = await t.throwsAsync(server.kjwt.validate(`bearer ${fixtures.composeJwt('current')}`, 'BizApps'))

  t.truthy(err)
  t.truthy(err.isBoom)
  t.is(err.output.statusCode, 401)
  t.is(err.output.headers['WWW-Authenticate'], 'Bearer strategy="keycloak-jwt (BizApps)", error="Invalid credentials"')
})
