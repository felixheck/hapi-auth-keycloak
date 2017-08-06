const fs = require('fs')
const jsonwebtoken = require('jsonwebtoken')

const token = 'abc.def.ghi'
const baseUrl = 'http://localhost:8080'
const realmPath = '/auth/realms/testme'
const introspectPath = '/protocol/openid-connect/token/introspect'
const realmUrl = `${baseUrl}${realmPath}`
const clientId = 'foobar'
const secret = '1234-bar-4321-foo'
const publicKeyBuffer = fs.readFileSync('./test/fixtures/public.pem')
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
  publicKeyBuffer,
  baseUrl,
  token,
  realmPath,
  introspectPath
})

/**
 * @type Object
 * @private
 *
 * Base attributes for JWT generation
 */
const contentBase = {
  'iss': realmUrl,
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

/**
 * @type Object
 * @public
 *
 * Content Parts of JWTs
 */
const content = {
  userData: Object.assign({
    'exp': 5,
    'iat': 1
  }, contentBase),
  userDataNoExp: Object.assign({
    'exp': (Date.now() / 1000) + 60 * 60,
    'iat': (Date.now() / 1000) + 60 * 15
  }, contentBase)
}

/**
 * @type Object
 * @public
 *
 * Various JSON Web Tokens
 */
const jwt = {
  userData: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjUsImFjdGl2ZSI6dHJ1ZSwiaWF0IjoxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvdGVzdG1lIiwic3ViIjoiMTIzNDU2Nzg5MCIsIm5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoiam9obi5kb2VAbWFpbC5jb20iLCJhZG1pbiI6dHJ1ZSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImFkbWluIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19LCJzYW1lIjp7InJvbGVzIjpbImVkaXRvciJdfSwib3RoZXItYXBwIjp7InJvbGVzIjpbIm90aGVyLWFwcDpjcmVhdG9yIl19fX0.1O5g5bFZAvbqCW80vCuzibS8EXzI66zuDZC6j2hhH7E',
  userDataExp: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3RpdmUiOnRydWUsInN1YiI6IjEyMzQ1Njc4OTAiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvdGVzdG1lIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huLmRvZUBtYWlsLmNvbSIsImFkbWluIjp0cnVlLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiYWRtaW4iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX0sInNhbWUiOnsicm9sZXMiOlsiZWRpdG9yIl19LCJvdGhlci1hcHAiOnsicm9sZXMiOlsib3RoZXItYXBwOmNyZWF0b3IiXX19fQ.iOGQQQ9agldi2q5vcwFyGASWsGNRDilCCaDp_3zk5iE',
  userDataScope: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3RpdmUiOnRydWUsImV4cCI6NSwiaWF0IjoxLCJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huLmRvZUBtYWlsLmNvbSIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hdXRoL3JlYWxtcy90ZXN0bWUiLCJhZG1pbiI6dHJ1ZX0.4VD8U-t2JwJywcWhMZ1ZYOYebH5Zat_AV2z1n7uqd24',
  userDataPublicKeyExp: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjUsImlhdCI6MSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2F1dGgvcmVhbG1zL3Rlc3RtZSIsInN1YiI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG4uZG9lQG1haWwuY29tIiwiYWRtaW4iOnRydWUsImFjdGl2ZSI6dHJ1ZSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImFkbWluIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19LCJzYW1lIjp7InJvbGVzIjpbImVkaXRvciJdfSwib3RoZXItYXBwIjp7InJvbGVzIjpbIm90aGVyLWFwcDpjcmVhdG9yIl19fX0.NR_YFbGKP136-AbWnHuRaEGvHH2L_oPFIumJtPCJIMHM8pUscICJVvHq7r8-5XfrnqNFoS9RenuGYE5AZlbD8YNn9kvxowJe1xsdYeu21XMMRhOf-gRN3pB5-zApK8Pl2VwEM4fsMc0iJ1a4Ah45rk7cYOl0igucBUtaIaIic1QZsSJrgAUWLBjoyGEN4tBX5TtF-kyno7MGb1rX3D7TbZMQPeMKXoX1zLyHouALE1mk0oFJk15LVKNLjvvrcS9czk42cUEz0JbU0JLP8rgBuG8OKg_Og42Gk9rLazY6hvYSqArbLrtGukcNmA4_PoWwYtcL73UEIWPb9XrUswR6mM2gPH1em3EOG9nU5Ay0ErhgEhDSgmZoIRp7VMkv9v25_Fh3jrW7AvyUb09xOrFiLE7mAEqsyf440YSO20G8v8lq7iC80eCdvGDUULoPHs8GQXlOD38JPfj2Lxw-YwkKBpUWl0bXe0uMx96X9Ism_gQUXzVjlny8fw7nWhfep9Fna5uSAMb0C0A5car_vTffwVS7w_ptYtp_BML6PZxTJSxjl23D2zuiFpLiFJeJs4dzoyW4b_J6_0-NIIOZElMjklOcngVluSIeGvn3RM-fDdgMnrC09mmc6MVeE9TZHkVI-Q6wkRe2NZ401rYoTcRKcqn1IHux115YZbSMGn92b7Y',
  userDataPublicKey: () => jsonwebtoken.sign(content.userDataNoExp, fs.readFileSync('./test/fixtures/private.pem'), {
    algorithm: 'RS256'
  })
}

module.exports = {
  common,
  clientConfig,
  content,
  jwt
}
