const test = require('ava')
const helpers = require('./_helpers')
const fixtures = require('./fixtures')

const cfg = helpers.getOptions({
  publicKey: fixtures.common.publicKeyRsa
})

test.cb.serial('authentication does succeed', (t) => {
  const mockReq = {
    method: 'GET',
    url: '/',
    headers: {
      authorization: `bearer ${fixtures.jwt.userDataPublicKey()}`
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
  const mockReq = {
    method: 'GET',
    url: '/',
    headers: {
      authorization: `bearer ${fixtures.jwt.userDataPublicKey()}`
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
  const mockReq = {
    method: 'GET',
    url: '/role',
    headers: {
      authorization: `bearer ${fixtures.jwt.userDataPublicKey()}`
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
  const mockReq = {
    method: 'GET',
    url: '/role/guest',
    headers: {
      authorization: `bearer ${fixtures.jwt.userDataPublicKey()}`
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

test.cb.serial('authentication does fail – expired token', (t) => {
  const mockReq = {
    method: 'GET',
    url: '/',
    headers: {
      authorization: `bearer ${fixtures.jwt.userDataPublicKeyExp}`
    }
  }

  helpers.getServer(cfg, (server) => {
    server.inject(mockReq, (res) => {
      t.truthy(res)
      t.is(res.statusCode, 401)
      t.is(res.headers['www-authenticate'], 'Bearer error="invalid token (expired)"')
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
