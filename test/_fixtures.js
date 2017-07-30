const token = 'abc.def.ghi'
const realmUrl = 'https://localhost:8080/auth/realms/testme'
const clientId = 'foobar'

/**
 * @type Object
 * @public
 *
 * Client config
 */
const config = {
  realmUrl,
  clientId,
  secret: 'barfoo'
}

/**
 * @type Object
 * @public
 *
 * Various JSON Web Tokens
 */
const jwt = {
  content: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ',
  userData: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjUsImlhdCI6MSwic3ViIjoiMTIzNDU2Nzg5MCIsIm5hbWUiOiJKb2huIERvZSIsImFkbWluIjp0cnVlLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiYWRtaW4iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX0sInNhbWUiOnsicm9sZXMiOlsiZWRpdG9yIl19LCJvdGhlci1hcHAiOnsicm9sZXMiOlsib3RoZXItYXBwOmNyZWF0b3IiXX19fQ._yxUAslOcgCp2Fd2xyO0q3iB24brG8PqqXQ-TCblQ1w',
  userDataExp: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJhZG1pbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfSwic2FtZSI6eyJyb2xlcyI6WyJlZGl0b3IiXX0sIm90aGVyLWFwcCI6eyJyb2xlcyI6WyJvdGhlci1hcHA6Y3JlYXRvciJdfX19.Q49BbBtcemvPaDfXyroyuoR56_rbq_pADXeC0ABXyZc'
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
  config,
  jwt,
  validation,
  userInfo
}
