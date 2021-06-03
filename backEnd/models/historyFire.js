const mongoose = require('mongoose')
const fire = new mongoose.Schema({
  date: {  // дата окончания пожара
    type: Date,
    default: new Date
  },
  fireData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  report: {
    type: String,
    default: ''
  },
  victims: [
    {
      firstName: {
        type: String,
        default: ''
      },
      lastName: {
        type: String,
        default: ''
      },
      iin: {
        type: String,
        default: ''
      },
      state: {
        type: String,
        enum: ['unknown' ,'alive', 'dead'],
        default: 'unknown'
      }
    }
  ],
  combustionPercentage: {
    type: String,
    default: ''
  }
})

const mongoHistoryFire = mongoose.model('historyfires', fire)
module.exports = { mongoHistoryFire }