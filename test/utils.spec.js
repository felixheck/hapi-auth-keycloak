const boom = require('boom')
const test = require('ava')
const utils = require('../src/utils')

test('get boom error with default message', (t) => {
  const result = utils.error('badRequest')
  t.truthy(result)
  t.deepEqual(result, boom.badRequest(undefined, 'Bearer'))
})

test('get boom error with default message', (t) => {
  const result = utils.error('badRequest', undefined, 'foobar')
  t.truthy(result)
  t.deepEqual(result, boom.badRequest('foobar', 'Bearer'))
})

test('get boom error with error message', (t) => {
  const mockErr = new Error('barfoo')
  const result = utils.error('badRequest', mockErr, 'foobar')
  t.truthy(result)
  t.deepEqual(result, boom.badRequest(mockErr.message, 'Bearer'))
})

test('decorate callback function with `continue`', (t) => {
  const mockFn = function () {}
  const fake = utils.fakeReply(mockFn)

  t.truthy(mockFn.continue)
  t.truthy(fake.continue)
  t.deepEqual(mockFn, fake)
})

test('ignore callback function with existing `continue`', (t) => {
  const mockFn = function () {}
  mockFn.continue = 'foo'
  const fake = utils.fakeReply(mockFn)

  t.truthy(fake.continue)
  t.is(fake.continue, 'foo')
  t.deepEqual(mockFn, fake)
})
