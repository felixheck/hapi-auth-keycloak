const test = require('ava')
const helpers = require('./_helpers')

test('throw error if plugin gets registered twice', async (t) => {
  const server = await helpers.getServer(undefined)
  await t.throws(helpers.registerPlugin(server))
})
