const test = require('ava')
const helpers = require('./_helpers')
const cache = require('../src/cache')

test('set and get value', async (t) => {
  const server = await helpers.getServer(undefined)
  const store = cache.create(server, { segment: 'foo' })

  await cache.set(store, 'bar', 42, 10000)
  t.is(await cache.get(store, 'bar'), 42)
})

test('set and get value – true/defaults', async (t) => {
  const server = await helpers.getServer(undefined)
  const store = cache.create(server, true)

  await cache.set(store, 'bar', 42, 10000)
  t.is(await cache.get(store, 'bar'), 42)
})

test('set and get value – no cache', async (t) => {
  const server = await helpers.getServer(undefined)
  const store = cache.create(server, false)

  await cache.set(store, 'bar', 42, 10000)
  t.is(await cache.get(store, 'bar'), false)
})

test('set and get value – no cache/default', async (t) => {
  const server = await helpers.getServer(undefined)
  const store = cache.create(server)

  await cache.set(store, 'bar', 42, 10000)
  t.is(await cache.get(store, 'bar'), false)
})

test('set and get value – expired', async (t) => {
  const server = await helpers.getServer(undefined)
  const store = cache.create(server, { segment: 'foo' })

  await cache.set(store, 'bar', 42, 0)
  t.is(await cache.get(store, 'bar'), null)
})
