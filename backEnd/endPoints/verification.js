const express = require('express')
const router = express.Router()
const axios = require('axios')

const mongoVerification = require('../models/freshVerification.js').mongoVerification
const serverData = require('../staticData/mountedData.js')

router.get('/', async (req, res) => {
  const result = await mongoVerification.find().exec()
  res.status(200).send(JSON.stringify(result))
})

// begin create verification code

router.post('/', async (req, res) => {

  const tryAgain = await mongoVerification.findOne({ phoneNumber: req.body.phoneNumber }).exec()

  if (tryAgain)
    await mongoVerification.deleteOne({ phoneNumber: req.body.phoneNumber }).exec()

  const code = generateCode()

  const newfreshVerification = new mongoVerification({
    phoneNumber: req.body.phoneNumber,
    verificationCode: code
  })

  const result = await newfreshVerification.save()

  const params = {
    login: 'Giranda22',
    psw: 'Kv7zTusHymtE95m',
    phones: req.body.phoneNumber,
    mes: `код подтверждения ${code}`
  }

  const URI = `https://smsc.kz/sys/send.php?login=Giranda22&psw=Kv7zTusHymtE95m&phones=${req.body.phoneNumber}&mes=${params.mes}`

  await axios.get(encodeURI(URI))

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
    await axios.post(serverData.externalServerUrl + '/users', { Login: data.phoneNumber })
    res.send({ result: true })
  }
  else
    res.send({ result: false })
})
/*
TEST:

POST http://localhost:3000/verification/verify HTTP/1.1
content-type: application/json

{
    "phoneNumber": "8(705)553-99-66",
    "verificationCode": "103234"
}

*/
// end verify user

function generateCode() {
  return String(Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000)
}

module.exports = router