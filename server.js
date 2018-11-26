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

app.prepare()
.then(() => {
  const server = express()

  server.get('/p/:id', (req, res) => {
    const actualPage = '/post'
    const queryParams = { id: req.params.id }
    app.render(req, res, actualPage, queryParams)
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  })

  server.use(cors({
    origin: CLIENT_ORIGIN
  }))

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

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
