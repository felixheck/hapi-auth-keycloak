const test = require('ava')
const nock = require('nock')
const cache = require('../src/cache')
const { mock, getServer, registerPlugin } = require('./_helpers')
const fixtures = require('./_fixtures')

test.afterEach('reset instances and prototypes', () => {
  cache.reset()
  nock.cleanAll()
})

test.cb.serial('throw error if plugin gets registered twice', (t) => {
  getServer(undefined, (server) => {
    t.throws(() => registerPlugin(server), Error)
    t.end()
  })
})

test.cb.serial('authentication does succeed', (t) => {
  mock(200, fixtures.content.userData)

  getServer(undefined, (server) => {
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
  mock(200, fixtures.content.userData)

  const mockReq = {
    method: 'GET',
    url: '/',
    headers: {
      authorization: `bearer ${fixtures.jwt.userData}`
    }
  }

  getServer({
    client: fixtures.clientConfig,
    cache: {}
  }, (server) => {
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
  mock(200, fixtures.content.userData)

  getServer(undefined, (server) => {
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
  mock(200, fixtures.content.userData)

  getServer(undefined, (server) => {
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
  mock(200, { active: false })

  getServer(undefined, (server) => {
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
  getServer(undefined, (server) => {
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
  mock(200, fixtures.content.userData)

  getServer(undefined, (server) => {
    server.kjwt.validate(`bearer ${fixtures.jwt.userData}`, (err, res) => {
      t.falsy(err)
      t.truthy(res)
      t.truthy(res.credentials)
      t.end()
    })
  })
})

test.cb.serial('server method invalidates token – validation error', (t) => {
  mock(400, 'an error', true)

  getServer(undefined, (server) => {
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
  mock(200, { active: false })

  getServer(undefined, (server) => {
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
  getServer(undefined, (server) => {
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
