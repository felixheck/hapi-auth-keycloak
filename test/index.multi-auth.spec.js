const nock = require('nock')
const test = require('ava')
const helpers = require('./_helpers')
const fixtures = require('./fixtures')

const cfg = helpers.getStrategyOptions({ entitlement: true })

test.afterEach.always('reset instances and prototypes', () => {
  nock.cleanAll()
})

test('authentication does succeed – first succeeds, second fails', async (t) => {
  const mockReq = helpers.mockRequest(`bearer ${fixtures.composeJwt('rpt')}`, '/multi')

  helpers.mockEntitlement(200, fixtures.content.rpt)
  helpers.mockEntitlement(400, fixtures.content.rpt, true)

  const server = await helpers.getServer(cfg)
  const res = await server.inject(mockReq)

  t.truthy(res)
  t.is(res.statusCode, 200)
})

test('authentication does succeed – first succeeds, second errors', async (t) => {
  const mockReq = helpers.mockRequest(`bearer ${fixtures.composeJwt('rpt')}`, '/multi')

  helpers.mockEntitlement(200, fixtures.content.rpt)
  helpers.mockEntitlement(200, fixtures.content.rpt, true)

  const server = await helpers.getServer(cfg)
  const res = await server.inject(mockReq)

  t.truthy(res)
  t.is(res.statusCode, 200)
})

test('authentication does fail – first fails, second succeeds', async (t) => {
  const mockReq = helpers.mockRequest(`bearer ${fixtures.composeJwt('rpt')}`, '/multi')

  helpers.mockEntitlement(400, fixtures.content.rpt, true)
  helpers.mockEntitlement(200, fixtures.content.rpt)

  const server = await helpers.getServer(cfg)
  const res = await server.inject(mockReq)

  t.truthy(res)
  t.is(res.statusCode, 401)
})

test('authentication does fail – first errors, second succeeds', async (t) => {
  const mockReq = helpers.mockRequest(`bearer ${fixtures.composeJwt('rpt')}`, '/multi')

  helpers.mockEntitlement(200, fixtures.content.rpt, true)
  helpers.mockEntitlement(200, fixtures.content.rpt)

  const server = await helpers.getServer(cfg)
  const res = await server.inject(mockReq)

  t.truthy(res)
  t.is(res.statusCode, 401)
})

test('authentication does fail – both errors', async (t) => {
  const mockReq = helpers.mockRequest(`bearer ${fixtures.composeJwt('rpt')}`, '/multi')

  helpers.mockEntitlement(200, fixtures.content.rpt, true)
  helpers.mockEntitlement(200, fixtures.content.rpt, true)

  const server = await helpers.getServer(cfg)
  const res = await server.inject(mockReq)

  t.truthy(res)
  t.is(res.statusCode, 401)
})

test('authentication does fail – both fails', async (t) => {
  const mockReq = helpers.mockRequest(`bearer ${fixtures.composeJwt('rpt')}`, '/multi')

  helpers.mockEntitlement(400, fixtures.content.rpt, true)
  helpers.mockEntitlement(400, fixtures.content.rpt, true)

  const server = await helpers.getServer(cfg)
  const res = await server.inject(mockReq)

  t.truthy(res)
  t.is(res.statusCode, 401)
})
