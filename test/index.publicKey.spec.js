const test = require('ava')
const helpers = require('./_helpers')
const fixtures = require('./fixtures')
const cache = require('../src/cache')

test.afterEach.always('reset instances and prototypes', () => {
  cache.reset()
})

const publicKeyConfig = {
  realmUrl: fixtures.common.realmUrl,
  clientId: fixtures.common.clientId,
  publicKey: fixtures.common.publicKeyRsa
}

test.cb.serial('authentication does succeed', (t) => {
  helpers.getServer(publicKeyConfig, (server) => {
    server.inject({
      method: 'GET',
      url: '/',
      headers: {
        authorization: `bearer ${fixtures.jwt.userDataPublicKey()}`
      }
    }, (res) => {
      t.truthy(res)
      t.is(res.statusCode, 200)
      t.end()
    })
  })
})

test.cb.serial('authentication does succeed – cached', (t) => {
  const mockReq = {
    method: 'GET',
    url: '/',
    headers: {
      authorization: `bearer ${fixtures.jwt.userDataPublicKey()}`
    }
  }

  helpers.getServer(Object.assign({
    cache: true
  }, publicKeyConfig), (server) => {
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
  helpers.getServer(publicKeyConfig, (server) => {
    server.inject({
      method: 'GET',
      url: '/role',
      headers: {
        authorization: `bearer ${fixtures.jwt.userDataPublicKey()}`
      }
    }, (res) => {
      t.truthy(res)
      t.is(res.statusCode, 200)
      t.end()
    })
  })
})

test.cb.serial('authentication does fail – invalid roles', (t) => {
  helpers.getServer(publicKeyConfig, (server) => {
    server.inject({
      method: 'GET',
      url: '/role/guest',
      headers: {
        authorization: `bearer ${fixtures.jwt.userDataPublicKey()}`
      }
    }, (res) => {
      t.truthy(res)
      t.is(res.statusCode, 403)
      t.end()
    })
  })
})

test.cb.serial('authentication does fail – expired token', (t) => {
  helpers.getServer(publicKeyConfig, (server) => {
    server.inject({
      method: 'GET',
      url: '/',
      headers: {
        authorization: `bearer ${fixtures.jwt.userDataPublicKeyExp}`
      }
    }, (res) => {
      t.truthy(res)
      t.is(res.statusCode, 401)
      t.is(res.headers['www-authenticate'], 'Bearer error="invalid token (expired)"')
      t.end()
    })
  })
})

test.cb.serial('authentication does fail – invalid header', (t) => {
  helpers.getServer(publicKeyConfig, (server) => {
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
