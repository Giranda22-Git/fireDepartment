const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer')
const WebSocket = require('ws')
const wsClient = new WebSocket.Server({ port: 1000 })
const { uid } = require('uid')

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
        //app.use('/auctions', require('./endPoints/auctions.js'))
    })

    // web socket client connection
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
            // registration new fire
            if (msg.action === 'newFire') {
                const newMessage = {
                    action: 'registeredNewFire',
                    agent: 'server',
                    data: {
                        date: new Date,
                        address: msg.data.address
                    }
                }
                sendAll(newMessage)
            }
        })

        client.on('close', () => {
            clients.delete(newClient)
            console.log(`deleted: ${newClient.uid}`)
        })
    })

    mongoose.connection.emit('open')

    function sendAll (message) {
        clients.forEach(client => {
            client.connection.send(JSON.stringify(message))
        })
    }
}
