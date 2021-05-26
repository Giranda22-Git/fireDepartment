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
const mongoBrigade = require('./models/fireBrigade.js').mongoBrigade

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
        console.log(msg);
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

      // take call
      if (msg.action === 'takeCall') {

        // поиск id пожарной машины
        const brigade = await mongoBrigade.findOne({ team: msg.data.fireManId }).exec()

        // добавление пожарной машины в список активных пожарных машин текущего пожара
        await mongoCurrentFire.updateOne(
          { _id: msg.data.currentFireId },
          { $push: { activeBrigades: brigade._id } }
        )

        // изменение статуса пожарной машины на занят
        const params = {
          brigadeId: brigade._id,
          switch: false
        }
        await axios.post('http://localhost:3000/fireBrigade/switch', params)

        // поиск обновленного пожара
        const resultTakeCallCurrentFire = await mongoCurrentFire.findById(msg.data.currentFireId).exec()

        // поиск пожарнгого по id
        const fireManDataForTakeCall = await mongoUser.findById(msg.data.fireManId).exec()

        // отправление сообщения человеку который вызвал пожарную машину
        const MessageForTakeCall = {
          action: 'fireTruckDispatched',
          agent: 'server',
          data: {
            updatedCurrentFireData: resultTakeCallCurrentFire,
            fireManPhoneNumber: fireManDataForTakeCall.Login._login
          }
        }

        const causingCurrentFireForTakeCall = await mongoUser.findById(msg.data.causing).exec()

        for (let clientForTakeCall of clients) {
          if (clientForTakeCall.phoneNumber === causingCurrentFireForTakeCall.Login._login) {
            clientForTakeCall.connection.send(JSON.stringify(MessageForTakeCall))
          }
        }

        const messageForFireManForTakeCall = {
          action: 'startGeoDataTransfering',
          agent: 'server',
          data: {
            causingPhoneNumber: causingCurrentFireForTakeCall.Login._login
          }
        }

        for (let clientForTakeCall of clients) {
          if (clientForTakeCall.phoneNumber === fireManDataForTakeCall.Login._login) {
            clientForTakeCall.connection.send(JSON.stringify(messageForFireManForTakeCall))
          }
        }
      }


      // geo data transferring
      if (msg.action === 'geoDataTransfering') {
        const messageForGeoDataTransfering = {
          action: 'newCurrentGeoData',
          agent: 'server',
          data: {
            geoData: msg.data.geoData
          }
        }
        for (let clientForGeoDataTransfering of clients) {
          if (clientForGeoDataTransfering.phoneNumber === msg.data.phoneNumber) {
            clientForGeoDataTransfering.connection.send(JSON.stringify(messageForGeoDataTransfering))
          }
        }
      }


      // fire brigade Arrived
      if (msg.action === 'fireBrigadeArrived') {
        const messageForFireBrigadeArrived = {
          action: 'fireBrigadeArrived',
          agent: 'server',
          data: {
            result: true
          }
        }
        for (let clientForFireBrrigadeArrived of clients) {
          if (clientForFireBrrigadeArrived.phoneNumber === msg.data.fireManPhoneNumber) {
            clientForFireBrrigadeArrived.connection.send(JSON.stringify(messageForFireBrigadeArrived))
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

  function sendAll(message) {
    clients.forEach(client => {
      client.connection.send(JSON.stringify(message))
    })
  }
}
