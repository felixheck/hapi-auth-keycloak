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
const clientConfig = {
  realmUrl,
  clientId,
  secret
}

/**
 * @type Object
 * @public
 *
 * Common attributes
 */
const common = Object.assign({}, clientConfig, { token })

/**
 * @type Object
 * @public
 *
 * Content Parts of JWTs
 */
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

module.exports = {
  common,
  clientConfig,
  content,
  jwt
}
