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
  { live: true },
  { live: false }
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
    }
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

test('throw error if options are invalid – live', (t) => {
  const invalids = [
    null,
    NaN,
    '',
    'foobar',
    fixtures.common.baseUrl,
    42,
    new RegExp(),
    {},
    []
  ]

  t.plan(invalids.length)

  invalids.forEach((invalid) => {
    t.throws(() => utils.verify(helpers.getOptions({
      live: invalid
    })), Error, helpers.log('live', invalid))
  })
})

test('throw error if options are invalid – publicKey/secret conflict', (t) => {
  t.throws(() => utils.verify(helpers.getOptions({
    publicKey: fixtures.common.publicKeyRsa,
    secret: fixtures.common.secret
  })), Error, 'publicKey/secret: both defined')
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
  t.plan(valids.length)

  valids.forEach((valid) => {
    t.notThrows(
      () => utils.verify(helpers.getOptions(valid)),
      Error, helpers.log('valid.offline', valid))
  })
})

test('throw no error if options are valid – publicKey', (t) => {
  t.plan(valids.length)

  valids.forEach((valid) => {
    t.notThrows(
      () => utils.verify(helpers.getOptions(Object.assign({
        publicKey: fixtures.common.publicKey
      }, valid))),
      Error, helpers.log('valid.publicKey', valid))
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

test('throw no error if options are valid – publicKey/Cert', (t) => {
  t.plan(valids.length)

  valids.forEach((valid) => {
    t.notThrows(
      () => utils.verify(helpers.getOptions(Object.assign({
        publicKey: fixtures.common.publicKeyCert
      }, valid))),
      Error, helpers.log('valid.publicKey/Cert', valid))
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
