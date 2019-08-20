const test = require('ava')
const helpers = require('./_helpers')
const fixtures = require('./fixtures')
const utils = require('../src/utils')

const validStrategyOptions = [
  {},
  { cache: {} },
  { cache: { segment: 'foobar' } },
  { cache: true },
  { cache: false },
  { userInfo: [] },
  { userInfo: ['string'] },
  { minTimeBetweenJwksRequests: 0 },
  { minTimeBetweenJwksRequests: 42 }
]

const validPluginOptions = [
  {
    apiKey: {
      url: 'http://foobar.com/foo/bar'
    }
  },
  {
    apiKey: {
      url: 'http://foobar.com/foo/bar',
      in: 'headers'
    }
  },
  {
    apiKey: {
      url: 'http://foobar.com/foo/bar',
      in: 'query'
    }
  },
  {
    apiKey: {
      url: 'http://foobar.com/foo/bar',
      name: 'foobar'
    }
  },
  {
    apiKey: {
      url: 'http://foobar.com/foo/bar',
      prefix: 'barfoo '
    }
  },
  {
    apiKey: {
      url: 'http://foobar.com/foo/bar',
      request: {}
    }
  },
  {
    apiKey: {
      url: 'http://foobar.com/foo/bar',
      tokenPath: 'foo.bar'
    }
  },
  {
    apiKey: {
      url: 'http://foobar.com/{client}/bar'
    }
  }
]

test('throw error if options are empty', (t) => {
  t.throws(() => utils.verifyStrategyOptions())
  t.throws(() => utils.verifyStrategyOptions({}))
})

test('throw error if options are invalid – realmUrl', (t) => {
  const invalids = [
    null,
    undefined,
    NaN,
    '',
    'foobar',
    42,
    true,
    false,
    [],
    new RegExp(),
    {}
  ]

  t.plan(invalids.length)

  invalids.forEach((invalid) => {
    t.throws(() => utils.verifyStrategyOptions(helpers.getStrategyOptions({
      realmUrl: invalid
    })))
  })
})

test('throw error if options are invalid – name', (t) => {
  const invalids = [
    null,
    NaN,
    '',
    42,
    true,
    false,
    [],
    new RegExp(),
    {}
  ]

  t.plan(invalids.length)

  invalids.forEach((invalid) => {
    t.throws(() => utils.verifyStrategyOptions(helpers.getStrategyOptions({
      name: invalid
    })))
  })
})

test('throw error if options are invalid – clientId', (t) => {
  const invalids = [
    null,
    undefined,
    NaN,
    '',
    42,
    true,
    false,
    [],
    new RegExp(),
    {}
  ]

  t.plan(invalids.length)

  invalids.forEach((invalid) => {
    t.throws(() => utils.verifyStrategyOptions(helpers.getStrategyOptions({
      clientId: invalid
    })))
  })
})

test('throw error if options are invalid – secret', (t) => {
  const invalids = [
    null,
    NaN,
    '',
    42,
    true,
    false,
    [],
    new RegExp(),
    {}
  ]

  t.plan(invalids.length)

  invalids.forEach((invalid) => {
    t.throws(() => utils.verifyStrategyOptions(helpers.getStrategyOptions({
      secret: invalid
    })))
  })
})

test('throw error if options are invalid – publicKey', (t) => {
  const invalids = [
    null,
    NaN,
    '',
    'foobar',
    fixtures.common.baseUrl,
    42,
    true,
    false,
    [],
    new RegExp(),
    {},
    {
      foobar: 42
    },
    fixtures.common.publicKey,
    fixtures.common.publicKeyCert
  ]

  t.plan(invalids.length)

  invalids.forEach((invalid) => {
    t.throws(() => utils.verifyStrategyOptions(helpers.getStrategyOptions({
      publicKey: invalid
    })))
  })
})

test('throw error if options are invalid – cache', (t) => {
  const invalids = [
    null,
    NaN,
    '',
    'foobar',
    fixtures.common.baseUrl,
    42,
    []
  ]

  t.plan(invalids.length)

  invalids.forEach((invalid) => {
    t.throws(() => utils.verifyStrategyOptions(helpers.getStrategyOptions({
      cache: invalid
    })))
  })
})

test('throw error if options are invalid – userInfo', (t) => {
  const invalids = [
    null,
    NaN,
    '',
    'foobar',
    fixtures.common.baseUrl,
    42,
    true,
    false,
    new RegExp(),
    {},
    [null],
    [undefined],
    [NaN],
    [''],
    [42],
    [true],
    [false],
    [[]],
    [new RegExp()],
    [{}]
  ]

  t.plan(invalids.length)

  invalids.forEach((invalid) => {
    t.throws(() => utils.verifyStrategyOptions(helpers.getStrategyOptions({
      userInfo: invalid
    })))
  })
})

test('throw error if options are invalid – minTimeBetweenJwksRequests', (t) => {
  const invalids = [
    null,
    NaN,
    '',
    'foobar',
    fixtures.common.baseUrl,
    -42,
    4.2,
    true,
    false,
    new RegExp(),
    {},
    []
  ]

  t.plan(invalids.length)

  invalids.forEach((invalid) => {
    t.throws(() => utils.verifyStrategyOptions(helpers.getStrategyOptions({
      minTimeBetweenJwksRequests: invalid
    })))
  })
})

test('throw error if options are invalid – entitlement', (t) => {
  const invalids = [
    null,
    NaN,
    '',
    'foobar',
    fixtures.common.baseUrl,
    42,
    false,
    new RegExp(),
    {},
    []
  ]

  t.plan(invalids.length)

  invalids.forEach((invalid) => {
    t.throws(() => utils.verifyStrategyOptions(helpers.getStrategyOptions({
      entitlement: invalid
    })))
  })
})

