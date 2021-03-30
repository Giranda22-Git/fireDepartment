const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer')
const wss = require('ws')

//const User = require('./objects/User.js')
//const mongoFreshAuction = require('./models/FreshAuctions.js').mongoFreshAuction
//const mongoUser = require('./models/Users.js').mongoUser

const serverData = {
    mongoUrl: 'mongodb://localhost:27017/fireDepartment',
    serverUrl: 'http://localhost:3000/',
    PORT: 3000
}

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use((req, res, next) => {
    res.contentType('application/json')
    next()
})
app.use(cors())

init(serverData)

async function init(serverData) {
    await mongoose.connect(serverData.mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    mongoose.connection.once('open', () => {
        app.listen(serverData.PORT, (err) => {
            if (err) return new Error(`error in starting server, error: ${err}`)
            else console.log(`server started on \nPORT: ${serverData.PORT}\nURL: ${serverData.serverUrl}`)
        })

        app.use('/users', require('./endPoints/users.js'))
        //app.use('/auctions', require('./endPoints/auctions.js'))
    })
    mongoose.connection.emit('open')
}
