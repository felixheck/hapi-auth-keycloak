const token = 'abc.def.ghi'
const baseUrl = 'http://localhost:8080'
const realmPath = '/auth/realms/testme'
const introspectPath = '/protocol/openid-connect/token/introspect'
const realmUrl = `${baseUrl}${realmPath}`
const clientId = 'foobar'
const secret = '1234-bar-4321-foo'
const publicKey = `-----BEGIN RSA PUBLIC KEY-----
MIICCgKCAgEAur96MoQa/blg5eJFqmN//V4oQjKaBJl6KEvWSGAVgRm2PsnFKzCJ
K9aJrUjETS473/x6fAHXyF5QKun6avNxpWs2VzwlO4t8Bi2EpSW2w0led2OzR/MF
CYUX1Bg00OXLmdh0kvemABHXSOL4Zs4nN95rr77JsdG6ntylWmtnZlofySwLjFrX
B2JFpunl4n7eF7y8vD4Zyycvi+xl+OuMA6qomLQmfIDF0qJh0QMt/xh6CB4ooK5a
Fy6VHORU5gS6MoSgJ78ZPhqmKayRd6U0rhDOq7bWiVykktTPdB1X/YlMbQHonyqZ
0z2sh7e7olroUdE1FsDi0SdxV2Zzvff8IIPSGT74gQuaU4buoVUpMjSdXDfJw9m4
i/mhsZwX1/MUU8Oq1AsBHdgTkNVaVwFc6Z7AqJSGW/mxMKQqspOr+/BAM8pnw5BC
R/RnZBJfMjAYiSh6rVYuEWUBBLgZWIRNAMyRwS8OtWxADfOBtVwn8fmw8schro9X
D17VcqTdjlS1Mkr73ZoD1GagWZvuSOaz2P0PhnfapRUF1KkbjjnbyzLpfT8Mgovv
xBQJDIcRYL5oetXu//V5rNAr0na4zMBkPOi3ArpFp+Z4YKulYmSEG//216rLmzjl
WKEkH1OK39jddDrMTidlxDKY+THheyQBPZ6pFfbKEM5281glYjkeQpECAwEAAQ==
-----END RSA PUBLIC KEY-----`

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
const common = Object.assign({}, clientConfig, {
  publicKey,
  baseUrl,
  token,
  realmPath,
  introspectPath
})

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
    'active': true,
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
  userData: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjUsImFjdGl2ZSI6dHJ1ZSwiaWF0IjoxLCJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huLmRvZUBtYWlsLmNvbSIsImFkbWluIjp0cnVlLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiYWRtaW4iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX0sInNhbWUiOnsicm9sZXMiOlsiZWRpdG9yIl19LCJvdGhlci1hcHAiOnsicm9sZXMiOlsib3RoZXItYXBwOmNyZWF0b3IiXX19fQ.rjQkSo132lPSVUEsuz42oB5u_lW9zCBpvnOyngDYa_0',
  userDataExp: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3RpdmUiOnRydWUsInN1YiI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG4uZG9lQG1haWwuY29tIiwiYWRtaW4iOnRydWUsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJhZG1pbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfSwic2FtZSI6eyJyb2xlcyI6WyJlZGl0b3IiXX0sIm90aGVyLWFwcCI6eyJyb2xlcyI6WyJvdGhlci1hcHA6Y3JlYXRvciJdfX19.0_g0X4cOpOEJ37qwRQzBpouQDn2aEyg0-0jnnWECCsk',
  userDataScope: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3RpdmUiOnRydWUsImV4cCI6NSwiaWF0IjoxLCJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huLmRvZUBtYWlsLmNvbSIsImFkbWluIjp0cnVlfQ.V7lYgZKjnDJcPtUnIBHA9f-8bn8XXB6uH8bXElH-aOU'
}

module.exports = {
  common,
  clientConfig,
  content,
  jwt
}
