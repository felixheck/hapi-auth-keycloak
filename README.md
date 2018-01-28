# hapi-auth-keycloak
#### JSON Web Token based Authentication powered by Keycloak

[![Travis](https://img.shields.io/travis/felixheck/wurst.svg)](https://travis-ci.org/felixheck/hapi-auth-keycloak/builds/) ![node](https://img.shields.io/node/v/hapi-auth-keycloak.svg) ![npm](https://img.shields.io/npm/dt/hapi-auth-keycloak.svg) [![standard](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/) ![npm](https://img.shields.io/npm/l/hapi-auth-keycloak.svg) [![Coverage Status](https://coveralls.io/repos/github/felixheck/hapi-auth-keycloak/badge.svg?branch=master)](https://coveralls.io/github/felixheck/hapi-auth-keycloak?branch=master)
---

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Usage](#usage)
4. [API](#api)
5. [Example](#example)
6. [Developing and Testing](#developing-and-testing)
7. [Contribution](#contribution)

---

## Introduction
**hapi-auth-keycloak** is a plugin for [hapi.js][hapijs] which enables to protect your endpoints in a smart but professional manner using [Keycloak][keycloak] as authentication service. It is inspired by the related [express.js middleware][keycloak-node]. The plugin validates the passed [`Bearer` token][bearer] offline with a provided public key or online with help of the [Keycloak][keycloak] server. Optionally, the successfully validated tokens and the related user data get cached using [`catbox`][catbox]. The caching enables a fast processing even though the user data don't get changed until the token expires. Furthermore it is possible to enable an api key interceptor proxying the request to an api key service which returns the temporary bearer token. It plays well with the [hapi.js][hapijs]-integrated [authentication/authorization feature][hapi-route-options]. Besides the authentication strategy it is possible to validate tokens by yourself, e.g. to authenticate incoming websocket or queue messages.

The modules [`standard`][standardjs] and [`ava`][avajs] are used to grant a high quality implementation.<br/>
This major release supports just [hapi.js](https://github.com/hapijs/hapi) `>=v17.0.0` and node `>=v8.0.0` — to support older versions please use `v2.1.0`.

## Installation
For installation use the [Node Package Manager][npm]:
```
$ npm install --save hapi-auth-keycloak
```

or clone the repository:
```
$ git clone https://github.com/felixheck/hapi-auth-keycloak
```

## Usage
#### Import
First you have to import the module:
``` js
const authKeycloak = require('hapi-auth-keycloak');
```

#### Create hapi server
Afterwards create your hapi server if not already done:
``` js
const hapi = require('hapi');

const server = hapi.server({ port: 8888 });
```

#### Registration
Finally register the plugin, set the correct options and the authentication strategy:
``` js
await server.register({
  plugin: authKeycloak,
  options: {
    realmUrl: 'https://localhost:8080/auth/realms/testme',
    clientId: 'foobar',
    minTimeBetweenJwksRequests: 15,
    cache: true,
    userInfo: ['name', 'email']
  }
});

server.auth.strategy('keycloak-jwt', 'keycloak-jwt');
```

#### Route Configuration & Scope
Define your routes and add `keycloak-jwt` when necessary. It is possible to define the necessary scope like documented by the [express.js middleware][keycloak-node]:

- To secure an endpoint with a resource's role , use the role name (e.g. `editor`).
- To secure an endpoint with another resource's role, prefix the role name (e.g. `other-resource:creator`)
- To secure an endpoint with a realm role, prefix the role name with `realm:` (e.g. `realm:admin`).
- To secure an endpoint with [fine-grained scope definitions][rpt], prefix the Keycloak scopes with `scope:` (e.g. `scope:foo.READ`).

``` js
server.route([
  {
    method: 'GET',
    path: '/',
    config: {
      description: 'protected endpoint',
      auth: {
        strategies: ['keycloak-jwt'],
        access: {
          scope: ['realm:admin', 'editor', 'other-resource:creator', 'scope:foo.READ']
        }
      },
      handler () {
        return 'hello world';
      }
    }
  },
]);
```

## API
#### Plugin Options

> By default, the Keycloak server has built-in [two ways to authenticate][client-auth] the client: client ID and client secret **(1)**, or with a signed JWT **(2)**. This plugin supports both. If a non-live strategy is used, ensure that the identifier of the related realm key is included in their header as `kid`. Check the description of `secret`/`publicKey`/`entitlement` and the [terminology][rpt-terms] for further information.
>
> | Strategies | Online* | Live** |[Scopes][rpt]  | Truthy Option | Note         |
> |:-----------|:------:|:----:|:-------------:|:---------------|:-------------|
> | (1) + (2)  |        |      |               | `publicKey`    | fast         |
> | (1) + (2)  | x      |      |               |                | flexible     |
> | (1)        | x      | x    |               | `secret`       | accurate     |
> | (1) + (2)  | x      | x    | x             | `entitlement`  | fine-grained |
>
> **\***: Plugin interacts with the Keycloak API<br/>
> **\*\***: Plugin validates token with help of the Keycloak API<br/>
>
> Please mind that the accurate strategy is 4-5x faster than the fine-grained one.<br/>
> **Hint:** If you define neither `secret` nor `public` nor `entitlement`, the plugin retrieves the public key itself from `{realmUrl}/protocol/openid-connect/certs`.

- `realmUrl {string}` – The absolute uri of the Keycloak realm.<br/>
Required. Example: `https://localhost:8080/auth/realms/testme`<br/>

- `clientId {string}` – The identifier of the Keycloak client/application.<br/>
Required. Example: `foobar`<br/>

- `secret {string}` – The related secret of the Keycloak client/application.<br/>
Defining this option enables the traditional method described in the OAuth2 specification and performs an [introspect][introspect] request.<br/>
Optional. Example: `1234-bar-4321-foo`<br/>

- `publicKey {string|Buffer|Object}` – The realm its public key related to the private key used to sign the token.<br/>
Defining this option enables the offline and non-live validation. The public key has to be in [PEM][pem] (`{string|Buffer}`) or [JWK][jwk] (`{Object}`) format. Algorithm has to be `RSA-SHA256` compatible.<br/>
Optional.

- `entitlement {boolean=true}` – The token should be validated with the entitlement API to enable fine-grained authorization. Enabling this option decelerates the process marginally. Mind that `false` is an invalid value.<br/>
Optional. Default: `undefined`.

- `minTimeBetweenJwksRequests {number}` – The minimum time between JWKS requests in seconds.<br/>
This is relevant for the online/non-live strategy retrieving JWKS from the Keycloak server.<br/>
The value have to be a positive integer.<br/>
Optional. Default: `0`.

- `userInfo {Array.<?string>}` — List of properties which should be included in the `request.auth.credentials` object besides `scope` and `sub`.<br/>
Optional. Default: `[]`.

- `cache {Object|boolean}` — The configuration of the [hapi.js cache][hapi-server-cache] powered by [catbox][catbox]. If the property `exp` ('expires at') is undefined, the plugin uses 60 seconds as default TTL. Otherwise the cache entry expires as soon as the token itself expires.<br/>
Please mind that an enabled cache leads to disabled live validation after the related token is cached once.<br/>
If `false` the cache is disabled. Use `true` or an empty object (`{}`) to use the built-in default cache. Otherwise just drop in your own cache configuration.<br/>
Optional. Default: `false`.

- `apiKey {Object}` — The options object enabling an api key service as middleware<br/>
Optional. Default: `undefined`.

  - `url {string}` — The absolute url to be requested. It's possible to use a [`pupa` template][pupa] with placeholders called `realm` and `clientId` getting rendered based on the passed options.<br/>
  Example: `http://barfoo.com/foo/{clientId}`<br/>
  Required.

  - `in {string}` — Whether the api key is placed in the headers or query.<br/>
  Allowed values: `headers` & `query`<br/>
  Optional. Default: `headers`.

  - `name {string}` — The name of the related headers field or query key.<br/>
  Optional. Default: `authorization`.

  - `prefix {string}` — An optional prefix of the related api key value. Mind a trailing space if necessary.<br/>
  Optional. Default: `Api-Key `.

  - `tokenPath {string}` — The path to the access token in the response its body as dot notation.<br/>
  Optional. Default: `access_token`.

  - `request {Object}` – The detailed request options for [`got`][got].<br/>
  Optional. Default: `{}`

#### `await server.kjwt.validate(field {string})`
- `field {string}` — The `Bearer` field, including the scheme (`bearer`) itself.<br/>
Example: `bearer 12345.abcde.67890`.<br/>
Required.

If an error occurs, it gets thrown — so take care and implement a kind of catching.<br/>
If the token is invalid, the `result` is `false`. Otherwise it is an object containing all relevant credentials.

## Example
#### `routes.js`

``` js
async function register (server, options) {
  server.route([
    {
      method: 'GET',
      path: '/',
      config: {
        auth: {
          strategies: ['keycloak-jwt'],
          access: {
            scope: ['realm:admin', 'editor', 'other-resource:creator', 'scope:foo.READ']
          }
        },
        handler (req, reply) {
          reply(req.auth.credentials);
        }
      }
    }
  ]);
}

module.exports = {
  register,
  name: 'example-routes',
  version: '0.0.1'
};
```

#### `index.js`
``` js
const hapi = require('hapi');
const authKeycloak = require('hapi-auth-keycloak');
const routes = require('./routes');

const server = hapi.server({ port: 3000 });

const options = {
  realmUrl: 'https://localhost:8080/auth/realms/testme',
  clientId: 'foobar',
  minTimeBetweenJwksRequests: 15,
  cache: true,
  userInfo: ['name', 'email']
};

process.on('SIGINT', async () => {
  try { 
    await server.stop();
  } catch (err) {
    process.exit(err ? 1 : 0);
  }
});

(async () => {
  try {
    await server.register({ plugin: authKeycloak, options });
    server.auth.strategy('keycloak-jwt', 'keycloak-jwt');
    await server.register({ plugin: routes });
    await server.start();
    console.log('Server started successfully');
  } catch (err) {
    console.error(err);
  }
})();
```

## Developing and Testing
First you have to install all dependencies:
```
$ npm install
```

To execute all unit tests once, use:
```
$ npm test
```

or to run tests based on file watcher, use:
```
$ npm start
```

To get information about the test coverage, use:
```
$ npm run coverage
```

## Contribution
Fork this repository and push in your ideas.

Do not forget to add corresponding tests to keep up 100% test coverage.<br/>
For further information read the [contributing guideline](CONTRIBUTING.md).

[keycloak]: http://www.keycloak.org/
[keycloak-node]: https://keycloak.gitbooks.io/documentation/content/securing_apps/topics/oidc/nodejs-adapter.html
[hapijs]: https://hapijs.com/
[avajs]: https://github.com/avajs/ava
[standardjs]: https://standardjs.com/
[babel]: https://babeljs.io/
[npm]: https://github.com/npm/npm
[jwt]: https://jwt.io/
[catbox]: https://github.com/hapijs/catbox
[bearer]: https://tools.ietf.org/html/rfc6750
[hapi-server-cache]: https://hapijs.com/api#-servercacheoptions
[hapi-route-options]: https://hapijs.com/api#route-options
[jwk]: https://tools.ietf.org/html/rfc7517
[pem]: https://tools.ietf.org/html/rfc1421
[client-auth]: https://keycloak.gitbooks.io/documentation/securing_apps/topics/oidc/java/client-authentication.html
[introspect]: http://www.keycloak.org/docs/2.4/authorization_services_guide/topics/service/protection/token-introspection.html
[rpt]: http://www.keycloak.org/docs/2.4/authorization_services_guide/topics/service/entitlement/entitlement-api-aapi.html
[rpt-terms]: http://www.keycloak.org/docs/2.4/authorization_services_guide/topics/overview/terminology.html
[got]: https://github.com/sindresorhus/got
[pupa]: https://github.com/sindresorhus/pupa
