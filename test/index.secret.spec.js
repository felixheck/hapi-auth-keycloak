const nock = require('nock')
const test = require('ava')
const helpers = require('./_helpers')
const fixtures = require('./fixtures')

test.afterEach.always('reset instances and prototypes', () => {
  nock.cleanAll()
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
