require('dotenv').config()
const cloudinary = require('cloudinary')
let multer = require ('multer')
var storage = multer.memoryStorage()
var upload = multer({ dest: 'uploads/' })
var multiparty = require('multiparty')
var form = new multiparty.Form({autoFields: false })


export const config = {
  api: {
    bodyParser: false,
  },
}

async function handler(req, res) {
 form.parse(req, async function(err, fields, files) {
    const values = await Object.values(files)
    const promises = await values.map((image) => {
      console.log('image', image[0].path)
      return cloudinary.uploader.upload(image[0].path)
    })

    const uploads = await Promise.all(promises)
    res.json(uploads)
  })
}

export default handler
