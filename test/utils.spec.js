const test = require('ava')
const boom = require('boom')
const fixtures = require('./_fixtures')
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

  utils.fakeReply(mockFn)
  t.truthy(mockFn.continue)
})

test('ignore callback function with exsting `continue`', (t) => {
  const mockFn = function () {}
  mockFn.continue = 'foo'

  utils.fakeReply(mockFn)
  t.truthy(mockFn.continue)
  t.is(mockFn.continue, 'foo')
})

test('throw error if options are invalid – client', (t) => {
  t.throws(() => utils.verify(), Error)
  t.throws(() => utils.verify({}), Error)

  t.throws(() => utils.verify({
    client: null
  }), Error)

  t.throws(() => utils.verify({
    client: undefined
  }), Error)

  t.throws(() => utils.verify({
    client: NaN
  }), Error)

  t.throws(() => utils.verify({
    client: ''
  }), Error)

  t.throws(() => utils.verify({
    client: 'foobar'
  }), Error)

  t.throws(() => utils.verify({
    client: 42
  }), Error)

  t.throws(() => utils.verify({
    client: true
  }), Error)

  t.throws(() => utils.verify({
    client: []
  }), Error)

  t.throws(() => utils.verify({
    client: new RegExp()
  }), Error)

  t.throws(() => utils.verify({
    client: {}
  }), Error)
})

test('throw error if options are invalid – client.realmUrl', (t) => {
  t.throws(() => utils.verify(), Error)
  t.throws(() => utils.verify({}), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: fixtures.common.clientId,
      secret: fixtures.secret.clientId,
      realmUrl: null
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: fixtures.common.clientId,
      secret: fixtures.secret.clientId,
      realmUrl: undefined
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: fixtures.common.clientId,
      secret: fixtures.secret.clientId,
      realmUrl: NaN
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: fixtures.common.clientId,
      secret: fixtures.secret.clientId,
      realmUrl: ''
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: fixtures.common.clientId,
      secret: fixtures.secret.clientId,
      realmUrl: 'foobar'
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: fixtures.common.clientId,
      secret: fixtures.secret.clientId,
      realmUrl: 42
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: fixtures.common.clientId,
      secret: fixtures.secret.clientId,
      realmUrl: true
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: fixtures.common.clientId,
      secret: fixtures.secret.clientId,
      realmUrl: []
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: fixtures.common.clientId,
      secret: fixtures.secret.clientId,
      realmUrl: new RegExp()
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: fixtures.common.clientId,
      secret: fixtures.secret.clientId,
      realmUrl: {}
    }
  }), Error)
})

test('throw error if options are invalid – client.clientId', (t) => {
  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.common.clientId,
      secret: fixtures.secret.clientId,
      clientId: null
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.common.clientId,
      secret: fixtures.secret.clientId,
      clientId: undefined
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.common.clientId,
      secret: fixtures.secret.clientId,
      clientId: NaN
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.common.clientId,
      secret: fixtures.secret.clientId,
      clientId: 42
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.common.clientId,
      secret: fixtures.secret.clientId,
      clientId: ''
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.common.clientId,
      secret: fixtures.secret.clientId,
      clientId: true
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.common.clientId,
      secret: fixtures.secret.clientId,
      clientId: []
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.common.clientId,
      secret: fixtures.secret.clientId,
      clientId: new RegExp()
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.common.clientId,
      secret: fixtures.secret.clientId,
      clientId: {}
    }
  }), Error)
})

test('throw error if options are invalid – client.secret', (t) => {
  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.common.clientId,
      clientId: fixtures.common.clientId,
      secret: null
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.common.clientId,
      clientId: fixtures.common.clientId,
      secret: undefined
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.common.clientId,
      clientId: fixtures.common.clientId,
      secret: NaN
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.common.clientId,
      clientId: fixtures.common.clientId,
      secret: 42
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.common.clientId,
      clientId: fixtures.common.clientId,
      secret: ''
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.common.clientId,
      clientId: fixtures.common.clientId,
      secret: true
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.common.clientId,
      clientId: fixtures.common.clientId,
      secret: []
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.common.clientId,
      clientId: fixtures.common.clientId,
      secret: new RegExp()
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.common.clientId,
      clientId: fixtures.common.clientId,
      secret: {}
    }
  }), Error)
})

test('throw error if options are invalid – cache', (t) => {
  t.throws(() => utils.verify({
    client: fixtures.clientConfig,
    cache: null
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.clientConfig,
    cache: NaN
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.clientConfig,
    cache: ''
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.clientConfig,
    cache: 'foobar'
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.clientConfig,
    cache: 42
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.clientConfig,
    cache: true
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.clientConfig,
    cache: []
  }), Error)
})

test('throw error if options are invalid – userInfo', (t) => {
  t.throws(() => utils.verify({
    client: fixtures.clientConfig,
    userInfo: null
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.clientConfig,
    userInfo: NaN
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.clientConfig,
    userInfo: ''
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.clientConfig,
    userInfo: 'foobar'
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.clientConfig,
    userInfo: 42
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.clientConfig,
    userInfo: true
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.clientConfig,
    userInfo: [null]
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.clientConfig,
    userInfo: [undefined]
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.clientConfig,
    userInfo: [NaN]
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.clientConfig,
    userInfo: [42]
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.clientConfig,
    userInfo: [true]
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.clientConfig,
    userInfo: ['']
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.clientConfig,
    userInfo: [{}]
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.clientConfig,
    userInfo: [[]]
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.clientConfig,
    userInfo: [new RegExp()]
  }), Error)
})

test('throw no error if options are valid', (t) => {
  t.notThrows(() => utils.verify({
    client: fixtures.clientConfig
  }), Error)

  t.notThrows(() => utils.verify({
    client: fixtures.clientConfig,
    cache: undefined
  }), Error)

  t.notThrows(() => utils.verify({
    client: fixtures.clientConfig,
    cache: {}
  }), Error)

  t.notThrows(() => utils.verify({
    client: fixtures.clientConfig,
    cache: {
      segment: 'foobar'
    }
  }), Error)

  t.notThrows(() => utils.verify({
    client: fixtures.clientConfig,
    cache: false
  }), Error)

  t.notThrows(() => utils.verify({
    client: fixtures.clientConfig,
    userInfo: undefined
  }), Error)

  t.notThrows(() => utils.verify({
    client: fixtures.clientConfig,
    userInfo: []
  }), Error)

  t.notThrows(() => utils.verify({
    client: fixtures.clientConfig,
    userInfo: ['string']
  }), Error)
})
