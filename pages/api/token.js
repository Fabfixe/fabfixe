const AccessToken = require('twilio').jwt.AccessToken
const VideoGrant = AccessToken.VideoGrant

export default (req, res) => {
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

  try {
    client.video.rooms(_id)
    .fetch()
  }

  catch(e) {
    console.log('error:', e)
    client.video.rooms.create({ uniqueName: _id })
    .then((room) => {
      console.log(room.sid)
    })
    .done()
  }

  // Grant user
  // grant the access token Twilio Video capabilities
  const grant = new VideoGrant({
    room: _id
  })

  token.addGrant(grant)

  res.send({
    identity: identity,
    token: token.toJwt()
  })
}
