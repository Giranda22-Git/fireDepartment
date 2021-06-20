<template>
<q-layout view="lHh Lpr lFf">
  <q-page-container>
    <q-page style="display: flex; align-items: center; flex-direction: column">
      <transition :name="slideType" mode="out-in">
        <PageOne v-if="stage == 1" @goPrev = "previousPage" @ahead = "PhaseAhead" />
        <PageTwo v-if="stage == 2" @goPrev = "previousPage" @ahead = "PhaseGetNumber" />
        <PageThree v-if="stage == 3" :phone='phone' @goPrev = "previousPage" @ahead = "PhaseRedirectToMainPage" />
      </transition>
  </q-page>
  </q-page-container>
  </q-layout>
</template>

<script>
import axios from 'axios'
import PageOne from '../components/LoginPage1'
import PageTwo from '../components/LoginPage2'
import PageThree from '../components/LoginPage3'
export default {
  name: 'Login',
  data () {
    return {
      stage: 1,
      id: null,
      phone: null,
      slideType: 'slide-left'
    }
  },
  methods: {
    changeSlideType(type){
      this.slideType = type
    },
    previousPage(){
      this.stage -= 1
      this.changeSlideType('slide-right')
    },
    PhaseAhead(){
      this.stage += 1
      this.changeSlideType('slide-left')
    },
    PhaseGetNumber(phone){
      this.phone = phone
      this.stage += 1
      this.changeSlideType('slide-left')
    },
    async PhaseRedirectToMainPage(){
      var self = this
        await axios.get(`${this.$store.state.backEndUrl}/users/login/${self.phone}`)
          .then(function(response) {
            console.log(response.data,'SUCCESS');
            self.$store.commit('cr_phone', [self.phone, response.data._id])
            setTimeout(() => {
              self.$router.push('/')
              setTimeout(() => {
                location.reload()
              }, 700);
            }, 200);
          })
          .catch(function (error) {
            console.log(error);
          })
    }
  },
  components:{
    PageOne,
    PageTwo,
    PageThree
  }
}
</script>
<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active
 {
  transition: 0.2s;
}
.slide-left-enter{
  transform: translateX(100vw);
}
.slide-left-leave-to{
  transform: translateX(-100vw);
}
.slide-right-enter{
  transform: translateX(-100vw);
}
.slide-right-leave-to{
  transform: translateX(100vw);
}
</style>