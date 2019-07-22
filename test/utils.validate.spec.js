const test = require('ava')
const helpers = require('./_helpers')
const fixtures = require('./fixtures')
const utils = require('../src/utils')

const valids = [
  {},
  { cache: {} },
  { cache: { segment: 'foobar' } },
  { cache: true },
  { cache: false },
  { userInfo: [] },
  { userInfo: ['string'] },
  { minTimeBetweenJwksRequests: 0 },
  { minTimeBetweenJwksRequests: 42 },
  { apiKey: {
    url: 'http://foobar.com/foo/bar'
  } },
  { apiKey: {
    url: 'http://foobar.com/foo/bar',
    in: 'headers'
  } },
  { apiKey: {
    url: 'http://foobar.com/foo/bar',
    in: 'query'
  } },
  { apiKey: {
    url: 'http://foobar.com/foo/bar',
    name: 'foobar'
  } },
  { apiKey: {
    url: 'http://foobar.com/foo/bar',
    prefix: 'barfoo '
  } },
  { apiKey: {
    url: 'http://foobar.com/foo/bar',
    request: {}
  } },
  { apiKey: {
    url: 'http://foobar.com/foo/bar',
    tokenPath: 'foo.bar'
  } },
  { apiKey: {
    url: 'http://foobar.com/{client}/bar'
  } }
]

test('throw error if options are empty', (t) => {
  t.throws(() => utils.verify())
  t.throws(() => utils.verify({}))
})

test('throw error if options are invalid – schemeName', (t) => {
  const invalids = [
    null,
    NaN,
    42,
    true,
    false,
    [],
    new RegExp(),
    {}
  ]

  t.plan(invalids.length)

  invalids.forEach((invalid) => {
    t.throws(() => utils.verify(helpers.getOptions({
      schemeName: invalid
    })))
  })
})

test('throw error if options are invalid – decoratorName', (t) => {
  const invalids = [
    null,
    NaN,
    42,
    true,
    false,
    [],
    new RegExp(),
    {}
  ]

  t.plan(invalids.length)

  invalids.forEach((invalid) => {
    t.throws(() => utils.verify(helpers.getOptions({
      decoratorName: invalid
    })))
  })
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
    t.throws(() => utils.verify(helpers.getOptions({
      realmUrl: invalid
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
    t.throws(() => utils.verify(helpers.getOptions({
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
    t.throws(() => utils.verify(helpers.getOptions({
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
    t.throws(() => utils.verify(helpers.getOptions({
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
    t.throws(() => utils.verify(helpers.getOptions({
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
    t.throws(() => utils.verify(helpers.getOptions({
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
    t.throws(() => utils.verify(helpers.getOptions({
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
    t.throws(() => utils.verify(helpers.getOptions({
      entitlement: invalid
    })))
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
    t.throws(() => utils.verify(helpers.getOptions({
      apiKey: invalid
    })))
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
    t.throws(() => utils.verify(helpers.getOptions({
      apiKey: {
        url: invalid
      }
    })))
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
    t.throws(() => utils.verify(helpers.getOptions({
      apiKey: {
        url: 'http://foobar.com/foo/bar',
        name: invalid
      }
    })))
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
    t.throws(() => utils.verify(helpers.getOptions({
      apiKey: {
        url: 'http://foobar.com/foo/bar',
        prefix: invalid
      }
    })))
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
    t.throws(() => utils.verify(helpers.getOptions({
      apiKey: {
        url: 'http://foobar.com/foo/bar',
        tokenPath: invalid
      }
    })))
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
    t.throws(() => utils.verify(helpers.getOptions({
      apiKey: {
        url: 'http://foobar.com/foo/bar',
        in: invalid
      }
    })))
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
    t.throws(() => utils.verify(helpers.getOptions({
      apiKey: {
        url: 'http://foobar.com/foo/bar',
        options: invalid
      }
    })))
  })
})

test('throw error if options are invalid – publicKey/secret/entitlement conflict', (t) => {
  t.throws(() => utils.verify(helpers.getOptions({
    publicKey: fixtures.common.publicKeyRsa,
    secret: fixtures.common.secret
  })))

  t.throws(() => utils.verify(helpers.getOptions({
    publicKey: fixtures.common.publicKeyRsa,
    entitlement: true
  })))

  t.throws(() => utils.verify(helpers.getOptions({
    secret: fixtures.common.secret,
    entitlement: true
  })))
})

test('throw no error if options are valid – schemeName', (t) => {
  const customValids = [
    ...valids,
    { schemeName: '' },
    { schemeName: 'foobar' },
    { schemeName: undefined }
  ]

  t.plan(customValids.length)

  customValids.forEach((valid) => {
    t.notThrows(
      () => utils.verify(helpers.getOptions(valid))
    )
  })
})

test('throw no error if options are valid – decoratorName', (t) => {
  const customValids = [
    ...valids,
    { decoratorName: '' },
    { decoratorName: 'foobar' },
    { decoratorName: undefined }
  ]

  t.plan(customValids.length)

  customValids.forEach((valid) => {
    t.notThrows(
      () => utils.verify(helpers.getOptions(valid))
    )
  })
})

test('throw no error if options are valid – secret', (t) => {
  t.plan(valids.length)

  valids.forEach((valid) => {
    t.notThrows(
      () => utils.verify(helpers.getOptions(Object.assign({
        secret: fixtures.common.secret
      }, valid)))
    )
  })
})

test('throw no error if options are valid – offline', (t) => {
  const customValids = [...valids, { entitlement: true }]

  t.plan(customValids.length)

  customValids.forEach((valid) => {
    t.notThrows(
      () => utils.verify(helpers.getOptions(valid))
    )
  })
})

test('throw no error if options are valid – publicKey/Rsa', (t) => {
  t.plan(valids.length)

  valids.forEach((valid) => {
    t.notThrows(
      () => utils.verify(helpers.getOptions(Object.assign({
        publicKey: fixtures.common.publicKeyRsa
      }, valid)))
    )
  })
})

test('throw no error if options are valid – publicKey/Buffer', (t) => {
  t.plan(valids.length)

  valids.forEach((valid) => {
    t.notThrows(
      () => utils.verify(helpers.getOptions(Object.assign({
        publicKey: fixtures.common.publicKeyBuffer
      }, valid)))
    )
  })
})

test('throw no error if options are valid – publicKey/JWK', (t) => {
  t.plan(valids.length)

  valids.forEach((valid) => {
    t.notThrows(
      () => utils.verify(helpers.getOptions(Object.assign({
        publicKey: fixtures.common.publicKeyJwk
      }, valid)))
    )
  })
})
