require('dotenv').config()
const cloudinary = require('cloudinary')
let multer = require ('multer')
var storage = multer.memoryStorage()
var upload = multer({ dest: '/tmp/uploads/' })
var multiparty = require('multiparty')
var form = new multiparty.Form({autoFields: false })


export const config = {
  api: {
    bodyParser: false,
  },
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

function handler(req, res) {
 form.parse(req, async function(err, fields, files) {
   console.log('err', err)
   console.log('fields', fields)
   console.log('files', files)
    const values = await Object.values(files)
    const promises = await values.map((image) => {
      return cloudinary.uploader.upload(image[0].path)
    })

    const uploads = await Promise.all(promises)
    res.json(uploads)
  })
}

export default handler
