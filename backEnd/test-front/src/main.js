import Vue from 'vue'
import App from './App.vue'
import router from './router'

const VueInputMask = require('vue-inputmask').default

Vue.use(VueInputMask)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
