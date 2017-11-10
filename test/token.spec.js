const test = require('ava')
const _ = require('lodash')
const fixtures = require('./fixtures')
const token = require('../src/token')

test('enable multiple instances', (t) => {
  const tkn1 = token.create('bearer a.b.c')
  const tkn2 = token.create('bearer c.b.a')
  t.truthy(tkn1)
  t.truthy(tkn2)
  t.is(tkn1, 'a.b.c')
  t.is(tkn2, 'c.b.a')
})

test('get bearer token – lowercase', (t) => {
  const tkn = token.create('bearer a.b.c')
  t.truthy(tkn)
  t.is(tkn, 'a.b.c')
})

test('get bearer token – uppercase', (t) => {
  const tkn = token.create('Bearer a.b.c')
  t.truthy(tkn)
  t.is(tkn, 'a.b.c')
})

test('get bearer token – capital case', (t) => {
  const tkn = token.create('BEARER a.b.c')
  t.truthy(tkn)
  t.is(tkn, 'a.b.c')
})

test('get no bearer token – wrong scheme', (t) => {
  const tkn = token.create('beareer a.b.c')
  t.falsy(tkn)
})

test('get no bearer token – multiple spaces', (t) => {
  const tkn = token.create('bearer  a.b.c')
  t.falsy(tkn)
})

test('get no bearer token – too less segments', (t) => {
  const tkn = token.create('bearer  a.b')
  t.falsy(tkn)
})

test('get no bearer token – spaces between', (t) => {
  const tkn = token.create('bearer  a.b.c c')
  t.falsy(tkn)
})

test('get user data of token', (t) => {
  const tkn = fixtures.composeJwt('current')
  const data = token.getData(tkn, { clientId: fixtures.common.clientId })

  t.truthy(tkn)
  t.truthy(_.inRange(data.expiresIn, 3590000, 3600000))
  t.is(data.credentials.sub, fixtures.content.current.sub)
  t.falsy(data.credentials.name)
  t.deepEqual(data.credentials.scope.sort(), fixtures.targetScope)
})

test('get user data of token – rpt', (t) => {
  const tkn = fixtures.composeJwt('rpt')
  const data = token.getData(tkn, { clientId: fixtures.common.clientId })

  t.truthy(tkn)
  t.truthy(_.inRange(-1 * data.expiresIn, Date.now()))
  t.is(data.credentials.sub, fixtures.content.rpt.sub)
  t.falsy(data.credentials.name)
  t.deepEqual(data.credentials.scope.sort(), [...fixtures.targetScope, 'scope:foo.READ', 'scope:foo.WRITE'])
})

test('get user data of token – additional fields', (t) => {
  const tkn = fixtures.composeJwt('current')
  const data = token.getData(tkn, {
    clientId: fixtures.common.clientId,
    userInfo: ['name']
  })

  t.truthy(tkn)
  t.truthy(_.inRange(data.expiresIn, 3590000, 3600000))
  t.is(data.credentials.sub, fixtures.content.current.sub)
  t.is(data.credentials.name, fixtures.content.current.name)
  t.deepEqual(data.credentials.scope.sort(), fixtures.targetScope)
})

test('get user data of token – default expiration', (t) => {
  const tkn = fixtures.composeJwt('noExp')
  const data = token.getData(tkn, { clientId: fixtures.common.clientId })

  t.truthy(tkn)
  t.is(data.expiresIn, 60000)
  t.is(data.credentials.sub, fixtures.content.expired.sub)
  t.falsy(data.credentials.name)
  t.deepEqual(data.credentials.scope.sort(), fixtures.targetScope)
})

test('get user data of token – default scopes', (t) => {
  const tkn = fixtures.composeJwt('noScope')
  const data = token.getData(tkn, { clientId: fixtures.common.clientId })

  t.truthy(tkn)
  t.truthy(_.inRange(-1 * data.expiresIn, Date.now()))
  t.is(data.credentials.sub, fixtures.content.expired.sub)
  t.falsy(data.credentials.name)
  t.deepEqual(data.credentials.scope, [])
})
