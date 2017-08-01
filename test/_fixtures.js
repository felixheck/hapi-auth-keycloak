const token = 'abc.def.ghi'
const realmUrl = 'https://localhost:8080/auth/realms/testme'
const clientId = 'foobar'
const secret = '1234-bar-4321-foo'

/**
 * @type Object
 * @public
 *
 * Client config
 */
const config = {
  realmUrl,
  clientId,
  secret
}

const content = {
  userData: {
    'exp': 5,
    'iat': 1,
    'sub': '1234567890',
    'name': 'John Doe',
    'email': 'john.doe@mail.com',
    'admin': true,
    'realm_access': {
      'roles': [
        'admin'
      ]
    },
    'resource_access': {
      'account': {
        'roles': [
          'manage-account',
          'manage-account-links',
          'view-profile'
        ]
      },
      'same': {
        'roles': [
          'editor'
        ]
      },
      'other-app': {
        'roles': [
          'other-app:creator'
        ]
      }
    }
  }
}

/**
 * @type Object
 * @public
 *
 * Various JSON Web Tokens
 */
const jwt = {
  userData: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjUsImlhdCI6MSwic3ViIjoiMTIzNDU2Nzg5MCIsIm5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoiam9obi5kb2VAbWFpbC5jb20iLCJhZG1pbiI6dHJ1ZSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImFkbWluIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19LCJzYW1lIjp7InJvbGVzIjpbImVkaXRvciJdfSwib3RoZXItYXBwIjp7InJvbGVzIjpbIm90aGVyLWFwcDpjcmVhdG9yIl19fX0.uuhtpYNVtFZvPuRAEktWEDn_2u-dvimWnspXVt-gObU',
  userDataExp: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huLmRvZUBtYWlsLmNvbSIsImFkbWluIjp0cnVlLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiYWRtaW4iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX0sInNhbWUiOnsicm9sZXMiOlsiZWRpdG9yIl19LCJvdGhlci1hcHAiOnsicm9sZXMiOlsib3RoZXItYXBwOmNyZWF0b3IiXX19fQ.BcTtSEpyiUVBVkUOwVDM0_T9UIy-vk2aaUAR8XM6Hd0',
  userDataScope: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjUsImlhdCI6MSwic3ViIjoiMTIzNDU2Nzg5MCIsIm5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoiam9obi5kb2VAbWFpbC5jb20iLCJhZG1pbiI6dHJ1ZX0.2tfThhgwSbIEq2cZcoHSRwL2-UCanF23BXlyphm5ehs'
}

/**
 * @type Object
 * @public
 *
 * Succeeded validations response
 */
const validation = {
  'jti': '918c5d0e-1924-40e3-9fc6-b5cfd0016e1a',
  'exp': Date.now() * 1000 + 60000,
  'nbf': 0,
  'iat': Date.now() * 1000,
  'iss': 'https://localhost:8080/auth/realms/testme',
  'aud': 'testme-app',
  'sub': '5b220cee-48c2-47b9-8c53-2cac94eed51d',
  'typ': 'Bearer',
  'azp': 'testme-app',
  'auth_time': 0,
  'session_state':
    '08f140bb-7801-47c1-9202-3d8a805e359a',
  'name': 'Foo Bar',
  'preferred_username': 'foobar',
  'given_name': 'Foo',
  'family_name': 'Bar',
  'email': 'foo.bar@42.com',
  'acr': '1',
  'client_session': '8d36c537-1d12-4c47-8032-cfd26d0133b0',
  'allowed-origins': [],
  'realm_access': {
    'roles': ['admin']
  },
  'resource_access': {
    'other-app': {
      'roles': ['other-app:creator']
    },
    'testme-app': {
      'roles': ['editor']
    },
    'account': {
      'roles': ['manage-account', 'manage-account-links', 'view-profile']
    }
  },
  'client_id': 'testme-app',
  'username': 'foobar',
  'active': true
}

/**
 * @type Object
 * @public
 *
 * Succeeded userInfo response
 */
const userInfo = {
  'sub': '5b220cee-48c2-47b9-8c53-2cac94eed51d',
  'name': 'Foo Bar',
  'preferred_username': 'foobar',
  'given_name': 'Foo',
  'family_name': 'Bar',
  'email': 'foo.bar@42.com'
}

module.exports = {
  token,
  realmUrl,
  clientId,
  secret,
  config,
  content,
  jwt,
  validation,
  userInfo
}
