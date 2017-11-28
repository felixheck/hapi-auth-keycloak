const boom = require('boom')
const test = require('ava')
const utils = require('../src/utils')

test('get boom error with default message', (t) => {
  const result = utils.raiseUnauthorized()
  t.truthy(result)
  t.deepEqual(result, boom.unauthorized(undefined, 'Bearer', {
    strategy: 'keycloak-jwt'
  }))
})

test('get boom error with default message', (t) => {
  const result = utils.raiseUnauthorized(undefined, 'foobar')
  t.truthy(result)
  t.deepEqual(result, boom.unauthorized('foobar', 'Bearer', {
    strategy: 'keycloak-jwt'
  }))
})

test('get boom error with error message', (t) => {
  const mockErr = new Error('barfoo')
  const result = utils.raiseUnauthorized(mockErr, 'foobar')
  t.truthy(result)
  t.deepEqual(result, boom.unauthorized(mockErr.message, 'Bearer', {
    strategy: 'keycloak-jwt'
  }))
})

test('decorate callback function with `authenticated`', (t) => {
  const mockFn = function () {}
  const fake = utils.fakeToolkit(mockFn)

  t.truthy(mockFn.authenticated)
  t.truthy(fake.authenticated)
  t.deepEqual(mockFn, fake)
})

test('ignore callback function with existing `authenticated`', (t) => {
  const mockFn = function () {}
  mockFn.authenticated = 'foo'
  const fake = utils.fakeToolkit(mockFn)

  t.truthy(fake.authenticated)
  t.is(fake.authenticated, 'foo')
  t.deepEqual(mockFn, fake)
})

test('ignore callback function when not a function', (t) => {
  const mockFn = {}
  const fake = utils.fakeToolkit(mockFn)

  t.falsy(fake.authenticated)
})
