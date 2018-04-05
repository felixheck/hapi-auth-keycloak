const nock = require('nock')
const test = require('ava')
const helpers = require('./_helpers')
const fixtures = require('./fixtures')

const cfg = helpers.getOptions({ secret: fixtures.common.secret })

test.afterEach.always('reset instances and prototypes', () => {
  nock.cleanAll()
})

test('server method – authentication supports mode: "optional" - will succeed without auth', async (t) => {
  const server = await helpers.getServer(cfg)

  const res = await server.inject({
    method: 'GET',
    url: '/mode-optional',
  })

  t.truthy(res)
  t.is(res.statusCode, 200)
})

test('server method – authentication supports mode: "optional" - will fail with invalid auth', async (t) => {
  const server = await helpers.getServer(cfg)

  const res = await server.inject({
    method: 'GET',
    url: '/mode-optional',
    headers: {
      authorization: `bearer invalid-token`
    }
  })

  t.truthy(res)
  t.is(res.statusCode, 401)
  t.is(err.output.headers['WWW-Authenticate'], 'Bearer strategy="keycloak-jwt", error="Invalid credentials"')
})

test('server method – authentication supports mode: "try" - will succeed with invalid auth', async (t) => {
  const server = await helpers.getServer(cfg)

  const res = await server.inject({
    method: 'GET',
    url: '/mode-try',
    headers: {
      authorization: `bearer ${fixtures.composeJwt('expired')}`
    }
  })

  t.truthy(res)
  t.is(res.statusCode, 200)
})
