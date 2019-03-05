const express = require('express')
const router = express.Router()

const Profile = require('../models/Profile')
const Expertise = require('../models/Expertise')

router.post('/', function(req, res) {
   Profile.findOne({
    id: req.body.id
  }).then(profile => res.send(profile))
  .catch((err) => {
    console.log('err', err)
  })
  // User.findOne({
  //     email: req.body.email
  // }).then(user => {

})
// To edit database use .remove
// User.find({})
//   .then((user) => {
//       console.log(user)
//   })
//   .catch((err) => {
//     console.log(err)
//   })

module.exports = router
