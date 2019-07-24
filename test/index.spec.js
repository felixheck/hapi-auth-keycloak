const test = require('ava')
const helpers = require('./_helpers')

test('throw error if plugin gets registered twice', async (t) => {
  const server = await helpers.getServer(undefined)
  await t.throwsAsync(helpers.registerPlugin(server, undefined, true))
  t.is(Object.keys(server.auth._schemes).length, 1)
})

test('throw error if scheme is used twice with same name', async (t) => {
  const server = await helpers.getServer(undefined)

  t.throws(() => {
    server.auth.strategy('keycloak-jwt', 'keycloak-jwt', helpers.getStrategyOptions({
      name: 'Foobar'
    }))
  })

  t.is(Object.keys(server.auth._schemes).length, 1)
  t.is(Object.keys(server.auth._strategies).length, 1)
})

test('throw no error if scheme is used twice', async (t) => {
  const server = await helpers.getServer(undefined)

  t.notThrows(() => {
    server.auth.strategy('keycloak-jwt2', 'keycloak-jwt', helpers.getStrategyOptions({
      name: 'Foobar'
    }))
  })

  t.is(Object.keys(server.auth._schemes).length, 1)
  t.is(Object.keys(server.auth._strategies).length, 2)
})
