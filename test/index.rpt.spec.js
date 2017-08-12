const nock = require('nock')
const test = require('ava')
const helpers = require('./_helpers')
const fixtures = require('./fixtures')

const targetScope = ['editor', 'other-app:creator', 'realm:admin', 'scope:foo.READ', 'scope:foo.WRITE']
const cfg = helpers.getOptions({
  live: true
})

test.afterEach.always('reset instances and prototypes', () => {
  nock.cleanAll()
})

test.cb.serial('authentication does succeed', (t) => {
  helpers.mockEntitlement(200, fixtures.content.rpt)

  const mockReq = {
    method: 'GET',
    url: '/',
    headers: {
      authorization: `bearer ${fixtures.jwt.rpt}`
    }
  }

  helpers.getServer(cfg, (server) => {
    server.inject(mockReq, (res) => {
      t.truthy(res)
      t.is(res.statusCode, 200)
      t.deepEqual(JSON.parse(res.payload).sort(), targetScope)
      t.end()
    })
  })
})

test.cb.serial('authentication does succeed – cached', (t) => {
  helpers.mockEntitlement(200, fixtures.content.rpt)

  const mockReq = {
    method: 'GET',
    url: '/',
    headers: {
      authorization: `bearer ${fixtures.jwt.rpt}`
    }
  }

  helpers.getServer(Object.assign({ cache: true }, cfg), (server) => {
    server.inject(mockReq, () => {
      server.inject(mockReq, (res) => {
        t.truthy(res)
        t.is(res.statusCode, 200)
        t.deepEqual(JSON.parse(res.payload).sort(), targetScope)
        t.end()
      })
    })
  })
})

test.cb.serial('authentication does success – valid roles', (t) => {
  helpers.mockEntitlement(200, fixtures.content.rpt)

  const mockReq = {
    method: 'GET',
    url: '/role',
    headers: {
      authorization: `bearer ${fixtures.jwt.rpt}`
    }
  }

  helpers.getServer(cfg, (server) => {
    server.inject(mockReq, (res) => {
      t.truthy(res)
      t.is(res.statusCode, 200)
      t.deepEqual(JSON.parse(res.payload).sort(), targetScope)
      t.end()
    })
  })
})

test.cb.serial('authentication does success – valid roles', (t) => {
  helpers.mockEntitlement(200, fixtures.content.rpt)

  const mockReq = {
    method: 'GET',
    url: '/role/rpt',
    headers: {
      authorization: `bearer ${fixtures.jwt.rpt}`
    }
  }

  helpers.getServer(cfg, (server) => {
    server.inject(mockReq, (res) => {
      t.truthy(res)
      t.is(res.statusCode, 200)
      t.deepEqual(JSON.parse(res.payload).sort(), targetScope)
      t.end()
    })
  })
})

test.cb.serial('authentication does fail – invalid roles', (t) => {
  helpers.mockEntitlement(200, fixtures.content.rpt)

  const mockReq = {
    method: 'GET',
    url: '/role/guest',
    headers: {
      authorization: `bearer ${fixtures.jwt.rpt}`
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
  helpers.mockEntitlement(400, fixtures.content.rpt)

  const mockReq = {
    method: 'GET',
    url: '/',
    headers: {
      authorization: `bearer ${fixtures.jwt.rpt}`
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
