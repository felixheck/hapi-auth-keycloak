const test = require('ava')
const _ = require('lodash')
const { GrantManager } = require('keycloak-auth-utils')
const manager = require('../src/manager')
const helpers = require('./_helpers')
const fixtures = require('./_fixtures')

const GrantManagerClone = {}

test.beforeEach(() => {
  GrantManagerClone.prototype = _.cloneDeep(GrantManager.prototype)
})

test.afterEach('reset manager and prototypes', () => {
  manager.reset()
  GrantManager.prototype = GrantManagerClone.prototype
})

test.cb.serial('server method validates token', (t) => {
  GrantManager.prototype.validateAccessToken = function (tkn, cb) {
    cb(null, fixtures.validation)
  }

  GrantManager.prototype.userInfo = function (tkn, cb) {
    cb(null, fixtures.userInfo)
  }

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
  GrantManager.prototype.validateAccessToken = function (tkn, cb) {
    cb(null, fixtures.validation)
  }

  GrantManager.prototype.userInfo = function (tkn, cb) {
    cb(new Error('an error'))
  }

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
  GrantManager.prototype.validateAccessToken = function (tkn, cb) {
    cb(new Error('an error'))
  }

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
  GrantManager.prototype.validateAccessToken = function (tkn, cb) {
    cb(null, false)
  }

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
