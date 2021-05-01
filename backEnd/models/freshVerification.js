const mongoose = require('mongoose')
const freshVerification = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    verificationCode: {
        type: String,
        required: true
    }
})

const mongoVerification = mongoose.model('freshVerification', freshVerification)
module.exports = { mongoVerification }