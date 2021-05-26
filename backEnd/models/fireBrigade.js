const mongoose = require('mongoose')
const brigade = new mongoose.Schema({
  numberOfFireBrigade: {
    type: Number,
    required: true
  },
  pertainFireDepartment: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  team: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available'
  },
  city: {
    type: String,
    required: true
  }
})

const mongoBrigade = mongoose.model('brigades', brigade)
module.exports = { mongoBrigade }