const express = require('express')
const router = express.Router()

const mongoCurrentFire = require('../models/currentFire.js').mongoFire

// begin get all current fires

router.get('/', async (req, res) => {
  const result = await mongoCurrentFire.find().exec()
  res.status(200).send(JSON.stringify(result))
})

// end get all current fires



// begin get current fires by status

router.get('/:status', async (req, res) => {
  const result = await mongoCurrentFire.find({ status: req.params.status }).exec()

  res.status(200).json(result)
})
/*
TEST:

GET http://localhost:3000/currentFire/begin HTTP/1.1
content-type: application/json

*/

// begin get current fires by status

module.exports = router