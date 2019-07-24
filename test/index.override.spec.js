const test = require('ava')
const hapi = require('@hapi/hapi')
const authKeycloak = require('../src')
const fixtures = require('./fixtures')

test('overrides plugin options properly – same name (NODE_ENV=test)', async (t) => {
  const server = hapi.server({
    port: 1337
  })

  await server.initialize()
  await server.register({
    plugin: authKeycloak,
    options: {
      realmUrl: fixtures.common.realmUrl,
      clientId: fixtures.common.clientId
    }
  })

  server.auth.strategy('keycloak-jwt', 'keycloak-jwt', {})
  server.auth.strategy('keycloak-jwt2', 'keycloak-jwt', {})

  const options = server.kjwt.getOptions()
  t.truthy(options)
  t.is(Object.keys(options).length, 1)
  t.is(Object.keys(options)[0], 'default')
  t.is(Object.values(options)[0].realmUrl, fixtures.common.realmUrl)
  t.is(Object.values(options)[0].clientId, fixtures.common.clientId)
})

test('overrides plugin options properly — apiKey', async (t) => {
  const server = hapi.server({
    port: 1337
  })

  await server.initialize()
  await server.register({
    plugin: authKeycloak,
    options: {
      realmUrl: fixtures.common.realmUrl,
      clientId: fixtures.common.clientId
    }
  })

  server.auth.strategy('keycloak-jwt', 'keycloak-jwt', {
    apiKey: {}
  })

  const options = server.kjwt.getOptions()
  t.truthy(options)
  t.is(Object.keys(options).length, 1)
  t.is(Object.keys(options)[0], 'default')
  t.is(Object.values(options)[0].realmUrl, fixtures.common.realmUrl)
  t.is(Object.values(options)[0].clientId, fixtures.common.clientId)
  t.falsy(Object.values(options)[0].apiKey)
})

test('overrides plugin options properly — different names', async (t) => {
  const server = hapi.server({
    port: 1337
  })

  await server.initialize()
  await server.register({
    plugin: authKeycloak,
    options: {
      realmUrl: fixtures.common.realmUrl,
      clientId: fixtures.common.clientId
    }
  })

  server.auth.strategy('keycloak-jwt', 'keycloak-jwt', {})
  server.auth.strategy('keycloak-jwt2', 'keycloak-jwt', {
    name: 'foobar'
  })

  const options = server.kjwt.getOptions()
  t.truthy(options)
  t.is(Object.keys(options).length, 2)
  t.is(Object.keys(options)[0], 'default')
  t.is(Object.keys(options)[1], 'foobar')
  t.is(Object.values(options)[0].realmUrl, fixtures.common.realmUrl)
  t.is(Object.values(options)[1].realmUrl, fixtures.common.realmUrl)
  t.is(Object.values(options)[0].clientId, fixtures.common.clientId)
  t.is(Object.values(options)[1].clientId, fixtures.common.clientId)
})

test('overrides plugin options properly — different names and clientIds', async (t) => {
  const server = hapi.server({
    port: 1337
  })

  await server.initialize()
  await server.register({
    plugin: authKeycloak,
    options: {
      realmUrl: fixtures.common.realmUrl,
      clientId: fixtures.common.clientId
    }
  })

  server.auth.strategy('keycloak-jwt', 'keycloak-jwt', {})
  server.auth.strategy('keycloak-jwt2', 'keycloak-jwt', {
    name: 'foobar',
    clientId: fixtures.common.clientId.split('').reverse().join('')
  })

  const options = server.kjwt.getOptions()
  t.truthy(options)
  t.is(Object.keys(options).length, 2)
  t.is(Object.keys(options)[0], 'default')
  t.is(Object.keys(options)[1], 'foobar')
  t.is(Object.values(options)[0].realmUrl, fixtures.common.realmUrl)
  t.is(Object.values(options)[1].realmUrl, fixtures.common.realmUrl)
  t.is(Object.values(options)[0].clientId, fixtures.common.clientId)
  t.not(Object.values(options)[1].clientId, fixtures.common.clientId)
  t.is(Object.values(options)[1].clientId, fixtures.common.clientId.split('').reverse().join(''))
})
