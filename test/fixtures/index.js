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
  userData: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjUsImFjdGl2ZSI6dHJ1ZSwiaWF0IjoxLCJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huLmRvZUBtYWlsLmNvbSIsImFkbWluIjp0cnVlLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiYWRtaW4iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX0sInNhbWUiOnsicm9sZXMiOlsiZWRpdG9yIl19LCJvdGhlci1hcHAiOnsicm9sZXMiOlsib3RoZXItYXBwOmNyZWF0b3IiXX19fQ.rjQkSo132lPSVUEsuz42oB5u_lW9zCBpvnOyngDYa_0',
  userDataExp: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3RpdmUiOnRydWUsInN1YiI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG4uZG9lQG1haWwuY29tIiwiYWRtaW4iOnRydWUsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJhZG1pbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfSwic2FtZSI6eyJyb2xlcyI6WyJlZGl0b3IiXX0sIm90aGVyLWFwcCI6eyJyb2xlcyI6WyJvdGhlci1hcHA6Y3JlYXRvciJdfX19.0_g0X4cOpOEJ37qwRQzBpouQDn2aEyg0-0jnnWECCsk',
  userDataScope: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3RpdmUiOnRydWUsImV4cCI6NSwiaWF0IjoxLCJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huLmRvZUBtYWlsLmNvbSIsImFkbWluIjp0cnVlfQ.V7lYgZKjnDJcPtUnIBHA9f-8bn8XXB6uH8bXElH-aOU',
  userDataPublicKeyExp: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjUsImlhdCI6MSwic3ViIjoiMTIzNDU2Nzg5MCIsIm5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoiam9obi5kb2VAbWFpbC5jb20iLCJhZG1pbiI6dHJ1ZSwiYWN0aXZlIjp0cnVlLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiYWRtaW4iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX0sInNhbWUiOnsicm9sZXMiOlsiZWRpdG9yIl19LCJvdGhlci1hcHAiOnsicm9sZXMiOlsib3RoZXItYXBwOmNyZWF0b3IiXX19fQ.IgNqnLBKCox3b6KLewV5U_CLfQ79upmT-xkz5XreQ1Jdv1HcAuWcDYeraFnHU29aeU-JJGa7k3VvdbVSwSbFPkkMvjg_lLnqUUcHtuoPqisdbyty-4VRfZp18JnbAUnxlY4R7d-ZEQKPiXp-WBkHOPo5c8FrqATJ7HI7-MkrrKLBgOCmAFrVXto2lp7xmQOnoTy-31Suoj-0hOaIuP2jDRuIwGGigIgtCxxriE0Lzpt2R_wlEfq-0kmMZrgq9F91x-rB6Vg0nbhdtcv4c61nETHdRSqSIuAQzi9lm1mq9Kg67qU7tzaC3pPLkZRd6hMX6fwittVhm9G9SrXLX4rN6QoArEvglfuNX9sIYgEFoD9vqCx1rRCiyx1m55IGgFRLSn_pjOfTBx5Gb5GPlDcCdsNjW0BXLMSzhuPXDsslFFcBHzSYdOFz6hKEU1CVDYjxalq7wDPzMyCORDSSrgZJn_-oirDFaOe3H3ioZzH2x_lfXfbgga7lc5hkU0ZYZfq-1PUrEuqKKFWtDyPhzwcbX-uCno4HiJOuBlRsnJJFnWI0-GNASHUQD-eO4c9a0c2azG7dhH9lnhsHyA_ptLlIqeoPebkl_E88GXmjbHs3qa6anw1ZWn6sEXdlHAZ1ARt8Gc6r_2oOU8VOusgOnnMQdLYHONfbS0sKFNV65uvd01M',
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
