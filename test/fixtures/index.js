const fs = require('fs')
const jsonwebtoken = require('jsonwebtoken')

const token = 'abc.def.ghi'
const baseUrl = 'http://localhost:8080'
const clientId = 'foobar'
const secret = '1234-bar-4321-foo'
const realmPath = '/auth/realms/testme'
const introspectPath = '/protocol/openid-connect/token/introspect'
const entitlementPath = `/authz/entitlement/${clientId}`
const realmUrl = `${baseUrl}${realmPath}`
const publicKeyBuffer = fs.readFileSync('./test/fixtures/public-rsa.pem')
const publicKeyRsa = publicKeyBuffer.toString()
const publicKey = fs.readFileSync('./test/fixtures/public.pem')
const publicKeyCert = fs.readFileSync('./test/fixtures/public.cert')
const publicKeyJwk = {
  kty: 'RSA',
  n: 'ALq_ejKEGv25YOXiRapjf_1eKEIymgSZeihL1khgFYEZtj7JxSswiSvWia1IxE0uO9_8enwB18heUCrp-mrzcaVrNlc8JTuLfAYthKUltsNJXndjs0fzBQmFF9QYNNDly5nYdJL3pgAR10ji-GbOJzfea6--ybHRup7cpVprZ2ZaH8ksC4xa1wdiRabp5eJ-3he8vLw-GcsnL4vsZfjrjAOqqJi0JnyAxdKiYdEDLf8YeggeKKCuWhculRzkVOYEujKEoCe_GT4apimskXelNK4Qzqu21olcpJLUz3QdV_2JTG0B6J8qmdM9rIe3u6Ja6FHRNRbA4tEncVdmc733_CCD0hk--IELmlOG7qFVKTI0nVw3ycPZuIv5obGcF9fzFFPDqtQLAR3YE5DVWlcBXOmewKiUhlv5sTCkKrKTq_vwQDPKZ8OQQkf0Z2QSXzIwGIkoeq1WLhFlAQS4GViETQDMkcEvDrVsQA3zgbVcJ_H5sPLHIa6PVw9e1XKk3Y5UtTJK-92aA9RmoFmb7kjms9j9D4Z32qUVBdSpG44528sy6X0_DIKL78QUCQyHEWC-aHrV7v_1eazQK9J2uMzAZDzotwK6RafmeGCrpWJkhBv_9teqy5s45VihJB9Tit_Y3XQ6zE4nZcQymPkx4XskAT2eqRX2yhDOdvNYJWI5HkKR',
  e: 'AQAB'
}

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
  publicKeyRsa,
  publicKeyCert,
  publicKeyBuffer,
  publicKeyJwk,
  baseUrl,
  token,
  realmPath,
  introspectPath,
  entitlementPath
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
    exp: 5,
    iat: 1
  }, contentBase),
  userDataNoExp: Object.assign({
    exp: parseInt(Date.now() / 1000) + 60 * 60,
    iat: parseInt(Date.now() / 1000) + 60 * 15
  }, contentBase),
  userDataRpt: Object.assign({
    authorization: {
      permissions: {
        scopes: ['foo.READ', 'foo.WRITE']
      }
    }
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
  userDataPublicKey: () => jsonwebtoken.sign(content.userDataNoExp, fs.readFileSync('./test/fixtures/private-rsa.pem'), {
    algorithm: 'RS256'
  }),
  userDataRpt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjUsImFjdGl2ZSI6dHJ1ZSwiaWF0IjoxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvdGVzdG1lIiwic3ViIjoiMTIzNDU2Nzg5MCIsIm5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoiam9obi5kb2VAbWFpbC5jb20iLCJhZG1pbiI6dHJ1ZSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImFkbWluIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19LCJzYW1lIjp7InJvbGVzIjpbImVkaXRvciJdfSwib3RoZXItYXBwIjp7InJvbGVzIjpbIm90aGVyLWFwcDpjcmVhdG9yIl19fSwiYXV0aG9yaXphdGlvbiI6eyJwZXJtaXNzaW9ucyI6W3sic2NvcGVzIjpbImZvby5XUklURSJdLCJyZXNvdXJjZV9zZXRfaWQiOiJlMDg1NWM4Yy0xNWQ5LTQ0M2QtODQ1YS04NmQyMzIzOTIyZmUiLCJyZXNvdXJjZV9zZXRfbmFtZSI6IkFwcCJ9LHsic2NvcGVzIjpbImZvby5SRUFEIl0sInJlc291cmNlX3NldF9pZCI6ImQxZDllNWE5LWUwYWQtNDkxMy05YTM2LWJlMGEzNTE2MjUxMSIsInJlc291cmNlX3NldF9uYW1lIjoiRGVmYXVsdCBSZXNvdXJjZSJ9XX19.EV0KFd388EGtaiuywlT3newm3_ka7jS_fSIGPq2JC3Q'
}

module.exports = {
  common,
  clientConfig,
  content,
  jwt
}
