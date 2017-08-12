const test = require('ava')
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
  const jwt = `bearer ${fixtures.jwt.current()}`
  const tkn = token.create(jwt)
  const data = token.getData(tkn)

  t.truthy(tkn)
  t.is(data.expiresIn, 2700000)
  t.is(data.credentials.sub, fixtures.content.current.sub)
  t.falsy(data.credentials.name)
  t.deepEqual(data.credentials.scope.sort(), ['editor', 'other-app:creator', 'realm:admin'])
})

test('get user data of token – rpt', (t) => {
  const jwt = `bearer ${fixtures.jwt.rpt}`
  const tkn = token.create(jwt)
  const data = token.getData(tkn)

  t.truthy(tkn)
  t.is(data.expiresIn, 4000)
  t.is(data.credentials.sub, fixtures.content.rpt.sub)
  t.falsy(data.credentials.name)
  t.deepEqual(data.credentials.scope.sort(), ['editor', 'other-app:creator', 'realm:admin', 'scope:foo.READ', 'scope:foo.WRITE'])
})

test('get user data of token – additional fields', (t) => {
  const jwt = `bearer ${fixtures.jwt.current()}`
  const tkn = token.create(jwt)
  const data = token.getData(tkn, ['name'])

  t.truthy(tkn)
  t.is(data.expiresIn, 2700000)
  t.is(data.credentials.sub, fixtures.content.current.sub)
  t.is(data.credentials.name, fixtures.content.current.name)
  t.deepEqual(data.credentials.scope.sort(), ['editor', 'other-app:creator', 'realm:admin'])
})

test('get user data of token – default expiration', (t) => {
  const jwt = `bearer ${fixtures.jwt.defaultExp}`
  const tkn = token.create(jwt)
  const data = token.getData(tkn)

  t.truthy(tkn)
  t.is(data.expiresIn, 60000)
  t.is(data.credentials.sub, fixtures.content.expired.sub)
  t.falsy(data.credentials.name)
  t.deepEqual(data.credentials.scope.sort(), ['editor', 'other-app:creator', 'realm:admin'])
})

test('get user data of token – default scopes', (t) => {
  const jwt = `bearer ${fixtures.jwt.defaultScope}`
  const tkn = token.create(jwt)
  const data = token.getData(tkn)

  t.truthy(tkn)
  t.is(data.expiresIn, 4000)
  t.is(data.credentials.sub, fixtures.content.expired.sub)
  t.falsy(data.credentials.name)
  t.deepEqual(data.credentials.scope, [])
})
