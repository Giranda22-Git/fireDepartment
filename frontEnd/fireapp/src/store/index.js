import { _ } from 'core-js'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      token: localStorage.getItem('token') || '',
      phone: localStorage.getItem('phone') || '',
      updated: false,
      theme: localStorage.getItem('theme') || 'white',
      status: localStorage.getItem('status') || 'ordinary',
      actualCall: localStorage.getItem('actualCall') || '',
      VictimCoords: localStorage.getItem('VictimCoords') || [],
      ws: null,
      FireStatus: localStorage.getItem('FireStatus') || false,
      TripStatus: localStorage.getItem('TripStatus') || false,
      FiremanCurrentPosition: localStorage.getItem('FiremanCurrentPosition') || [],
    },
    mutations: {
      GetCoords(state, geo){
        state.VictimCoords = [geo.latitude,geo.altitude]
        localStorage.setItem('VictimCoords', [geo.latitude,geo.altitude])
      },
      FiremanArrived(state){
        state.actualCall = ''
        localStorage.removeItem('actualCall')
        state.FireStatus = false
        localStorage.removeItem('FireStatus')
        state.TripStatus = false
        localStorage.removeItem('TripStatus')
        state.FiremanCurrentPosition = []
        localStorage.removeItem('FiremanCurrentPosition')
      },
      FiremanCurrentPosition(state, arr){
        state.FiremanCurrentPosition = arr
        localStorage.setItem('FiremanCurrentPosition', arr)
      },
      StartTrip(state){
        state.TripStatus = true
        localStorage.setItem('TripStatus', true)
      },
      fireTruckDispatched(state){
        state.FireStatus = true
        localStorage.setItem('FireStatus', true)
      },
      TakeCall(state){
        var info = {
          action: 'takeCall',
          agent: 'fireMan',
          data: {
            fireManId: state.token,
            causing: state.actualCall.causing,
            currentFireId: state.actualCall._id
          }
        }
        state.ws.send(JSON.stringify(info))
        console.log('WS_MESSAGE_SEND_TAKE_CALL');
      },
      CreateCall(state, FireInfo){
        state.actualCall = FireInfo
        localStorage.setItem('actualCall', FireInfo)
        console.log(state.actualCall);
      },
      CreateWs(state, ws){
        state.ws = ws
      },
      WebSocketSendNewFire(state, Coords){
        console.log(Coords);
        console.log(state.token,'AAAAAAAAAAAAAAA');
        var info = {
          action: 'newFire',
          agent: 'user',
          data: {
            causing: state.token,
            address: Coords[0],
            geoData: {
              latitude: Coords[1][0],
              altitude: Coords[1][1]
            }
          }
        }
        console.log(info);
        state.ws.send(JSON.stringify(info))
        console.log('WS_MESSAGE_SEND_NEW_FIRE');
      },
      actualCall_ch(state, call){
        state.actualCall = call
        localStorage.setItem('actualCall', call)
      },
      st_ch(state, status) {
        state.updated = status
      },
      cr_token(state, token) {
        state.token = token
        localStorage.setItem('token', token)
      },
      cr_phone(state, payback) {
        state.phone = payback[0]
        state.token = payback[1]
        localStorage.setItem('token', payback[1])
        localStorage.setItem('phone', payback[0])
      },
      logout(state){
        state.phone = ''
        state.token = ''
        localStorage.clear()
      },
      swichTheme(state){
        state.theme = state.theme == 'black' ? 'white' : 'black'
        localStorage.setItem('theme', state.theme == 'black' ? 'black' : 'white')
      },
      status_ch(state, status){
        state.person = status
        localStorage.setItem('status', status)
      }
    },
    actions: {
      logout(){
        localStorage.removeItem('token')
        this.state.token = ''
      },
    },
    getters: {
      isLoggedIn: state => !!state.phone,
      status: state => state.status
    },
    strict: process.env.DEBUGGING

})
