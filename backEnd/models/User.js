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
    },
    typeOfUser: {
        type: String,
        enum: [ 'user', 'fireman' ],
        default: 'user'
    }
})

const mongoUser = mongoose.model('users', user)
module.exports = { mongoUser }