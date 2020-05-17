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

const users = require('./routes/user')
const username = require('./routes/username')
const profileImage = require('./routes/profileImage')
const profiles = require('./routes/profile')
const sessions = require('./routes/sessions')
const emails = require('./routes/emails')
const payments = require('./routes/payments')
const token = require('./routes/token')
const sessionEvents = require('./routes/sessionEvents')
const dashboard = require('./routes/dashboard')

const ArtistProfile = require('./models/ArtistProfile')
const PupilProfile = require('./models/PupilProfile')
const User = require('./models/User')
const Sessions = require('./models/Sessions')

async function initDatabase() {
    try {
      // Connect to the MongoDB cluster
      await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
      console.log('Database is connected')

    } catch (e) {
      console.log('Cannot connect to the database' + e)
    }
}

initDatabase().catch(console.error)


app.prepare()
.then(() => {
  const server = express()
  // server.use(cors({
  //   origin: CLIENT_ORIGIN
  // }))

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

  server.use('/api/emails', emails)

  server.use('/api/payments', payments)

  server.use('/api/token', token)

  server.use('/api/sessionEvents', sessionEvents)

  server.use('/api/dashboard', dashboard)

  server.get('/', (req, res) => {
    return app.render(req, res, '/index', {})
  })

  server.get('*', (req, res) => {
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
