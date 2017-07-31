const test = require('ava')
const cache = require('../src/cache')
const helpers = require('./_helpers')
const fixtures = require('./_fixtures')

const { prototypes } = helpers

test.beforeEach(() => {
  prototypes.clone()
})

test.afterEach('reset instances and prototypes', () => {
  cache.reset()
  prototypes.reset()
})

test.cb.serial('throw error if plugin gets registered twice', (t) => {
  helpers.getServer(undefined, (server) => {
    t.throws(() => helpers.registerPlugin(server), Error)
    t.end()
  })
})

test.cb.serial('authentication does succeed', (t) => {
  prototypes.stub('validateAccessToken', fixtures.validation)
  prototypes.stub('userInfo', fixtures.userInfo)

  helpers.getServer(undefined, (server) => {
    server.inject({
      method: 'GET',
      url: '/',
      headers: {
        authorization: `bearer ${fixtures.jwt.content}`
      }
    }, (res) => {
      t.truthy(res)
      t.is(res.statusCode, 200)
      t.end()
    })
  })
})

test.cb.serial('authentication does succeed – cached', (t) => {
  prototypes.stub('validateAccessToken', fixtures.validation)
  prototypes.stub('userInfo', fixtures.userInfo)

  const mockReq = {
    method: 'GET',
    url: '/',
    headers: {
      authorization: `bearer ${fixtures.jwt.content}`
    }
  }

  helpers.getServer({
    client: fixtures.config,
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
  prototypes.stub('validateAccessToken', fixtures.validation)
  prototypes.stub('userInfo', fixtures.userInfo)

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
  prototypes.stub('validateAccessToken', fixtures.validation)
  prototypes.stub('userInfo', fixtures.userInfo)

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
  prototypes.stub('validateAccessToken', false)

  helpers.getServer(undefined, (server) => {
    server.inject({
      method: 'GET',
      url: '/',
      headers: {
        authorization: `bearer ${fixtures.jwt.content}`
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
        authorization: fixtures.token
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
  prototypes.stub('validateAccessToken', fixtures.validation)
  prototypes.stub('userInfo', fixtures.userInfo)

  helpers.getServer(undefined, (server) => {
    server.kjwt.validate(`bearer ${fixtures.jwt.content}`, (err, res) => {
      t.falsy(err)
      t.truthy(res)
      t.truthy(res.credentials)
      t.end()
    })
  })
})

test.cb.serial('server method invalidates token – userinfo error', (t) => {
  prototypes.stub('validateAccessToken', fixtures.validation)
  prototypes.stub('userInfo', new Error('an error'), 'reject')

  helpers.getServer(undefined, (server) => {
    server.kjwt.validate(`bearer ${fixtures.jwt.content}`, (err, res) => {
      t.falsy(res)
      t.truthy(err)
      t.truthy(err.isBoom)
      t.is(err.output.statusCode, 401)
      t.is(err.output.headers['WWW-Authenticate'], 'Bearer error="Error: an error"')
      t.end()
    })
  })
})

test.cb.serial('server method invalidates token – validation error', (t) => {
  prototypes.stub('validateAccessToken', new Error('an error'), 'reject')

  helpers.getServer(undefined, (server) => {
    server.kjwt.validate(`bearer ${fixtures.jwt.content}`, (err, res) => {
      t.falsy(res)
      t.truthy(err)
      t.truthy(err.isBoom)
      t.is(err.output.statusCode, 401)
      t.is(err.output.headers['WWW-Authenticate'], 'Bearer error="Error: an error"')
      t.end()
    })
  })
})

test.cb.serial('server method invalidates token – invalid', (t) => {
  prototypes.stub('validateAccessToken', false)

  helpers.getServer(undefined, (server) => {
    server.kjwt.validate(`bearer ${fixtures.jwt.content}`, (err, res) => {
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
    server.kjwt.validate(fixtures.jwt.content, (err, res) => {
      t.falsy(res)
      t.truthy(err)
      t.truthy(err.isBoom)
      t.is(err.output.statusCode, 401)
      t.is(err.output.headers['WWW-Authenticate'], 'Bearer error="Missing or invalid authorization header"')
      t.end()
    })
  })
})
