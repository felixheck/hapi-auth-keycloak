const nock = require('nock')
const test = require('ava')
const helpers = require('./_helpers')
const fixtures = require('./fixtures')

const cfg = helpers.getOptions({
  secret: fixtures.common.secret,
  live: true
})

test.afterEach.always('reset instances and prototypes', () => {
  nock.cleanAll()
})

test.cb.serial('server method – authentication does succeed', (t) => {
  helpers.mockIntrospect(200, fixtures.content.userData)

  helpers.getServer(cfg, (server) => {
    server.kjwt.validate(`bearer ${fixtures.jwt.userData}`, (err, res) => {
      t.falsy(err)
      t.truthy(res)
      t.truthy(res.credentials)
      t.end()
    })
  })
})

test.cb.serial('server method – authentication does succeed – cache', (t) => {
  helpers.mockIntrospect(200, fixtures.content.userData)
  helpers.mockIntrospect(200, fixtures.content.userData)

  helpers.getServer(cfg, (server) => {
    server.kjwt.validate(`bearer ${fixtures.jwt.userData}`, () => {
      server.kjwt.validate(`bearer ${fixtures.jwt.userData}`, (err, res) => {
        t.falsy(err)
        t.truthy(res)
        t.truthy(res.credentials)
        t.end()
      })
    })
  })
})

test.cb.serial('server method – authentication does fail – invalid token', (t) => {
  helpers.mockIntrospect(200, { active: false })

  helpers.getServer(cfg, (server) => {
    server.kjwt.validate(`bearer ${fixtures.jwt.userData}`, (err, res) => {
      t.falsy(res)
      t.truthy(err)
      t.truthy(err.isBoom)
      t.is(err.output.statusCode, 401)
      t.is(err.output.headers['WWW-Authenticate'], 'Bearer error="Invalid credentials"')
      t.end()
    })
  })
})

test.cb.serial('server method – authentication does fail – invalid header', (t) => {
  helpers.getServer(cfg, (server) => {
    server.kjwt.validate(fixtures.jwt.userData, (err, res) => {
      t.falsy(res)
      t.truthy(err)
      t.truthy(err.isBoom)
      t.is(err.output.statusCode, 401)
      t.is(err.output.headers['WWW-Authenticate'], 'Bearer error="Missing or invalid authorization header"')
      t.end()
    })
  })
})

test.cb.serial('server method – authentication does fail – error', (t) => {
  helpers.mockIntrospect(400, 'an error', true)

  helpers.getServer(cfg, (server) => {
    server.kjwt.validate(`bearer ${fixtures.jwt.userData}`, (err, res) => {
      t.falsy(res)
      t.truthy(err)
      t.truthy(err.isBoom)
      t.is(err.output.statusCode, 401)
      t.is(err.output.headers['WWW-Authenticate'], 'Bearer error="an error"')
      t.end()
    })
  })
})
