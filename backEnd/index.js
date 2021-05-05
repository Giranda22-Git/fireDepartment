const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer')
const WebSocket = require('ws')
const wsClient = new WebSocket.Server({ port: 1000 })
const { uid } = require('uid')

const mongoCurrentFire = require('./models/currentFire.js').mongoFire

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

let clients = new Set()

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
        app.use('/verification', require('./endPoints/verification.js'))
    })

    // begin WebSocket Client connection
    wsClient.on('connection', async (client, data) => {
        const newClient = {
            uid: uid(10),
            connection: client,
            phoneNumber: data.url.substring(1)
        }

        clients.add(newClient)
        console.log(`connected client: \nuid: ${newClient.uid}\nphoneNumber: ${newClient.phoneNumber}`)

        client.on('message', async msg => {
            msg = JSON.parse(msg)
            console.log(msg)
            // registration new fire
            if (msg.action === 'newFire') {
                const newMessage = {
                    action: 'registeredNewFire',
                    agent: 'server',
                    data: {
                        date: new Date,
                        causing: msg.data.causing,
                        address: msg.data.address
                    }
                }

                const newCurrentFire = new mongoCurrentFire({
                    address: msg.data.address,
                    causing: msg.data.causing
                })

                await newCurrentFire.save()

                sendAll(newMessage)
            }
        })

        client.on('close', () => {
            clients.delete(newClient)
            console.log(`deleted: ${newClient.uid}`)
        })
    })
    // end WebSocket Client connection

    mongoose.connection.emit('open')

    function sendAll (message) {
        clients.forEach(client => {
            client.connection.send(JSON.stringify(message))
        })
    }
}
