const express = require('express')
const router = express.Router()
const validateRegisterInput = require('../validation/register')
const validateLoginInput = require('../validation/login')

const Profile = require('../models/User')

router.post('/', function(req, res) {
  console.log('req.body.username', req)
  Profile.findOne({
    username: req.body.username
  }).then(username => {
    if(username) {
      return res.status(400).json({
        username: 'Username taken'
      })
    }
  })
})



module.exports = router
