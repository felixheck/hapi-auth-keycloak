const test = require('ava')
const { getServer } = require('./_helpers')
const cache = require('../src/cache')

test.afterEach('reset cache', () => {
  cache.reset()
})

test.cb.serial('just create one instance – object', (t) => {
  getServer(false, (server) => {
    const cch1 = cache.init(server, { segment: 'foo' })
    const cch2 = cache.init(server, { segment: 'foo' })

    t.truthy(cch1)
    t.truthy(cch2)
    t.deepEqual(cch1, cch2)
    t.end()
  })
})

test.cb.serial('just create one instance – boolean', (t) => {
  getServer(false, (server) => {
    const cch1 = cache.init(server, false)
    const cch2 = cache.init(server, false)

    t.is(cch1, false)
    t.is(cch2, false)
    t.is(cch1, cch2)
    t.end()
  })
})

test.cb.serial('set and get value', (t) => {
  getServer(false, (server) => {
    cache.init(server, { segment: 'foo' })
    cache.set('bar', 42, 10000)

    cache.get('bar', (err, res) => {
      t.falsy(err)
      t.is(res, 42)
      t.end()
    })
  })
})

test.cb.serial('set and get value – no cache', (t) => {
  getServer(false, (server) => {
    cache.init(server, false)
    cache.set('bar', 42, 10000)

    cache.get('bar', (err, res) => {
      t.falsy(err)
      t.is(res, false)
      t.end()
    })
  })
})

test.cb.serial('set and get value – expired', (t) => {
  getServer(false, (server) => {
    cache.init(server, { segment: 'foo' })
    cache.set('bar', 42, 100)

    setTimeout(() => {
      cache.get('bar', (err, res) => {
        t.falsy(err)
        t.is(res, null)
        t.end()
      })
    }, 200)
  })
})
