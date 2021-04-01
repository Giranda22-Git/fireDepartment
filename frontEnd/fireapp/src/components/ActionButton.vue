<template>
  <div id="main" v-if="IsTurned" class="main">
    <div class = 'actionButton' @click = "actionButtonPressed">Вызвать Пожарных</div>
    <div v-touch-swipe="swipeAction" class="contentBlock" id="contentBlock" v-if="stage>1" :style="`${Theme == 'black' ? 'background: #121212' : 'background: #fff'}`">
      <h6 class="title">Укажите адрес</h6>
      <div class = "currentPos">
        <div class="imgBx">
          <svg width="29" height="47" viewBox="0 0 29 47" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_f)"><ellipse cx="15" cy="43" rx="8" ry="2" fill="black" fill-opacity="0.1"/></g><line x1="15" y1="28" x2="15" y2="42" stroke="#FF2600" stroke-width="2" stroke-linecap="round"/><circle cx="14.5" cy="14.5" r="14.5" fill="#FF583B"/><circle cx="14.5" cy="14.5" r="6.5" fill="#FFCC81"/><defs><filter id="filter0_f" x="5" y="39" width="20" height="8" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur"/></filter></defs></svg>
        </div>
        <div class="InfBx">
          <h6>Текущий адрес</h6>
          <h6 class="adress">Какой-то адрес</h6>
        </div>
        <div class="ChInfBx">
          <div class="sucBtn" @click = "completeAdress">
            <div v-if="stage==2">Указать</div>
            <div v-else @click.stop="closeTab">Карта</div>
          </div>
        </div>
      </div>
      <div class="button" @click="nextStep">Далее</div>
      <q-separator />
      <div class="sa">Поиск по месту</div>
    </div>
      <q-item-section v-if="next==true">
        <q-icon @click.stop="closeNext" id="icon" name="arrow_back" :style="`${Theme == 'black' ? 'background: #121212' : 'background: #fff'}; font-size: 25px;`" />
      </q-item-section>
    <div v-if="next==true" class="contentBlockNext" id = "nextBlock" :style="`${Theme == 'black' ? 'background: #121212' : 'background: #fff'}`">
      <h6 class="title" style="text-align: center; font-size: 1.8em">Вызов Пожарных</h6>
      <div class = "currentPos">
          <h6 style = "color: red; text-align: center; font-size: 1.4em; line-height:1em">Заведомо ложный вызов влечет за собой штраф в размере тридцати месячных расчетных показателей.</h6>
      </div>
      <div class="buttonNext" @click="fireCall">Вызвать(10сек)</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'LeftDrower',
  props:{
    IsTurned: Boolean
  },
  data () {
    return {
      stage: 1,
      next: false
    }
  },
  methods:{
    actionButtonPressed(){
      this.stage += 1
      document.getElementById('main').style.height = '30vh'
    },
    completeAdress(){
      this.stage += 1
      document.getElementById('main').style.height = '95vh'
    },
    swipeAction({ evt, ...info }){
      console.log(info)
      if(info?.direction == 'up' && info?.duration > 40){
        this.completeAdress()
      } else if(info.direction == 'down' && info?.duration > 40){
        if(document.getElementById('main').style.height == '30vh'){
          setTimeout(() => {
            this.stage = 1
            document.getElementById('main').style.height = '10vh'
          }, 550);
          document.getElementById('contentBlock').style.bottom = '-100%'  
        } else {
          this.stage -= 1
          document.getElementById('main').style.height = '30vh'
        }
      }
    },
    closeTab(){
      setTimeout(() => {
        this.stage = 1      
      }, 550);
      document.getElementById('main').style.height = '10vh' 
      document.getElementById('contentBlock').style.bottom = '-100%'
    },
    closeNext(){
      setTimeout(() => {
        this.actionButtonPressed()
        this.next = false
      }, 550);
      document.getElementById('main').style.height = '10vh'
      document.getElementById('icon').style.opacity = '0'
    },
    nextStep(){
      this.closeTab()
      setTimeout(() => {
        this.next = true;
        document.getElementById('main').style.height = '40vh'
      }, 550);
    },
    fireCall(){
      setTimeout(() => {
        this.next = false     
      }, 550);
      document.getElementById('main').style.height = '0' 
      document.getElementById('icon').style.opacity = '0'
    }
  },
  computed: {
    Theme(){
      return this.$store.state.theme
    }
  }
}
</script>

<style scoped>
.q-icon{
  margin-left: 20px;
  border-radius: 50%;
  background: #fff;
  padding: 10px;
  animation: opacity 0.5s;
  transition: 0.5s;
}
h6{
  margin-block-start: 0;
  margin-block-end: 0;
  font-size: 1.5em;
}
.actionButton{
  position: absolute;
  bottom: 15%;
  width: 70%;
  margin-left: 15%;
  padding: 1.7vh 0 1.7vh 0;
  background:#e85537;
  border-radius: 20px;
  text-align: center;
  font-weight: 600;
  color: #fff;
  border: none;
  outline: none;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.contentBlock{
  position: absolute;
  width: 100%;
  height: 100%;
  transition: 0.5s;
  padding: 7%;
  bottom: 0;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,0.4);
  background: #fff;
  animation: CBAppearing 0.5s ease-in-out;
}
.contentBlockNext{
  position: absolute;
  width: 100%;
  height: 100%;
  transition: 0.5s;
  padding: 7%;
  bottom: 0;
  top: 10vh;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,0.4);
  background: #fff;
  animation: CBAppearing 0.5s ease-in-out;
}
.title{
  margin-bottom: 2vh;
}
.main{
  width: 100vw;
  height:10vh;
  position: absolute;
  bottom: 0vh;
  transition: 0.5s;
  overflow: hidden;
}
.contentBlock h4{
  margin-top: 4%;
}
.currentPos{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}
.currentPos .imgBx{
  width: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.currentPos .InfBx{
  width: 70%;
  padding-left: 5%;
  display: flex;
  align-items: center;
  flex-direction: column;
}
.currentPos .InfBx h6{
  width: 100%;
  margin-block-start: 0;
  margin-block-end: 0;
  font-size: 1.3em;
}
.currentPos .InfBx .adress{
  font-size: 1.2em;
  opacity: 0.6;
}
.currentPos .ChInfBx{
  width: 20%;
}
.button{
  width: 70%;
  margin: 10% auto;
  padding: 1.7vh 0 1.7vh 0;
  background:#e85537;
  border-radius: 20px;
  text-align: center;
  font-weight: 600;
  color: #fff;
  border: none;
  outline: none;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.buttonNext{
  width: 70%;
  margin: 7% auto;
  padding: 1.7vh 0 1.7vh 0;
  background:#737373;
  border-radius: 20px;
  text-align: center;
  font-weight: 600;
  color: #fff;
  border: none;
  outline: none;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
@keyframes CBAppearing{
  0%{
    bottom: -100%;
  }
  100%{
    bottom: 0;
  }
}
@keyframes opacity{
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
}
</style>
