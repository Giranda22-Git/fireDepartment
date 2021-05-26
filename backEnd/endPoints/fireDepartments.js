const express = require('express')
const router = express.Router()

const mongoFireDepartment = require('../models/fireDepartment.js').mongoFireDepartment
const mongoBrigade = require('../models/fireBrigade.js').mongoBrigade

router.get('/', async (req, res) => {
  const result = await mongoFireDepartment.find().exec()
  res.status(200).send(JSON.stringify(result))
})

// begin create fireDepartment

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
    "numberOfFireDepartment": "12",
    "city": "Almaty",
    "region": "Жетысуский",
    "address": "микрорайон Дорожник, 27а"
}

*/

// end create fireDepartment


// begin binding

router.post('/binding', async (req, res) => {
  const data = req.body

  await mongoFireDepartment.updateOne({ _id: data.departmentId }, {
    $push: { brigades: data.brigades }
  }).exec()

  data.brigades.forEach(async brigade => {
    await mongoBrigade.updateOne({ _id: brigade }, {
      pertainFireDepartment: data.departmentId
    })
  })

  res.sendStatus(200)
})
/*
TEST:

POST http://localhost:3000/fireDepartment/binding HTTP/1.1
content-type: application/json

{
  "departmentId": "60986a78f367175e92fbee02",
  "brigades": [
    "60ae18d7a6434e9c29c8817e"
  ]
}

*/
// end binding

// begin find fire department by id

router.post('/findById', async (req, res) => {
  const result = await mongoFireDepartment.findById(req.data.departmentId).exec()
  res.status(200).send(result)
})

// end find fire department by id

module.exports = router