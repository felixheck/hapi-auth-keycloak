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
  expired: Object.assign({
    exp: 5,
    iat: 1
  }, contentBase),
  current: Object.assign({
    exp: parseInt(Date.now() / 1000) + 60 * 60,
    iat: parseInt(Date.now() / 1000) + 60 * 15
  }, contentBase),
  rpt: Object.assign({
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
  expired: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjUsImFjdGl2ZSI6dHJ1ZSwiaWF0IjoxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvdGVzdG1lIiwic3ViIjoiMTIzNDU2Nzg5MCIsIm5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoiam9obi5kb2VAbWFpbC5jb20iLCJhZG1pbiI6dHJ1ZSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImFkbWluIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19LCJzYW1lIjp7InJvbGVzIjpbImVkaXRvciJdfSwib3RoZXItYXBwIjp7InJvbGVzIjpbIm90aGVyLWFwcDpjcmVhdG9yIl19fX0.ogQQBfeLktd1YqXxL7PwnzeKR-ujVJvLUBEgCKpHPAkEw9xdk8NKMBR_Cpb7pKDLS3HqJFK5n5Q59x59RFJBiDBdlPufZcDTqTFch0zr_LSS4k94zzw4X6dJ1iaMtxB6eN_-JZvsnPh7n2qXeBvXolzz4ReHTdbxvUlXtWUmRUg8zQMyGst2KhVZI3Dgd99FBMhNbNSfIJLSbromw3K-HFB_o3COZgufKDSCIoHlc0xZ8HlPUai5a6qkJDb9jsm-seSpow4UDb6VwmfDQCXGpQoK6eEkrKuOcBWe3UGIGoh4jpxB-1AzwOYJa5I53umpqHI-uvzpcrOuqYria_gojAwM5Z-41qSnQjMyC4-ySpvv0nZclElgVLviZs8H5sat94w7HsRapWkUfHaoKBn3ysjyUiVIg9kjaSFO-NNj4NKyQN0sFI98CQFgKZArxpueRSqspRj2V_r5jMtXw_qjmgqRYsQKX3SKVhg1OFlXR26es__hy3ZY-1TSbL3MNKpDS4Lkw6aHe8-JuPnBzlWQhg6r7d4h973rKl8MSZ35zUb_qAZ07olaMnAsrzPc--fooTsiASNqJQ4UZ63MvJhEajEul1ckrs9NhSll5UXtz16g50sqU2l4XyKia-pbwcipr2Km3uuFIXITvqGty6TKVZiNqwYxfh0aTDtxZIAb-l8',
  defaultExp: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3RpdmUiOnRydWUsInN1YiI6IjEyMzQ1Njc4OTAiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvdGVzdG1lIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huLmRvZUBtYWlsLmNvbSIsImFkbWluIjp0cnVlLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiYWRtaW4iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX0sInNhbWUiOnsicm9sZXMiOlsiZWRpdG9yIl19LCJvdGhlci1hcHAiOnsicm9sZXMiOlsib3RoZXItYXBwOmNyZWF0b3IiXX19fQ.py-g6ZTIwkbFPnPLgJxc97wMXjnuK2ubLJHI2BmkC6XqZFoo4QfL-4FA12Wl3dF42MIzhKndXp4leP-sM_q4WhYlN_ZUW5r7zQeaxgDmIkMeE0RaRMByZdhnV0DKO6nFvbcMdHSaMkXfRTXgYiWInQ3DPtAf_VdOMV-q9Jhmjw4zA7UE4ucH4oET9kT1BpYRWh70_Ekb8SjgrFXSH1CXUI3uRxaeXictw_3PbbR1xoyfx0UW8PnfFYj2wLRh3xdG-ui71qEigvGcy-Bd4-p-a9qZUgeevlkdTV4H4623uyRzxHmC70ydnt2tORyRa3d5Sd5UUO7Cr0tJsMxXjgZllcemUQZ0Jc40LJa7P5tsT_LuKZWvHKtzFnf3ZPo7XDQ0bU5Nuto5aCek0rnZa6Ro0F0ovO8zI84yNytNvcoRqZ3SR5f4dBGLqAKqeJxopCMNQJDNsF1nQNYUiSEpGxjIfRnH8Lee0UZIkC2ORxUTbG7epukyM0-H0htsyKYJIrPaMnuugk26MefRm4JgLOv4GYyoDO5y4uLWtZ6mP979eIBiRg9d-SjAQaIvTPF_UILQIEYTebXFP3oHJf6_XyMymktHTRwaWCtP9zf80gWXGsaUbuxECooVUcpl8f4PzuehX_6QvX_RVCeJzY4z91SPT0rlieF0Orx3XrEWSWGYEno',
  defaultScope: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3RpdmUiOnRydWUsImV4cCI6NSwiaWF0IjoxLCJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huLmRvZUBtYWlsLmNvbSIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hdXRoL3JlYWxtcy90ZXN0bWUiLCJhZG1pbiI6dHJ1ZX0.JjSt0qbgt1p21MrcfCTUEPRWuno3Eu4Uf7k87_FJvumuKclhXtSkE1N_Y24n2JX4Tyjyyrl0Vr1CejFyJkEHUexIVVvrtPFLzkkPE7Jgr4HFsovKKOidg0SIGcrIsP0mDE6RzStzc9DL-mefLmblr7jrMXZTZb5G95MrmI618Dq1zvqXJj6CEjDZmJY8i96N0R4Fws_3m1Vn17hkVHGYZJTnv-3AvSNLckcEm6FDcoO9UEBoZOun9H1M-M5lknzyAoPp9bIk9jf4S-TKMZmsDUCkA8ciRvZEXtB47OSG_N9yfjK2oTt_4R5oZRsXGWGqCGMyDlD87FPk5e9uAilVfRnjLtfPZH-FEJMqzBTvop0EpEa6lAQDvc-5NKfTiBPQrzgNdiBf5Ehd3z05T46z1E3WFlqYOpFSgRe2SUpxoaMuXFiTOJHY4WdZrV9WMFyShSbRiOVLQLF6Myy4A026cpZ72Tr8XIPn5DwnVpDfqdRUZ27J8TROdVKFzNjRc4n215XRegSJhmyLQkdvl3Q2qIThyZOcR0WmXAr8YQM2BtJd2h3dffcXcztngwiU3ESR7T0-gBBzvAQbfCx5WWqY6KlWxL-fNFTXk3ZZSzzIu-MWseYXFr8OiFnYNh7t-P6l-ttLUn0YJuzyvAF2qVKqm-8G1VR35c1aXhGG80Q0sO0',
  current: () => jsonwebtoken.sign(content.current, fs.readFileSync('./test/fixtures/private-rsa.pem'), { algorithm: 'RS256' }),
  rpt: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjUsImFjdGl2ZSI6dHJ1ZSwiaWF0IjoxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvdGVzdG1lIiwic3ViIjoiMTIzNDU2Nzg5MCIsIm5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoiam9obi5kb2VAbWFpbC5jb20iLCJhZG1pbiI6dHJ1ZSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImFkbWluIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19LCJzYW1lIjp7InJvbGVzIjpbImVkaXRvciJdfSwib3RoZXItYXBwIjp7InJvbGVzIjpbIm90aGVyLWFwcDpjcmVhdG9yIl19fSwiYXV0aG9yaXphdGlvbiI6eyJwZXJtaXNzaW9ucyI6W3sic2NvcGVzIjpbImZvby5XUklURSJdLCJyZXNvdXJjZV9zZXRfaWQiOiJlMDg1NWM4Yy0xNWQ5LTQ0M2QtODQ1YS04NmQyMzIzOTIyZmUiLCJyZXNvdXJjZV9zZXRfbmFtZSI6IkFwcCJ9LHsic2NvcGVzIjpbImZvby5SRUFEIl0sInJlc291cmNlX3NldF9pZCI6ImQxZDllNWE5LWUwYWQtNDkxMy05YTM2LWJlMGEzNTE2MjUxMSIsInJlc291cmNlX3NldF9uYW1lIjoiRGVmYXVsdCBSZXNvdXJjZSJ9XX19.j7uHgHkibbUf0q-hSyy-Ec-huSD1oSaMhpfrdZCKW-A5SyPrZos2FZxOf7TyTQ4ROtMaBsZWed8TwEPUR_5CPRnbYGODh5gVI7dP0fpxkUZE2_ao70xCEhfmCaqqOn2Yc-c1msBf5UNRMXy3zgIZd_t_SwJDvlBwk07_ryq6Zepr8kZFaA0JK8yCi-CRsvcihsAsv_TuLy_3VWFzw91VVkG1KdGJiX_rAzxLPojQECxjmKJwPW35QthNdMWoWd0uj0QqOhQppbbYG2YVjvZ-r0BEiEUf8_aljnP8fpgOgV2Fi4oy1aQhat9Nsm-QgpNUXQEA70xi-6WL8jFjvmfXNDtLUjET_Bg-pMNffaIzRUKUWEyQ6N9VQnf1hhEH0YRtpzqCGBuOQPKCQVf6DA6ThLo68Xow-DaXxIm2bQtSTHidFztm4G4I3UQwDG6KPjYabKQkL84qe63BOZ7F0g1xs_YZYB9NXi4-uwiruShr8tBFUsRowA7vY_I7VglpgLOoI9wSLGCDTc3nnTAz7kvIoyxniRkA2NHk_pp1p3wPvLzjqAvfh5O1NtBCQhUbgGGgR3Jp8qvKc2MUsxfMAZYN4WHx9rmZBqoYUpw4i3poAJdza3QWjFa2Hz6enDAWct1l8RrCdY6J6FTsDz-ZRfgSdXFsXy3D3dp1XFtR5Ur7YdQ'
}

module.exports = {
  common,
  clientConfig,
  content,
  jwt
}
