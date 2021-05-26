<template>
  <div id="q-app">
    <transition :name="transitionName">
      <router-view />
    </transition>
    <actualCall v-if="isLoggedIn && status == 'saver' && isModal" :Adress="call.address" @FoundFireman='TakeCall' @HideModal = "HideModal"/>
  </div>
</template>

<script>
import actualCall from 'components/actualCallComponent.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  created(){
    if(this.isLoggedIn){
      var self = this
      const ws = new WebSocket('ws://localhost:1000/' + this.phoneNumber)
      ws.onopen = function () {
        console.log('START WEBSOCKET CONNECTION');
      };
      ws.onmessage = function (event) {
        let data = JSON.parse(event.data)
        console.log(data);
        if (data.action === "registeredNewFire" && self.isLoggedIn && self.status == 'saver' && self.call == '') {
          self.$store.commit('CreateCall', data.data.resultRegistrationNewFire)
          setTimeout(() => {
            console.log(76656879);
            self.isModal = true
          }, 400);
        }
        else if (data.action === "fireTruckDispatched" && self.status != 'saver') {
          self.$store.commit('fireTruckDispatched')
        }
        else if(data.action === "startGeoDataTransfering" && self.status == 'saver'){
          self.$store.commit('StartTrip')
          if (navigator.geolocation) {
            setInterval(() => {
              var info = {
                action: 'geoDataTransfering',
                agent: 'fireMan',
                data: {
                  phoneNumber: self.phoneNumber,
                  geoData: {
                    latitude: navigator.geolocation.getCurrentPosition().coords.latitude,
                    altitude: navigator.geolocation.getCurrentPosition().coords.longitude
                  }
                }
              }
              state.ws.send(JSON.stringify(info))
              console.log('WS_MESSAGE_SEND_GEO');
            }, 2000);
          }
        } else if(data.action === "newCurrentGeoData" && self.status != 'saver'){
          self.$store.commit('FiremanCurrentPosition', [10,34])
        }
      };
      this.$store.commit('CreateWs',ws)
    }
  },
  data () {
    return {
      transitionName: '',
      isModal: false
    }
  },
  watch: {
    $route(to, from) {
      const toDepth = to.path.split('/')[1]
      this.transitionName = toDepth == '' ? 'opacity' : 'slide-left'
    },
    theme: function(oldV, newV){
      this.$q.dark.set(newV == 'black' ? false : true)
    }
  },
  beforeMount(){
    this.$q.dark.set(this.theme == 'black' ? true : false)
  },
  components:{
    actualCall
  },
  methods:{
    HideModal(){
      this.isModal = false
    },
    TakeCall(){
      this.$store.commit('TakeCall')
    }
  },
  computed:{
    ...mapGetters(['status','isLoggedIn']),
    phoneNumber(){
      return this.$store.state.phone
    },
    theme(){
      return this.$store.state.theme
    },
    call(){
      return this.$store.state.actualCall
    }
  }
}
</script>
<style scoped>
.opacity-enter-active, .opacity-leave-active {
  transition: opacity 1s;
}
.opacity-enter, .opacity-leave-to{
  opacity: 0;
}
.slide-left-enter-active,
.slide-left-leave-active{
  transition: 0.4s;
}
.slide-left-enter{
  transform: translateX(100vw);
}
.slide-left-leave-to{
   transform: translateX(-100vw);
}
</style>
