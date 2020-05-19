import mongoose from 'mongoose'
const ArtistProfile = require('../../../models/ArtistProfile')

export default (req, res) => {
  const { offset, limit } = req.query
  return ArtistProfile.paginate({}, { offset: parseInt(offset), limit: parseInt(limit) }).then(function(result) {
    res.json(result)
  })
}
