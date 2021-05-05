const mongoose = require('mongoose')
const fireDepartment = new mongoose.Schema({
    numberOfFireDepartment: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    brigades: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    }
})

const mongoFireDepartment = mongoose.model('fireDepartments', fireDepartment)
module.exports = { mongoFireDepartment }