test('throw error if options are invalid – publicKey/secret/entitlement conflict', (t) => {
  t.throws(() => utils.verifyStrategyOptions(helpers.getStrategyOptions({
    publicKey: fixtures.common.publicKeyRsa,
    secret: fixtures.common.secret
  })))

  t.throws(() => utils.verifyStrategyOptions(helpers.getStrategyOptions({
    publicKey: fixtures.common.publicKeyRsa,
    entitlement: true
  })))

  t.throws(() => utils.verifyStrategyOptions(helpers.getStrategyOptions({
    secret: fixtures.common.secret,
    entitlement: true
  })))
})

test('throw no error if options are valid – secret', (t) => {
  t.plan(validStrategyOptions.length)

  validStrategyOptions.forEach((valid) => {
    t.notThrows(
      () => utils.verifyStrategyOptions(helpers.getStrategyOptions(Object.assign({
        secret: fixtures.common.secret
      }, valid)))
    )
  })
})

test('throw no error if options are valid – offline', (t) => {
  const customValids = [...validStrategyOptions, { entitlement: true }]

  t.plan(customValids.length)

  customValids.forEach((valid) => {
    t.notThrows(
      () => utils.verifyStrategyOptions(helpers.getStrategyOptions(valid))
    )
  })
})

test('throw no error if options are valid – publicKey/Rsa', (t) => {
  t.plan(validStrategyOptions.length)

  validStrategyOptions.forEach((valid) => {
    t.notThrows(
      () => utils.verifyStrategyOptions(helpers.getStrategyOptions(Object.assign({
        publicKey: fixtures.common.publicKeyRsa
      }, valid)))
    )
  })
})

test('throw no error if options are valid – publicKey/Buffer', (t) => {
  t.plan(validStrategyOptions.length)

  validStrategyOptions.forEach((valid) => {
    t.notThrows(
      () => utils.verifyStrategyOptions(helpers.getStrategyOptions(Object.assign({
        publicKey: fixtures.common.publicKeyBuffer
      }, valid)))
    )
  })
})

test('throw no error if options are valid – publicKey/JWK', (t) => {
  t.plan(validStrategyOptions.length)

  validStrategyOptions.forEach((valid) => {
    t.notThrows(
      () => utils.verifyStrategyOptions(helpers.getStrategyOptions(Object.assign({
        publicKey: fixtures.common.publicKeyJwk
      }, valid)))
    )
  })
})

test('throw error if options are invalid – apiKey', (t) => {
  const invalids = [
    null,
    NaN,
    '',
    'foobar',
    fixtures.common.baseUrl,
    42,
    [],
    true,
    false,
    {}
  ]

  t.plan(invalids.length)

  invalids.forEach((invalid) => {
    t.throws(() => utils.verifyPluginOptions({
      apiKey: invalid
    }))
  })
})

test('throw error if options are invalid – apiKey.url', (t) => {
  const invalids = [
    null,
    NaN,
    '',
    42,
    true,
    false,
    [],
    new RegExp(),
    {}
  ]

  t.plan(invalids.length)

  invalids.forEach((invalid) => {
    t.throws(() => utils.verifyPluginOptions({
      apiKey: {
        url: invalid
      }
    }))
  })
})

test('throw error if options are invalid – apiKey.name', (t) => {
  const invalids = [
    null,
    NaN,
    '',
    42,
    true,
    false,
    [],
    new RegExp(),
    {}
  ]

  t.plan(invalids.length)

  invalids.forEach((invalid) => {
    t.throws(() => utils.verifyPluginOptions({
      apiKey: {
        url: 'http://foobar.com/foo/bar',
        name: invalid
      }
    }))
  })
})

test('throw error if options are invalid – apiKey.prefix', (t) => {
  const invalids = [
    null,
    NaN,
    '',
    42,
    true,
    false,
    [],
    new RegExp(),
    {}
  ]

  t.plan(invalids.length)

  invalids.forEach((invalid) => {
    t.throws(() => utils.verifyPluginOptions({
      apiKey: {
        url: 'http://foobar.com/foo/bar',
        prefix: invalid
      }
    }))
  })
})

test('throw error if options are invalid – apiKey.tokenPath', (t) => {
  const invalids = [
    null,
    NaN,
    '',
    42,
    true,
    false,
    [],
    new RegExp(),
    {}
  ]

  t.plan(invalids.length)

  invalids.forEach((invalid) => {
    t.throws(() => utils.verifyPluginOptions({
      apiKey: {
        url: 'http://foobar.com/foo/bar',
        tokenPath: invalid
      }
    }))
  })
})

test('throw error if options are invalid – apiKey.in', (t) => {
  const invalids = [
    null,
    NaN,
    '',
    42,
    true,
    false,
    [],
    new RegExp(),
    {},
    'foo'
  ]

  t.plan(invalids.length)

  invalids.forEach((invalid) => {
    t.throws(() => utils.verifyPluginOptions({
      apiKey: {
        url: 'http://foobar.com/foo/bar',
        in: invalid
      }
    }))
  })
})

test('throw error if options are invalid – apiKey.options', (t) => {
  const invalids = [
    null,
    NaN,
    '',
    'foobar',
    fixtures.common.baseUrl,
    42,
    [],
    {}
  ]

  t.plan(invalids.length)

  invalids.forEach((invalid) => {
    t.throws(() => utils.verifyPluginOptions({
      apiKey: {
        url: 'http://foobar.com/foo/bar',
        options: invalid
      }
    }))
  })
})

test('throw no error if options are valid – apiKey', (t) => {
  t.plan(validPluginOptions.length)

  validPluginOptions.forEach((valid) => {
    t.notThrows(
      () => utils.verifyPluginOptions(valid)
    )
  })
})
