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
      clientId: 'foobar',
      realmUrl: null
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: undefined
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: NaN
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: ''
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'foobar'
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 42
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: true
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: []
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: new RegExp()
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: {}
    }
  }), Error)
})

test('throw error if options are invalid – client.clientId', (t) => {
  t.throws(() => utils.verify({
    client: {
      realmUrl: 'http://foobar.com',
      clientId: null
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: 'http://foobar.com',
      clientId: undefined
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: 'http://foobar.com',
      clientId: NaN
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: 'http://foobar.com',
      clientId: 42
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: 'http://foobar.com',
      clientId: true
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: 'http://foobar.com',
      clientId: []
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: 'http://foobar.com',
      clientId: new RegExp()
    }
  }), Error)

  t.throws(() => utils.verify({
    client: {
      realmUrl: 'http://foobar.com',
      clientId: {}
    }
  }), Error)
})

test('throw error if options are invalid – cache', (t) => {
  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    cache: null
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    cache: NaN
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    cache: ''
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    cache: 'foobar'
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    cache: 42
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    cache: true
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    cache: []
  }), Error)
})

test('throw error if options are invalid – userInfo', (t) => {
  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    userInfo: null
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    userInfo: NaN
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    userInfo: ''
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    userInfo: 'foobar'
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    userInfo: 42
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    userInfo: true
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    userInfo: [null]
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    userInfo: [undefined]
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    userInfo: [NaN]
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    userInfo: [42]
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    userInfo: [true]
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    userInfo: ['']
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    userInfo: [{}]
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    userInfo: [[]]
  }), Error)

  t.throws(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    userInfo: [new RegExp()]
  }), Error)
})

test('throw no error if options are valid', (t) => {
  t.notThrows(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    }
  }), Error)

  t.notThrows(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    cache: undefined
  }), Error)

  t.notThrows(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    cache: {}
  }), Error)

  t.notThrows(() => utils.verify({
    client: {
      clientId: fixtures.clientId,
      realmUrl: fixtures.realmUrl
    },
    cache: {
      segment: 'foobar'
    }
  }), Error)

  t.notThrows(() => utils.verify({
    client: {
      clientId: fixtures.clientId,
      realmUrl: fixtures.realmUrl
    },
    cache: false
  }), Error)

  t.notThrows(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    userInfo: undefined
  }), Error)

  t.notThrows(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    userInfo: []
  }), Error)

  t.notThrows(() => utils.verify({
    client: {
      clientId: 'foobar',
      realmUrl: 'http://foobar.com'
    },
    userInfo: ['string']
  }), Error)
})
