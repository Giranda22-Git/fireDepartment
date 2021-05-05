const mongoose = require('mongoose')
const brigade = new mongoose.Schema({
    numberOfFireBrigade: {
        type: Number,
        required: true
    },
    pertainFireDepartment: {
        type: mongoose.Schema.Types.ObjectId,
        default: ''
    },
    team: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true
    },
    city: {
        type: String,
        required: true
    }
})

const mongoBrigade = mongoose.model('brigades', brigade)
module.exports = { mongoBrigade }