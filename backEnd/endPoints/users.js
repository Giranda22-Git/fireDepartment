const express = require('express')
const router = express.Router()

const mongoUser = require('../models/User.js').mongoUser

const objectLogin = require('../objects/Login.js')

router.get('/', async (req, res) => {
    const result = await mongoUser.find().exec()
    res.status(200).send( JSON.stringify(result) )
})


// begin Registration/Authorization User
router.post('/', async (req, res) => {
    try {
        const data = req.body
        const isUser = await mongoUser.findOne({ 'Login._login': data.Login }).exec()
        if (isUser) res.status(200).send( JSON.stringify( isUser ) )
        else {
            const newUser = new mongoUser({
                Login: new objectLogin(data.Login)
            })
            const result = await newUser.save()
            res.status(200).send( JSON.stringify( result ) )
        }
    }
    catch(err) {
        console.log(err);
        res.sendStatus(500)
    }
})
/*
TEST:
POST http://localhost:3000/users/ HTTP/1.1
content-type: application/json

{
    "Login": "8(705)553-99-65"
}
*/
// end Registration User


// begin find User by id
router.get('/id/:id', async (req, res) => {
    try {
        const result = await mongoUser.findById(req.params.id).exec()
        res.status(200).json(result)
    }
    catch(err) {
        res.sendStatus(500)
    }
})
/*
TEST:
GET http://localhost:3000/users/id/6061b9f32b8ff91a08fd7ee6 HTTP/1.1
content-type: application/json
*/
// end find User by id


// begin find User by login
router.get('/login/:login', async (req, res) => {
    try {
        const result = await mongoUser.findOne({'Login._login': req.params.login}).exec()
        res.status(200).json(result)
    }
    catch(err) {
        res.sendStatus(500)
    }
})
/*
TEST:
GET http://localhost:3000/users/login/8(705)553-99-65 HTTP/1.1
content-type: application/json
*/
// end find User by login

module.exports = router