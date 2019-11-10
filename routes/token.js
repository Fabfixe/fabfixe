const express = require('express')
const router = express.Router()
let AccessToken = require('twilio').jwt.AccessToken
let VideoGrant = AccessToken.VideoGrant

router.post('/', function(req, res) {
  const { identity, _id } = req.body
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const apiKey = process.env.TWILIO_API_KEY
  const apiSecret = process.env.TWILIO_API_SECRET
  const authToken = process.env.TWILIO_AUTH_TOKEN

  let token = new AccessToken(
    accountSid,
    apiKey,
    apiSecret,
  )

  token.identity = identity

  const client = require('twilio')(accountSid, authToken)

  client.video.rooms(_id)
  .fetch()
  .catch((e) => {
    console.log('error:', e)
    client.video.rooms.create({ uniqueName: _id })
    .then((room) => {
      console.log(room.sid)
    })
    .done()
  })

  // Grant user
  // grant the access token Twilio Video capabilities
  const grant = new VideoGrant({
    room: _id
  })

  // grant.configurationProfileSid = process.env.TWILIO_CONFIGURATION_SID;
  token.addGrant(grant)

  res.send({
    identity: identity,
    token: token.toJwt()
  })
})

module.exports = router
