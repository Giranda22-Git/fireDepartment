<template>
  <div id="q-app">
    <transition :name="transitionName">
      <router-view />
    </transition>
  </div>
</template>
<script>
export default {
  name: 'App',
  data () {
    return {
      transitionName: ''
    }
  },
  watch: {
    $route(to, from) {
      const toDepth = to.path.split('/')[1]
      const fromDepth = from.path.split('/')[1]
      this.transitionName = toDepth == '' ? 'opacity' : 'slide-left'
    },
    theme: function(oldV, newV){
      this.$q.dark.set(newV == 'black' ? false : true)
    }
  },
  beforeMount(){
    this.$q.dark.set(this.theme == 'black' ? true : false)
  },
  computed:{
    theme(){
      return this.$store.state.theme
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
