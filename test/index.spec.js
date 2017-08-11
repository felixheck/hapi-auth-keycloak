const test = require('ava')
const helpers = require('./_helpers')

test.cb('throw error if plugin gets registered twice', (t) => {
  helpers.getServer(undefined, (server) => {
    t.throws(() => helpers.registerPlugin(server), Error)
    t.end()
  })
})
