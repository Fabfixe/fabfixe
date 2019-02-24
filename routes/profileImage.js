require('dotenv').config()
const express = require('express')
const router = express.Router()
const cloudinary = require('cloudinary')
const formData = require('express-form-data')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

router.use(formData.parse())


router.post('/image-upload', (req, res) => {
  const values = Object.values(req.files)
  const promises = values.map((image) => {
    cloudinary.uploader.upload(image.path)
  })

  Promise
    .all(promises)
    .then(results => res.json(results))
})

router.post('/', function(req, res) {
  const path = Object.values(req.files)[0].path

  cloudinary.uploader.upload(path)
    .then(image => res.json([image]))
})

module.exports = router
