const test = require('ava')
const _ = require('lodash')
const { GrantManager } = require('keycloak-auth-utils')
const manager = require('../src/manager')
const cache = require('../src/cache')
const helpers = require('./_helpers')
const fixtures = require('./_fixtures')

const GrantManagerClone = {}

test.beforeEach(() => {
  GrantManagerClone.prototype = _.cloneDeep(GrantManager.prototype)
})

test.afterEach('reset instances and prototypes', () => {
  cache.reset()
  manager.reset()
  GrantManager.prototype = GrantManagerClone.prototype
})

test.cb.serial('throw error if plugin gets registered twice', (t) => {
  helpers.getServer(undefined, (server) => {
    t.throws(() => helpers.registerPlugin(server), Error)
    t.end()
  })
})

test.cb.serial('authentication does succeed', (t) => {
  GrantManager.prototype.validateAccessToken = function (tkn, cb) {
    cb(null, fixtures.validation)
  }

  GrantManager.prototype.userInfo = function (tkn, cb) {
    cb(null, fixtures.userInfo)
  }

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
  GrantManager.prototype.validateAccessToken = function (tkn, cb) {
    cb(null, fixtures.validation)
  }

  GrantManager.prototype.userInfo = function (tkn, cb) {
    cb(null, fixtures.userInfo)
  }

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

test.cb.serial('authentication does fail – invalid roles', (t) => {
  GrantManager.prototype.validateAccessToken = function (tkn, cb) {
    cb(null, fixtures.validation)
  }

  GrantManager.prototype.userInfo = function (tkn, cb) {
    cb(null, fixtures.userInfo)
  }

  helpers.getServer(undefined, (server) => {
    server.inject({
      method: 'GET',
      url: '/role',
      headers: {
        authorization: `bearer ${fixtures.jwt.content}`
      }
    }, (res) => {
      t.truthy(res)
      t.is(res.statusCode, 403)
      t.end()
    })
  })
})

test.cb.serial('authentication does fail – invalid token', (t) => {
  GrantManager.prototype.validateAccessToken = function (tkn, cb) {
    cb(null, false)
  }

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
