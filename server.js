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

// const users = require('./pages/api/user')
// const username = require('./pages/api/username')
// const profileImage = require('./pages/api/profileImage')
// const profiles = require('./pages/api/profile')
// const sessions = require('./pages/api/sessions')
// const payments = require('./pages/api/payments')
// const token = require('./pages/api/token')
// const sessionEvents = require('./pages/api/sessionEvents')
// const ArtistProfile = require('./models/ArtistProfile')
// const PupilProfile = require('./models/PupilProfile')

const emails = require('./pages/api/emails')
const dashboard = require('./pages/api/dashboard')

const User = require('./models/User')
// const Sessions = require('./models/Sessions')

app.prepare()
.then(() => {
  const server = express()
  server.use(cors({
    origin: CLIENT_ORIGIN
  }))

  // Profile Image Route Handler
  // server.use('/image-upload-single', profileImage)

  // Authentication Route Handler
  server.use(passport.initialize())
  require('./passport')(passport)

  // server.use(bodyParser.urlencoded({ extended: false }))
  // server.use(bodyParser.json())

  // server.use('/api/users', users)
  //
  // server.use('/api/usernames', username)
  //
  // server.use('/api/profile', profiles)
  //
  // server.use('/api/sessions', sessions)
  //
  //
  // server.use('/api/payments', payments)
  //
  // server.use('/api/token', token)
  //
  // server.use('/api/sessionEvents', sessionEvents)
  server.use('/api/emails', emails)

  server.use('/api/dashboard', dashboard)

  // server.get('/', (req, res) => {
  //   return app.render(req, res, '/index', {})
  // })
  //
  // server.get('*', (req, res) => {
  //   return handle(req, res)
  // })

  server.all('*', (req, res) => {
     return handle(req, res)
   })

  server.listen(4000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:4000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
