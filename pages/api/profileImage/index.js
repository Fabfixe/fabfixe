const cloudinary = require('cloudinary')

export default (req, res) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  })
  
  const path = Object.values(req.files)[0].path

  cloudinary.uploader.upload(path)
    .then(image => res.json([image]))
}
