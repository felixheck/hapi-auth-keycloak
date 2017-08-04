const fs = require('fs')
const jwt = require('jsonwebtoken')
const fixtures = require('./test/fixtures')

const priv = fs.readFileSync('./test/fixtures/private.pem')

const dd = jwt.sign(fixtures.content.userData, priv, {
  algorithm: 'RS256'
})
console.log(dd)
