require('dotenv').config()
const CLIENT_ORIGIN = require('./config')
const express = require('express')
const next = require('next')
const cors = require('cors')
const dev = process.env.ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const formData = require('express-form-data')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const dashboard = require('./pages/api/dashboard')
const User = require('./models/User')
const port = parseInt(process.env.PORT, 10) || 4000
const payments = require('./pages/api/payments')
const cloudinary = require('cloudinary')

app.prepare()
.then(() => {
  const server = express()
  server.use(cors({
    origin: CLIENT_ORIGIN
  }))

  // Profile Image Route Handler
  // server.use('/image-upload-single', profileImage)

  // Update dashboard at 12:00am
  dashboard.start()

  // Authentication Route Handler
  server.use(passport.initialize())
  require('./passport')(passport)

  // Handle payments
  server.use('/api/payments', payments)

  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })
  // server.use(bodyParser.urlencoded({ extended: false }))
  // server.use(bodyParser.json())


  server.all('*', (req, res) => {
     return handle(req, res)
   })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
