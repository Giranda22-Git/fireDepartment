<template>
  <div id="q-app">
    <transition :name="transitionName">
      <router-view />
    </transition>
    <actualCall v-if="status == 'saver' && call.adress == 'SomeAdress' && isModal" :Adress="call.adress" @HideModal = "HideModal"/>
  </div>
</template>

<script>
import actualCall from 'components/actualCallComponent.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  data () {
    return {
      transitionName: '',
      isModal: true
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
    }
  },
  computed:{
    ...mapGetters(['status']),
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
