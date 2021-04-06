import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      token: localStorage.getItem('token') || '',
      phone: localStorage.getItem('phone') || '',
      updated: false,
      theme: localStorage.getItem('theme') || 'white',
      status: localStorage.getItem('status') || 'person',
      actualCall: localStorage.getItem('actualCall') || {"adress": "SomeAdress"}
    },
    mutations: {
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
      cr_phone(state, phone) {
        state.phone = phone
        localStorage.setItem('phone', phone)
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
      isLoggedIn: state => !!state.token,
      status: state => state.status
    },
    strict: process.env.DEBUGGING

})
