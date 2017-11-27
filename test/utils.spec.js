const boom = require('boom')
const test = require('ava')
const utils = require('../src/utils')

test('get boom error with default message', (t) => {
  const result = utils.raiseError('badRequest')
  t.truthy(result)
  t.deepEqual(result, boom.badRequest(undefined, 'Bearer'))
})

test('get boom error with default message', (t) => {
  const result = utils.raiseError('badRequest', undefined, 'foobar')
  t.truthy(result)
  t.deepEqual(result, boom.badRequest('foobar', 'Bearer'))
})

test('get boom error with error message', (t) => {
  const mockErr = new Error('barfoo')
  const result = utils.raiseError('badRequest', mockErr, 'foobar')
  t.truthy(result)
  t.deepEqual(result, boom.badRequest(mockErr.message, 'Bearer'))
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
