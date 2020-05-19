import dbConnect from '../../../dbConnect'
const ArtistProfile = require('../../../models/ArtistProfile')

dbConnect()

export default (req, res) => {
  const { offset, limit } = req.query
  return ArtistProfile.paginate({}, { offset: parseInt(offset), limit: parseInt(limit) }).then(function(result) {
    res.json(result)
  })
}
