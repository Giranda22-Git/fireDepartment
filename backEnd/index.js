const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer')
const WebSocket = require('ws')
const wsClient = new WebSocket.Server({ port: 1000 })
const { uid } = require('uid')
const axios = require('axios')

const mongoCurrentFire = require('./models/currentFire.js').mongoFire
const mongoUser = require('./models/User.js').mongoUser

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
        app.use('/fireDepartment', require('./endPoints/fireDepartments.js'))
        app.use('/fireBrigade', require('./endPoints/fireBrigades.js'))
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
                const newCurrentFire = new mongoCurrentFire({
                    address: msg.data.address,
                    causing: msg.data.causing
                })

                const resultRegistrationNewFire = await newCurrentFire.save()

                const newMessage = {
                    action: 'registeredNewFire',
                    agent: 'server',
                    data: {
                        resultRegistrationNewFire
                    }
                }

                sendAll(newMessage)
            }

            // take call; FIXME: not verified !!!
            if (msg.action === 'takeCall') {
                const resultTakeCallCurrentFire =
                    await mongoCurrentFire.updateOne(
                        { _id: msg.data.currentFireId },
                        { $push: { activeBrigades: msg.data.brigadeId } }
                    )

                const params = {
                    brigadeId: msg.data.brigadeId,
                    switch: false
                }
                await axios.post('http://localhost:3000/fireBrigade/switch', params)

                const MessageForTakeCall = {
                    action: 'fireTruckDispatched',
                    agent: 'server',
                    data: {
                        updatedCurrentFireData: resultTakeCallCurrentFire,
                    }
                }

                const currentFireDataForTakeCall = await mongoCurrentFire.findById(msg.data.currentFireId).exec()
                const causingCurrentFireForTakeCall = await mongoUser.findById(currentFireDataForTakeCall.causing).exec()

                for (let clientForTakeCall of clients) {
                    if (clientForTakeCall.phoneNumber === causingCurrentFireForTakeCall.phoneNumber) {
                        clientForTakeCall.connection.send(JSON.stringify(MessageForTakeCall))
                    }
                }
            }

            // update fire status; FIXME: not verified
            if (msg.action === 'updateFireStatus') {
                const resultFireDataForUpdateFireStatus = await mongoCurrentFire.updateOne(
                    { _id: msg.data.currentFireId },
                    { status: msg.data.status }
                ).exec()

                const MessageForUpdateFireStatus = {
                    action: 'fireStatusUpdated',
                    agent: 'server',
                    data: {
                        currentFireId: msg.data.currentFireId,
                        newStatus: msg.data.status,
                        result: resultFireDataForUpdateFireStatus
                    }
                }

                sendAll(MessageForUpdateFireStatus)
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
