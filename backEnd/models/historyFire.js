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
    Victims: [
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
            }
        }
    ],
    combustionPercentage: {
        type: String,
        default: ''
    }
})

const mongoFire = mongoose.model('historyfires', fire)
module.exports = { mongoFire }