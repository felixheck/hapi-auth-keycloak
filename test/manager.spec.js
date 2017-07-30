const test = require('ava')
const _ = require('lodash')
const { GrantManager } = require('keycloak-auth-utils')
const manager = require('../src/manager')
const fixtures = require('./_fixtures')

const GrantManagerClone = {}

test.beforeEach(() => {
  GrantManagerClone.prototype = _.cloneDeep(GrantManager.prototype)
})

test.afterEach('reset manager and prototypes', () => {
  manager.reset()
  GrantManager.prototype = GrantManagerClone.prototype
})

test.serial('just create one instance – object', (t) => {
  const mngr1 = manager.init({})
  const mngr2 = manager.init({})

  t.truthy(mngr1)
  t.truthy(mngr2)
  t.deepEqual(mngr1, mngr2)
})

test.cb.serial('get user information – valid', (t) => {
  GrantManager.prototype.userInfo = function (tkn, cb) {
    cb(null, fixtures.userInfo)
  }

  const mockCb = (res) => {
    t.truthy(res)
    t.deepEqual(res, fixtures.userInfo)
    t.end()
  }

  manager.init(fixtures.config)
  manager.userInfo(fixtures.token, mockCb, mockCb)
})

test.cb.serial('get no user information – invalid', (t) => {
  GrantManager.prototype.userInfo = function (tkn, cb) {
    cb(new Error('an error'))
  }

  const mockCb = (res) => {
    t.truthy(res)
    t.truthy(res.isBoom)
    t.is(res.output.statusCode, 401)
    t.is(res.output.headers['WWW-Authenticate'], 'Bearer error="Error: an error"')
    t.end()
  }

  manager.init(fixtures.config)
  manager.userInfo(fixtures.token, mockCb, mockCb)
})

test.cb.serial('validate token successful', (t) => {
  GrantManager.prototype.validateAccessToken = function (tkn, cb) {
    cb(null, fixtures.validation)
  }

  const mockCb = (res) => {
    t.truthy(res)
    t.deepEqual(res, fixtures.validation)
    t.end()
  }

  manager.init(fixtures.config)
  manager.validateAccessToken(fixtures.token, mockCb, mockCb)
})

test.cb.serial('validate token unsuccessful – error', (t) => {
  GrantManager.prototype.validateAccessToken = function (tkn, cb) {
    cb(new Error('an error'))
  }

  const mockCb = (res) => {
    t.truthy(res)
    t.truthy(res.isBoom)
    t.is(res.output.statusCode, 401)
    t.is(res.output.headers['WWW-Authenticate'], 'Bearer error="Error: an error"')
    t.end()
  }

  manager.init(fixtures.config)
  manager.validateAccessToken(fixtures.token, mockCb, mockCb)
})

test.cb.serial('validate token unsuccessful – invalid', (t) => {
  GrantManager.prototype.validateAccessToken = function (tkn, cb) {
    cb(null, false)
  }

  const mockCb = (res) => {
    t.truthy(res)
    t.truthy(res.isBoom)
    t.is(res.output.statusCode, 401)
    t.is(res.output.headers['WWW-Authenticate'], 'Bearer error="Invalid credentials"')
    t.end()
  }

  manager.init(fixtures.config)
  manager.validateAccessToken(fixtures.token, mockCb, mockCb)
})
