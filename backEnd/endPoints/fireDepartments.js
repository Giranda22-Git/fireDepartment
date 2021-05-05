const express = require('express')
const router = express.Router()

const mongoFireDepartment = require('../models/fireDepartment.js').mongoFireDepartment

router.get('/', async (req, res) => {
    const result = await mongoFireDepartment.find().exec()
    res.status(200).send( JSON.stringify(result) )
})

// begin create fireDepartment code

router.post('/', async (req, res) => {
    const data = req.body

    const newFireDepartment = new mongoFireDepartment({
        numberOfFireDepartment: data.numberOfFireDepartment,
        city: data.city,
        region: data.region,
        address: data.address
    })

    const result = await newFireDepartment.save()
    res.status(200).json(result)
})
/*
TEST:

POST http://localhost:3000/fireDepartment/ HTTP/1.1
content-type: application/json

{
    "phoneNumber": "8(705)553-99-66"
}

*/

// end create fireDepartment code


// begin verify user

router.post('/verify', async (req, res) => {
    const data = req.body

    const code = await mongoVerification.findOne({ phoneNumber: data.phoneNumber }).exec()

    if (code.verificationCode === data.verificationCode) {
        await mongoVerification.deleteOne({ phoneNumber: data.phoneNumber }).exec()
        await axios.post('http://localhost:3000/users', { Login: data.phoneNumber })
        res.send({result: true})
    }
    else
        res.send({result: false})
})
/*
TEST:

POST http://localhost:3000/verification/verify HTTP/1.1
content-type: application/json

{
    "phoneNumber": "8(705)553-99-66",
    "verificationCode": "513995"
}

*/
// end verify user

function generateCode() {
    return String(Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000)
}

module.exports = router