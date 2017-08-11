const nock = require('nock')
const test = require('ava')
const helpers = require('./_helpers')
const fixtures = require('./fixtures')

test.afterEach.always('reset instances and prototypes', () => {
  nock.cleanAll()
})

test.cb.serial('authentication does succeed', (t) => {
  helpers.mockIntrospect(200, fixtures.content.userData)
  helpers.mockEntitlement(200, fixtures.content.userDataRpt)

  helpers.getServer(helpers.getOptions({
    addScopes: true
  }), (server) => {
    server.inject({
      method: 'GET',
      url: '/',
      headers: {
        authorization: `bearer ${fixtures.jwt.userDataRpt}`
      }
    }, (res) => {
      t.truthy(res)
      t.is(res.statusCode, 200)
      t.deepEqual(JSON.parse(res.payload).sort(), ['editor', 'other-app:creator', 'realm:admin', 'scope:foo.READ', 'scope:foo.WRITE'])
      t.end()
    })
  })
})

test.cb.serial('authentication does succeed – RPT request error', (t) => {
  helpers.mockIntrospect(200, fixtures.content.userData)
  helpers.mockEntitlement(400, fixtures.content.userDataRpt)

  helpers.getServer(helpers.getOptions({
    addScopes: true
  }), (server) => {
    server.inject({
      method: 'GET',
      url: '/',
      headers: {
        authorization: `bearer ${fixtures.jwt.userDataRpt}`
      }
    }, (res) => {
      t.truthy(res)
      t.is(res.statusCode, 200)
      t.deepEqual(JSON.parse(res.payload).sort(), ['editor', 'other-app:creator', 'realm:admin', 'scope:foo.READ', 'scope:foo.WRITE'])
      t.end()
    })
  })
})

test.cb.serial('authentication does succeed – cached', (t) => {
  helpers.mockIntrospect(200, fixtures.content.userData)
  helpers.mockEntitlement(200, fixtures.content.userDataRpt)

  const mockReq = {
    method: 'GET',
    url: '/',
    headers: {
      authorization: `bearer ${fixtures.jwt.userDataRpt}`
    }
  }

  helpers.getServer(helpers.getOptions({
    cache: true,
    addScopes: true
  }), (server) => {
    server.inject(mockReq, () => {
      server.inject(mockReq, (res) => {
        t.truthy(res)
        t.is(res.statusCode, 200)
        t.deepEqual(JSON.parse(res.payload).sort(), ['editor', 'other-app:creator', 'realm:admin', 'scope:foo.READ', 'scope:foo.WRITE'])
        t.end()
      })
    })
  })
})

test.cb.serial('authentication does success – valid roles', (t) => {
  helpers.mockIntrospect(200, fixtures.content.userData)
  helpers.mockEntitlement(200, fixtures.content.userDataRpt)

  helpers.getServer(helpers.getOptions({
    addScopes: true
  }), (server) => {
    server.inject({
      method: 'GET',
      url: '/role',
      headers: {
        authorization: `bearer ${fixtures.jwt.userDataRpt}`
      }
    }, (res) => {
      t.truthy(res)
      t.is(res.statusCode, 200)
      t.deepEqual(JSON.parse(res.payload).sort(), ['editor', 'other-app:creator', 'realm:admin', 'scope:foo.READ', 'scope:foo.WRITE'])
      t.end()
    })
  })
})

test.cb.serial('authentication does success – valid roles', (t) => {
  helpers.mockIntrospect(200, fixtures.content.userData)
  helpers.mockEntitlement(200, fixtures.content.userDataRpt)

  helpers.getServer(helpers.getOptions({
    addScopes: true
  }), (server) => {
    server.inject({
      method: 'GET',
      url: '/role/rpt',
      headers: {
        authorization: `bearer ${fixtures.jwt.userDataRpt}`
      }
    }, (res) => {
      t.truthy(res)
      t.is(res.statusCode, 200)
      t.deepEqual(JSON.parse(res.payload).sort(), ['editor', 'other-app:creator', 'realm:admin', 'scope:foo.READ', 'scope:foo.WRITE'])
      t.end()
    })
  })
})

test.cb.serial('authentication does fail – invalid roles', (t) => {
  helpers.mockIntrospect(200, fixtures.content.userData)
  helpers.mockEntitlement(200, fixtures.content.userDataRpt)

  helpers.getServer(helpers.getOptions({
    addScopes: true
  }), (server) => {
    server.inject({
      method: 'GET',
      url: '/role/guest',
      headers: {
        authorization: `bearer ${fixtures.jwt.userDataRpt}`
      }
    }, (res) => {
      t.truthy(res)
      t.is(res.statusCode, 403)
      t.end()
    })
  })
})

test.cb.serial('authentication does fail – valid roles but RPT request error', (t) => {
  helpers.mockIntrospect(200, fixtures.content.userData)
  helpers.mockEntitlement(400, fixtures.content.userDataRpt)

  helpers.getServer(helpers.getOptions({
    addScopes: true
  }), (server) => {
    server.inject({
      method: 'GET',
      url: '/role/rpt',
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
  helpers.mockIntrospect(200, { active: false })
  helpers.mockEntitlement(200, fixtures.content.userDataRpt)

  helpers.getServer(helpers.getOptions({
    addScopes: true
  }), (server) => {
    server.inject({
      method: 'GET',
      url: '/',
      headers: {
        authorization: `bearer ${fixtures.jwt.userDataRpt}`
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
  helpers.getServer(helpers.getOptions({
    addScopes: true
  }), (server) => {
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
