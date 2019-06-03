require('dotenv').config()
const CLIENT_ORIGIN = require('./config')
const express = require('express')
const next = require('next')
const cors = require('cors')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const formData = require('express-form-data')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const config = require('./db')


const users = require('./routes/user')
const username = require('./routes/username')
const profileImage = require('./routes/profileImage')
const profiles = require('./routes/profile')
const sessions = require('./routes/sessions')
const ArtistProfile = require('./models/ArtistProfile')
const PupilProfile = require('./models/PupilProfile')
const User = require('./models/User')
const Sessions = require('./models/Sessions')

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

  // Profile Image Route Handler
  server.use('/image-upload-single', profileImage)

  // Authentication Route Handler
  server.use(passport.initialize())
  require('./passport')(passport)

  server.use(bodyParser.urlencoded({ extended: false }))
  server.use(bodyParser.json())

  server.use('/api/users', users)

  server.use('/api/usernames', username)

  server.use('/api/profile', profiles)

  server.use('/api/sessions', sessions)

  server.get('/account/login', (req, res) => {
    return app.render(req, res, '/login', {})
  })

  server.get('/account/joining-as', (req, res) => {
    return app.render(req, res, '/joining-as', {})
  })

  server.get('/about/how-it-works', (req, res) => {
    return app.render(req, res, '/how-it-works', {})
  })

  server.get('/about/artists', (req, res) => {

    return app.render(req, res, '/artists', {})
  })

  server.get('/account/my-sessions', (req, res) => {
    return app.render(req, res, '/my-sessions', {})
  })

  server.get("/join/:accountType", (req, res) => {
    if(req.params.accountType === "artist" || req.params.accountType === "pupil") {
      return app.render(req, res, "/join", { accountType: req.params.accountType })
    } else {
      res.statusCode = 404
      app.render(req, res, '/_error', {})
    }
  })

  server.get("/account/edit-profile/:accountType", (req, res) => {

    if(req.params.accountType === "artist" || req.params.accountType === "pupil") {
      return app.render(req, res, "/edit-profile", { accountType: req.params.accountType })
    } else {
      res.statusCode = 404
      app.render(req, res, '/_error', {})
    }
  })

  server.get('/:username', (req, res) => {
    return app.render(req, res, '/profile', { username: req.params.username })
  })

  server.get('*', (req, res) => {
    // ArtistProfile.deleteMany()
    //   .then((wtv) => console.log(wtv))
    // User.deleteMany()
    //   .then((wtv) => console.log(wtv))
    // Sessions.deleteMany()
    //   .then((wtv) => console.log(wtv))
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
