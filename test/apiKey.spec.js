const test = require('ava')
const apiKey = require('../src/apiKey')

test('Get endpoint url without any changes', (t) => {
  t.is(apiKey.parseUrl({
    apiKey: { url: 'http://barfoo.com/foo/bar' },
    clientId: 'bar',
    realmUrl: 'http://foobar.com/foo/bar'
  }), 'http://barfoo.com/foo/bar')
})

test('Get endpoint url with replaced `clientId`', (t) => {
  t.is(apiKey.parseUrl({
    apiKey: { url: 'http://barfoo.com/foo/{clientId}' },
    clientId: 'bar',
    realmUrl: 'http://foobar.com/foo/bar'
  }), 'http://barfoo.com/foo/bar')
})

test('Get endpoint url with replaced `realm`', (t) => {
  t.is(apiKey.parseUrl({
    apiKey: { url: 'http://barfoo.com/foo/{realm}' },
    clientId: 'bar',
    realmUrl: 'http://foobar.com/foo/bar'
  }), 'http://barfoo.com/foo/bar')
})

test('Get endpoint url with replaced unknown placeholder', (t) => {
  t.is(apiKey.parseUrl({
    apiKey: { url: 'http://barfoo.com/foo/{foobar}' },
    clientId: 'bar',
    realmUrl: 'http://foobar.com/foo/bar'
  }), 'http://barfoo.com/foo/')
})

test('Get no api key if there is neither header nor query', (t) => {
  const req = {
    headers: {},
    query: {}
  }

  const options = {
    in: 'headers',
    name: 'authorization',
    prefix: 'Api-Key '
  }

  t.false(apiKey.getApiKey(req, options))
})

test('Get no api key if value is not prefixed', (t) => {
  const req = {
    headers: {
      authorization: 'foobar'
    },
    query: {}
  }

  const options = {
    in: 'headers',
    name: 'authorization',
    prefix: 'Api-Key '
  }

  t.false(apiKey.getApiKey(req, options))
})

test('Get api key if there is there is a prefixed value', (t) => {
  const req = {
    headers: {
      authorization: 'Api-Key foobar'
    },
    query: {}
  }

  const options = {
    in: 'headers',
    name: 'authorization',
    prefix: 'Api-Key '
  }

  const result = apiKey.getApiKey(req, options)

  t.truthy(result)
  t.is(result, 'Api-Key foobar')
})

test('Get no request options because of missing api key', (t) => {
  const req = {
    headers: {},
    query: {}
  }

  const options = {
    in: 'headers',
    name: 'authorization',
    prefix: 'Api-Key ',
    request: {}
  }

  t.false(apiKey.getRequestOptions(req, options))
})

test('Get request options with updated header', (t) => {
  const req = {
    headers: {
      authorization: 'Api-Key foobar'
    },
    query: {}
  }

  const options = {
    in: 'headers',
    name: 'authorization',
    prefix: 'Api-Key ',
    request: {
      foo: 'bar'
    }
  }

  t.deepEqual(apiKey.getRequestOptions(req, options), {
    foo: 'bar',
    headers: {
      authorization: 'Api-Key foobar'
    }
  })
})

test('Get request options with updated query', (t) => {
  const req = {
    query: {
      authorization: 'Api-Key foobar'
    },
    headers: {}
  }

  const options = {
    in: 'query',
    name: 'authorization',
    prefix: 'Api-Key ',
    request: {
      foo: 'bar'
    }
  }

  t.deepEqual(apiKey.getRequestOptions(req, options), {
    foo: 'bar',
    query: {
      authorization: 'Api-Key foobar'
    }
  })
})

test('Get request options with deeply updated header', (t) => {
  const req = {
    headers: {
      authorization: 'Api-Key foobar'
    },
    query: {}
  }

  const options = {
    in: 'headers',
    name: 'authorization',
    prefix: 'Api-Key ',
    request: {
      foo: 'bar',
      headers: {
        'x-foo': 'bar'
      }
    }
  }

  t.deepEqual(apiKey.getRequestOptions(req, options), {
    foo: 'bar',
    headers: {
      authorization: 'Api-Key foobar',
      'x-foo': 'bar'
    }
  })
})

test('Get request options with deeply updated query', (t) => {
  const req = {
    query: {
      authorization: 'Api-Key foobar'
    },
    headers: {}
  }

  const options = {
    in: 'query',
    name: 'authorization',
    prefix: 'Api-Key ',
    request: {
      foo: 'bar',
      query: {
        'x-foo': 'bar'
      }
    }
  }

  t.deepEqual(apiKey.getRequestOptions(req, options), {
    foo: 'bar',
    query: {
      authorization: 'Api-Key foobar',
      'x-foo': 'bar'
    }
  })
})
