const test = require('ava')
const helpers = require('./_helpers')

test('throw error if plugin gets registered twice', async (t) => {
  const server = await helpers.getServer(undefined)
  await t.throwsAsync(helpers.registerPlugin(server, undefined, true))
  t.is(Object.keys(server.auth._schemes).length, 1)
})

test('throw error if plugin gets registered twice with different scheme names', async (t) => {
  const server = await helpers.getServer(undefined)
  await t.throwsAsync(helpers.registerPlugin(server, {
    schemeName: 'foobar'
  }, true))

  t.is(Object.keys(server.auth._schemes).length, 2)
})

test('throw error if plugin gets registered twice with different decorator names', async (t) => {
  const server = await helpers.getServer(undefined)
  await t.throwsAsync(helpers.registerPlugin(server, {
    decoratorName: 'fb'
  }, true))

  t.is(Object.keys(server.auth._schemes).length, 1)
})

test('throw no error if plugin gets registered twice with different names', async (t) => {
  const server = await helpers.getServer(undefined)

  await t.notThrowsAsync(helpers.registerPlugin(server, {
    schemeName: 'foobar',
    decoratorName: 'fb'
  }, true))

  t.is(Object.keys(server.auth._schemes).length, 2)
})
