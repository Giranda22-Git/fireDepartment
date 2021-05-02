const mongoose = require('mongoose')
const fire = new mongoose.Schema({
    date: {  // дата возгарания
        type: Date,
        default: new Date
    },
    address: { // адресс пожара
        type: String,
        required: true
    },
    status: {  // статус пожара: начался: пожарные выехали, в процессе: пожар в процессе тушения, конец: конец операции
        type: String,
        enum: ['begin', 'inProcess', 'ended'],
        default: 'begin'
    },
    activeBrigades: { // бригады пожарных которые выехали на данный пожар
        type: Array,
        default: []
    },
    causing: { // человек вызвавший пожарных на место пожара
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

const mongoFire = mongoose.model('currentfires', fire)
module.exports = { mongoFire }