const express = require('express')
const router = express.Router()

const mongoUser = require('../models/User.js').mongoUser

const objectLogin = require('../objects/Login.js')

router.get('/', async (req, res) => {
  const result = await mongoUser.find().exec()
  res.status(200).send(JSON.stringify(result))
})


// begin Registration/Authorization User
router.post('/', async (req, res) => {
  try {
    const data = req.body
    const isUser = await mongoUser.findOne({ 'Login._login': data.Login }).exec()
    if (isUser) res.status(200).send(JSON.stringify(isUser))
    else {
      const newUser = new mongoUser({
        Login: new objectLogin(data.Login)
      })
      const result = await newUser.save()
      res.status(200).send(JSON.stringify(result))
    }
  }
  catch (err) {
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
router.post('/findById', async (req, res) => {
  const data = req.body

  let users = new Array
  console.log(data)

  for (i = 0; i < data.users.length; i++) {
    users.push(await mongoUser.findById(data.users[i]).exec())
  }

  res.status(200).send(users)
})
/*
TEST:

POST http://localhost:3000/users/findById HTTP/1.1
content-type: application/json

{
    "users": [
        "6092627ae5e6038bd44ec95d",
        "6092627ae5e6038bd44ec95d",
        "6092627ae5e6038bd44ec95d"
    ]
}
*/
// end find User by id


// begin find User by login
router.get('/login/:login', async (req, res) => {
  try {
    const result = await mongoUser.findOne({ 'Login._login': req.params.login }).exec()
    res.status(200).json(result)
  }
  catch (err) {
    res.sendStatus(500)
  }
})
/*
TEST:
GET http://localhost:3000/users/login/+7(705)553-99-65 HTTP/1.1
content-type: application/json
*/
// end find User by login

module.exports = router