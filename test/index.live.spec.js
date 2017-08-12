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

test.cb.serial('authentication does succeed', (t) => {
  helpers.mockIntrospect(200, fixtures.content.current)

  const mockReq = {
    method: 'GET',
    url: '/',
    headers: {
      authorization: `bearer ${fixtures.jwt.current()}`
    }
  }

  helpers.getServer(cfg, (server) => {
    server.inject(mockReq, (res) => {
      t.truthy(res)
      t.is(res.statusCode, 200)
      t.end()
    })
  })
})

test.cb.serial('authentication does succeed – cached', (t) => {
  helpers.mockIntrospect(200, fixtures.content.current)

  const mockReq = {
    method: 'GET',
    url: '/',
    headers: {
      authorization: `bearer ${fixtures.jwt.current()}`
    }
  }

  helpers.getServer(Object.assign({ cache: true }, cfg), (server) => {
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
  helpers.mockIntrospect(200, fixtures.content.current)

  const mockReq = {
    method: 'GET',
    url: '/role',
    headers: {
      authorization: `bearer ${fixtures.jwt.current()}`
    }
  }

  helpers.getServer(cfg, (server) => {
    server.inject(mockReq, (res) => {
      t.truthy(res)
      t.is(res.statusCode, 200)
      t.end()
    })
  })
})

test.cb.serial('authentication does fail – invalid roles', (t) => {
  helpers.mockIntrospect(200, fixtures.content.current)

  const mockReq = {
    method: 'GET',
    url: '/role/guest',
    headers: {
      authorization: `bearer ${fixtures.jwt.current()}`
    }
  }

  helpers.getServer(cfg, (server) => {
    server.inject(mockReq, (res) => {
      t.truthy(res)
      t.is(res.statusCode, 403)
      t.end()
    })
  })
})

test.cb.serial('authentication does fail – invalid token', (t) => {
  helpers.mockIntrospect(200, { active: false })

  const mockReq = {
    method: 'GET',
    url: '/',
    headers: {
      authorization: `bearer ${fixtures.jwt.current()}`
    }
  }

  helpers.getServer(cfg, (server) => {
    server.inject(mockReq, (res) => {
      t.truthy(res)
      t.is(res.statusCode, 401)
      t.is(res.headers['www-authenticate'], 'Bearer error="Invalid credentials"')
      t.end()
    })
  })
})

test.cb.serial('authentication does fail – invalid header', (t) => {
  const mockReq = {
    method: 'GET',
    url: '/',
    headers: {
      authorization: fixtures.common.token
    }
  }

  helpers.getServer(cfg, (server) => {
    server.inject(mockReq, (res) => {
      t.truthy(res)
      t.is(res.statusCode, 401)
      t.is(res.headers['www-authenticate'], 'Bearer error="Missing or invalid authorization header"')
      t.end()
    })
  })
})
