const test = require('ava')
const helpers = require('./_helpers')

test('throw error if plugin gets registered twice', async (t) => {
  const server = await helpers.getServer(undefined)
  await t.throwsAsync(helpers.registerPlugin(server, undefined, true))
})

test('throw error if scheme is used twice with same name', async (t) => {
  const server = await helpers.getServer(undefined)

  t.throws(() => {
    server.auth.strategy('keycloak-jwt', 'keycloak-jwt', helpers.getStrategyOptions({
      name: 'Foobar'
    }))
  })
})

test('throw no error if scheme is used twice', async (t) => {
  const server = await helpers.getServer(undefined)

  t.notThrows(() => {
    server.auth.strategy('keycloak-jwt3', 'keycloak-jwt', helpers.getStrategyOptions({
      name: 'Foobar'
    }))
  })
})
