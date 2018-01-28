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
  }},
  { apiKey: {
    url: 'http://foobar.com/foo/bar',
    in: 'headers'
  }},
  { apiKey: {
    url: 'http://foobar.com/foo/bar',
    in: 'query'
  }},
  { apiKey: {
    url: 'http://foobar.com/foo/bar',
    name: 'foobar'
  }},
  { apiKey: {
    url: 'http://foobar.com/foo/bar',
    prefix: 'barfoo '
  }},
  { apiKey: {
    url: 'http://foobar.com/foo/bar',
    request: {}
  }},
  { apiKey: {
    url: 'http://foobar.com/foo/bar',
    tokenPath: 'foo.bar'
  }},
  { apiKey: {
    url: 'http://foobar.com/{client}/bar'
  }}
]

test('throw error if options are empty', (t) => {
  t.throws(() => utils.verify(), Error)
  t.throws(() => utils.verify({}), Error)
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
    })), Error, helpers.log('realmUrl', invalid))
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
    })), Error, helpers.log('clientId', invalid))
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
    })), Error, helpers.log('secret', invalid))
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
    })), Error, helpers.log('publicKey', invalid))
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
    })), Error, helpers.log('cache', invalid))
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
    [ null ],
    [ undefined ],
    [ NaN ],
    [ '' ],
    [ 42 ],
    [ true ],
    [ false ],
    [ [] ],
    [ new RegExp() ],
    [ {} ]
  ]

  t.plan(invalids.length)

  invalids.forEach((invalid) => {
    t.throws(() => utils.verify(helpers.getOptions({
      userInfo: invalid
    })), Error, helpers.log('userInfo', invalid))
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
    })), Error, helpers.log('minTimeBetweenJwksRequests', invalid))
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
    })), Error, helpers.log('entitlement', invalid))
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
    })), Error, helpers.log('apiKey', invalid))
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
    })), Error, helpers.log('apiKey.url', invalid))
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
    })), Error, helpers.log('apiKey.name', invalid))
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
    })), Error, helpers.log('apiKey.prefix', invalid))
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
    })), Error, helpers.log('apiKey.tokenPath', invalid))
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
    })), Error, helpers.log('apiKey.in', invalid))
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
    })), Error, helpers.log('apiKey.options', invalid))
  })
})

test('throw error if options are invalid – publicKey/secret/entitlement conflict', (t) => {
  t.throws(() => utils.verify(helpers.getOptions({
    publicKey: fixtures.common.publicKeyRsa,
    secret: fixtures.common.secret
  })), Error, 'publicKey/secret: both defined')

  t.throws(() => utils.verify(helpers.getOptions({
    publicKey: fixtures.common.publicKeyRsa,
    entitlement: true
  })), Error, 'publicKey/entitlement: both defined')

  t.throws(() => utils.verify(helpers.getOptions({
    secret: fixtures.common.secret,
    entitlement: true
  })), Error, 'secret/entitlement: both defined')
})

test('throw no error if options are valid – secret', (t) => {
  t.plan(valids.length)

  valids.forEach((valid) => {
    t.notThrows(
      () => utils.verify(helpers.getOptions(Object.assign({
        secret: fixtures.common.secret
      }, valid))),
      Error, helpers.log('valid.secret', valid))
  })
})

test('throw no error if options are valid – offline', (t) => {
  const customValids = [...valids, { entitlement: true }]

  t.plan(customValids.length)

  customValids.forEach((valid) => {
    t.notThrows(
      () => utils.verify(helpers.getOptions(valid)),
      Error, helpers.log('valid.offline', valid))
  })
})

test('throw no error if options are valid – publicKey/Rsa', (t) => {
  t.plan(valids.length)

  valids.forEach((valid) => {
    t.notThrows(
      () => utils.verify(helpers.getOptions(Object.assign({
        publicKey: fixtures.common.publicKeyRsa
      }, valid))),
      Error, helpers.log('valid.publicKey/Rsa', valid))
  })
})

test('throw no error if options are valid – publicKey/Buffer', (t) => {
  t.plan(valids.length)

  valids.forEach((valid) => {
    t.notThrows(
      () => utils.verify(helpers.getOptions(Object.assign({
        publicKey: fixtures.common.publicKeyBuffer
      }, valid))),
      Error, helpers.log('valid.publicKey/Buffer', valid))
  })
})

test('throw no error if options are valid – publicKey/JWK', (t) => {
  t.plan(valids.length)

  valids.forEach((valid) => {
    t.notThrows(
      () => utils.verify(helpers.getOptions(Object.assign({
        publicKey: fixtures.common.publicKeyJwk
      }, valid))),
      Error, helpers.log('valid.publicKey/JWK', valid))
  })
})
