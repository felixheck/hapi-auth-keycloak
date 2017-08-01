const test = require('ava')
const token = require('../src/token')
const fixtures = require('./_fixtures')

test('enable multiple instances', (t) => {
  const tkn1 = token('bearer a.b.c')
  const tkn2 = token('bearer c.b.a')
  t.truthy(tkn1)
  t.truthy(tkn2)
  t.is(tkn1.get(), 'a.b.c')
  t.is(tkn2.get(), 'c.b.a')
})

test('get bearer token – lowercase', (t) => {
  const tkn = token('bearer a.b.c')
  t.truthy(tkn)
  t.is(tkn.get(), 'a.b.c')
})

test('get bearer token – uppercase', (t) => {
  const tkn = token('Bearer a.b.c')
  t.truthy(tkn)
  t.is(tkn.get(), 'a.b.c')
})

test('get bearer token – capitalcase', (t) => {
  const tkn = token('BEARER a.b.c')
  t.truthy(tkn)
  t.is(tkn.get(), 'a.b.c')
})

test('get no bearer token – wrong scheme', (t) => {
  const tkn = token('beareer a.b.c')
  t.falsy(tkn)
})

test('get no bearer token – multiple spaces', (t) => {
  const tkn = token('bearer  a.b.c')
  t.falsy(tkn)
})

test('get no bearer token – too less segments', (t) => {
  const tkn = token('bearer  a.b')
  t.falsy(tkn)
})

test('get no bearer token – spaces between', (t) => {
  const tkn = token('bearer  a.b.c c')
  t.falsy(tkn)
})

test('get decoded content part of token', (t) => {
  const jwt = `bearer ${fixtures.jwt.userData}`
  const tkn = token(jwt)

  t.deepEqual(tkn.getContent(), fixtures.content.userData)
})

test('get user data of token', (t) => {
  const jwt = `bearer ${fixtures.jwt.userData}`
  const tkn = token(jwt)
  const data = tkn.getData()

  t.truthy(data)
  t.is(data.expiresIn, 4000)
  t.is(data.credentials.sub, fixtures.content.userData.sub)
  t.falsy(data.credentials.name)
  t.deepEqual(data.credentials.scope.sort(), ['editor', 'other-app:creator', 'realm:admin'])
})

test('get user data of token – additional fields', (t) => {
  const jwt = `bearer ${fixtures.jwt.userData}`
  const tkn = token(jwt)
  const data = tkn.getData(['name'])

  t.truthy(data)
  t.is(data.expiresIn, 4000)
  t.is(data.credentials.sub, fixtures.content.userData.sub)
  t.is(data.credentials.name, fixtures.content.userData.name)
  t.deepEqual(data.credentials.scope.sort(), ['editor', 'other-app:creator', 'realm:admin'])
})

test('get user data of token – default expiration', (t) => {
  const jwt = `bearer ${fixtures.jwt.userDataExp}`
  const tkn = token(jwt)
  const data = tkn.getData()

  t.truthy(data)
  t.is(data.expiresIn, 60000)
  t.deepEqual(data.credentials.scope.sort(), ['editor', 'other-app:creator', 'realm:admin'])
})
