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
  t.deepEqual(result, boom.badRequest(mockErr.toString(), 'Bearer'))
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
      clientId: fixtures.clientId,
      secret: fixtures.secret,
      realmUrl: null
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: fixtures.clientId,
      secret: fixtures.secret,
      realmUrl: undefined
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: fixtures.clientId,
      secret: fixtures.secret,
      realmUrl: NaN
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: fixtures.clientId,
      secret: fixtures.secret,
      realmUrl: ''
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: fixtures.clientId,
      secret: fixtures.secret,
      realmUrl: 'foobar'
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: fixtures.clientId,
      secret: fixtures.secret,
      realmUrl: 42
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: fixtures.clientId,
      secret: fixtures.secret,
      realmUrl: true
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: fixtures.clientId,
      secret: fixtures.secret,
      realmUrl: []
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: fixtures.clientId,
      secret: fixtures.secret,
      realmUrl: new RegExp()
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: fixtures.clientId,
      secret: fixtures.secret,
      realmUrl: {}
    }
  }), Error)
})

test('throw error if options are invalid – client.clientId', (t) => {
  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.realmUrl,
      secret: fixtures.secret,
      clientId: null
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.realmUrl,
      secret: fixtures.secret,
      clientId: undefined
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.realmUrl,
      secret: fixtures.secret,
      clientId: NaN
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.realmUrl,
      secret: fixtures.secret,
      clientId: 42
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.realmUrl,
      secret: fixtures.secret,
      clientId: ''
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.realmUrl,
      secret: fixtures.secret,
      clientId: true
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.realmUrl,
      secret: fixtures.secret,
      clientId: []
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.realmUrl,
      secret: fixtures.secret,
      clientId: new RegExp()
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.realmUrl,
      secret: fixtures.secret,
      clientId: {}
    }
  }), Error)
})

test('throw error if options are invalid – client.secret', (t) => {
  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.realmUrl,
      clientId: fixtures.clientId,
      secret: null
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.realmUrl,
      clientId: fixtures.clientId,
      secret: undefined
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.realmUrl,
      clientId: fixtures.clientId,
      secret: NaN
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.realmUrl,
      clientId: fixtures.clientId,
      secret: 42
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.realmUrl,
      clientId: fixtures.clientId,
      secret: ''
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.realmUrl,
      clientId: fixtures.clientId,
      secret: true
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.realmUrl,
      clientId: fixtures.clientId,
      secret: []
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.realmUrl,
      clientId: fixtures.clientId,
      secret: new RegExp()
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: fixtures.realmUrl,
      clientId: fixtures.clientId,
      secret: {}
    }
  }), Error)
})

test('throw error if options are invalid – cache', (t) => {
  t.throws(() => utils.verify({
    client: fixtures.config,
    cache: null
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.config,
    cache: NaN
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.config,
    cache: ''
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.config,
    cache: 'foobar'
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.config,
    cache: 42
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.config,
    cache: true
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.config,
    cache: []
  }), Error)
})

test('throw error if options are invalid – userInfo', (t) => {
  t.throws(() => utils.verify({
    client: fixtures.config,
    userInfo: null
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.config,
    userInfo: NaN
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.config,
    userInfo: ''
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.config,
    userInfo: 'foobar'
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.config,
    userInfo: 42
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.config,
    userInfo: true
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.config,
    userInfo: [null]
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.config,
    userInfo: [undefined]
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.config,
    userInfo: [NaN]
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.config,
    userInfo: [42]
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.config,
    userInfo: [true]
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.config,
    userInfo: ['']
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.config,
    userInfo: [{}]
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.config,
    userInfo: [[]]
  }), Error)

  t.throws(() => utils.verify({
    client: fixtures.config,
    userInfo: [new RegExp()]
  }), Error)
})

test('throw no error if options are valid', (t) => {
  t.notThrows(() => utils.verify({
    client: fixtures.config
  }), Error)

  t.notThrows(() => utils.verify({
    client: fixtures.config,
    cache: undefined
  }), Error)

  t.notThrows(() => utils.verify({
    client: fixtures.config,
    cache: {}
  }), Error)

  t.notThrows(() => utils.verify({
    client: fixtures.config,
    cache: {
      segment: 'foobar'
    }
  }), Error)

  t.notThrows(() => utils.verify({
    client: fixtures.config,
    cache: false
  }), Error)

  t.notThrows(() => utils.verify({
    client: fixtures.config,
    userInfo: undefined
  }), Error)

  t.notThrows(() => utils.verify({
    client: fixtures.config,
    userInfo: []
  }), Error)

  t.notThrows(() => utils.verify({
    client: fixtures.config,
    userInfo: ['string']
  }), Error)
})
