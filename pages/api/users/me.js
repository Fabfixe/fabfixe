const jwt = require('jsonwebtoken')

export default (req, res) => {
  passport.authenticate('jwt', { session: false })

  return res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  })
})
