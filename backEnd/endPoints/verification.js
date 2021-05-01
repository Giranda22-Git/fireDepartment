const express = require('express')
const router = express.Router()
const axios = require('axios')

const mongoVerification = require('../models/freshVerification.js').mongoVerification

router.get('/', async (req, res) => {
    const result = await mongoVerification.find().exec()
    res.status(200).send( JSON.stringify(result) )
})

// begin create verification code

router.post('/', async (req, res) => {

    const tryAgain = await mongoVerification.findOne({ phoneNumber: req.body.phoneNumber }).exec()

    if (tryAgain)
        await mongoVerification.deleteOne({ phoneNumber: req.body.phoneNumber }).exec()

    const newfreshVerification = new mongoVerification({
        phoneNumber: req.body.phoneNumber,
        verificationCode: generateCode()
    })

    const result = await newfreshVerification.save()
    res.status(200).json(result)
})
/*
TEST:

POST http://localhost:3000/verification/ HTTP/1.1
content-type: application/json

{
    "phoneNumber": "8(705)553-99-66"
}

*/

// end create verification code


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