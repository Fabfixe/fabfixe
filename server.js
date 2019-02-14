require('dotenv').config()
const express = require('express')
const next = require('next')
const cloudinary = require('cloudinary')
const formData = require('express-form-data')
const cors = require('cors')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const CLIENT_ORIGIN = require('./config')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const config = require('./db')

const users = require('./routes/user')

mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => { console.log('Database is connected') },
  err => { console.log('Cannot connect to the database' + err)}
)

app.prepare()
.then(() => {
  const server = express()
  server.use(cors({
    origin: CLIENT_ORIGIN
  }))
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  })



  server.use(formData.parse())

  server.post('/image-upload', (req, res) => {
    const values = Object.values(req.files)
    const promises = values.map((image) => {
      console.log(image.path)
      cloudinary.uploader.upload(image.path)
    })

    Promise
      .all(promises)
      .then(results => res.json(results))
  })

  server.post('/image-upload-single', (req, res) => {
    const path = Object.values(req.files)[0].path
    cloudinary.uploader.upload(path)
      .then(image => res.json([image]))
  })

  // Authentication bit
  server.use(passport.initialize())
  require('./passport')(passport)

  server.use(bodyParser.urlencoded({ extended: false }))
  server.use(bodyParser.json())

  server.use('/api/users', users)
  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
