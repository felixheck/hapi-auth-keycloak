const test = require('ava')
const nock = require('nock')
const cache = require('../src/cache')
const helpers = require('./_helpers')
const fixtures = require('./_fixtures')

test.afterEach('reset instances and prototypes', () => {
  cache.reset()
  nock.cleanAll()
})

test.cb.serial('throw error if plugin gets registered twice', (t) => {
  helpers.getServer(undefined, (server) => {
    t.throws(() => helpers.registerPlugin(server), Error)
    t.end()
  })
})

test.cb.serial('authentication does succeed', (t) => {
  helpers.mock(200, fixtures.content.userData)

  helpers.getServer(undefined, (server) => {
    server.inject({
      method: 'GET',
      url: '/',
      headers: {
        authorization: `bearer ${fixtures.jwt.userData}`
      }
    }, (res) => {
      t.truthy(res)
      t.is(res.statusCode, 200)
      t.end()
    })
  })
})

test.cb.serial('authentication does succeed – cached', (t) => {
  helpers.mock(200, fixtures.content.userData)

  const mockReq = {
    method: 'GET',
    url: '/',
    headers: {
      authorization: `bearer ${fixtures.jwt.userData}`
    }
  }

  helpers.getServer(helpers.getOptions({
    cache: true
  }), (server) => {
    server.inject(mockReq, () => {
      server.inject(mockReq, (res) => {
        t.truthy(res)
        t.is(res.statusCode, 200)
        t.end()
      })
    })
  })
})

test.cb.serial('authentication does success – valid roles', (t) => {
  helpers.mock(200, fixtures.content.userData)

  helpers.getServer(undefined, (server) => {
    server.inject({
      method: 'GET',
      url: '/role',
      headers: {
        authorization: `bearer ${fixtures.jwt.userData}`
      }
    }, (res) => {
      t.truthy(res)
      t.is(res.statusCode, 200)
      t.end()
    })
  })
})

test.cb.serial('authentication does fail – invalid roles', (t) => {
  helpers.mock(200, fixtures.content.userData)

  helpers.getServer(undefined, (server) => {
    server.inject({
      method: 'GET',
      url: '/role/guest',
      headers: {
        authorization: `bearer ${fixtures.jwt.userData}`
      }
    }, (res) => {
      t.truthy(res)
      t.is(res.statusCode, 403)
      t.end()
    })
  })
})

test.cb.serial('authentication does fail – invalid token', (t) => {
  helpers.mock(200, { active: false })

  helpers.getServer(undefined, (server) => {
    server.inject({
      method: 'GET',
      url: '/',
      headers: {
        authorization: `bearer ${fixtures.jwt.userData}`
      }
    }, (res) => {
      t.truthy(res)
      t.is(res.statusCode, 401)
      t.is(res.headers['www-authenticate'], 'Bearer error="Invalid credentials"')
      t.end()
    })
  })
})

test.cb.serial('authentication does fail – invalid header', (t) => {
  helpers.getServer(undefined, (server) => {
    server.inject({
      method: 'GET',
      url: '/',
      headers: {
        authorization: fixtures.common.token
      }
    }, (res) => {
      t.truthy(res)
      t.is(res.statusCode, 401)
      t.is(res.headers['www-authenticate'], 'Bearer error="Missing or invalid authorization header"')
      t.end()
    })
  })
})

test.cb.serial('server method validates token', (t) => {
  helpers.mock(200, fixtures.content.userData)

  helpers.getServer(undefined, (server) => {
    server.kjwt.validate(`bearer ${fixtures.jwt.userData}`, (err, res) => {
      t.falsy(err)
      t.truthy(res)
      t.truthy(res.credentials)
      t.end()
    })
  })
})

test.cb.serial('server method invalidates token – validation error', (t) => {
  helpers.mock(400, 'an error', true)

  helpers.getServer(undefined, (server) => {
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

test.cb.serial('server method invalidates token – invalid', (t) => {
  helpers.mock(200, { active: false })

  helpers.getServer(undefined, (server) => {
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

test.cb.serial('server method invalidates token – wrong format', (t) => {
  helpers.getServer(undefined, (server) => {
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
