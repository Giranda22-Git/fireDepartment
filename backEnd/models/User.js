const mongoose = require('mongoose')
const user = new mongoose.Schema({
    Login: { // Phone Number
        type: mongoose.Schema.Types.Mixed,
        required: true,
        unique: true
    },
    FirstName: {
        type: String,
        default: ''
    },
    LastName: {
        type: String,
        default: ''
    },
    Image: {
        type: Object,
        default: {}
    },
    HistoryLog: {
        type: Array,
        default: []
    }
})

const mongoUser = mongoose.model('users', user)
module.exports = { mongoUser }