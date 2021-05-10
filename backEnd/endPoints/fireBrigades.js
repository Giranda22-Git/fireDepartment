const express = require('express')
const router = express.Router()

const mongoBrigade = require('../models/fireBrigade.js').mongoBrigade
const mongoFireDepartment = require('../models/fireDepartment.js').mongoFireDepartment

router.get('/', async (req, res) => {
    const result = await mongoBrigade.find().exec()
    res.status(200).send( JSON.stringify(result) )
})

// begin new Brigade

router.post('/', async (req, res) => {
    const data = req.body

    const newBrigade = new mongoBrigade({
        numberOfFireBrigade: data.numberOfFireBrigade,
        pertainFireDepartment: data.pertainFireDepartment,
        team: data.team,
        city: data.city
    })

    const result = await newBrigade.save()
    const updateFireDepartment = await mongoFireDepartment.updateOne({ _id: data.pertainFireDepartment }, {
        $push: {brigades: result._id}
    })
    res.status(200).json(result)
})
/*
TEST:

POST http://localhost:3000/fireBrigade/ HTTP/1.1
content-type: application/json

{
    "numberOfFireBrigade": "1",
    "pertainFireDepartment": "60986a78f367175e92fbee02",
    "team": [
        "6092627ae5e6038bd44ec95d"
    ],
    "city": "Almaty"
}

*/

// end new Brigade


// begin find brigade by id

router.post('/findById', async (req, res) => {
    const data = req.body

    let brigades = new Array
    console.log(data)

    for (i=0; i < data.brigades.length; i++) {
        brigades.push(await mongoBrigade.findById(data.brigades[i]).exec())
    }

    res.status(200).send(brigades)
})

/*
TEST:

POST http://localhost:3000/fireBrigade/findById HTTP/1.1
content-type: application/json

{
    "brigades": [
        "60987cb9bc2a9a6445d241fd",
        "60987cb9bc2a9a6445d241fd",
        "60987cb9bc2a9a6445d241fd"
    ]
}

*/
// end find brigade by id

// begin update status

router.post('/switch', async (req, res) => {
    const data = req.body

    if (data.switch) {
        await mongoBrigade.updateOne({ _id: data.brigadeId }, { status: 'available' })
        res.status(200).send({ status: 'available' })
    } else {
        await mongoBrigade.updateOne({ _id: data.brigadeId }, { status: 'unavailable' })
        res.status(200).send({ status: 'unavailable' })
    }
})

// end update status

module.exports = router