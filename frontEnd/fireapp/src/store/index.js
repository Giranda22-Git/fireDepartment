import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      token: localStorage.getItem('token') || '',
      phone: localStorage.getItem('phone') || '',
      updated: false,
      theme: localStorage.getItem('theme') || ''
    },
    mutations: {
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
        localStorage.removeItem('phone')
        localStorage.removeItem('token')
      },
      swichTheme(state){
        state.theme = state.theme == 'black' ? 'white' : 'black'
        localStorage.setItem('theme', state.theme == 'black' ? 'black' : 'white')
      }
    },
    actions: {
      logout(){
        localStorage.removeItem('token')
        this.state.token = ''
      },
    },
    getters: {
      isLoggedIn: state => !!state.token
    },
    strict: process.env.DEBUGGING

})
