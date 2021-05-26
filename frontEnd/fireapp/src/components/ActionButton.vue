<template>
  <div id="main" v-if="IsTurned" class="main">
    <div class = 'actionButton' @click = "actionButtonPressed">Вызвать Пожарных</div>
    <div v-touch-swipe="swipeAction" class="contentBlock" id="contentBlock" v-show="stage>1" :style="`${Theme == 'black' ? 'background: #121212' : 'background: #fff'}`">
      <div style = "min-height: calc(35vh - 7%)">
        <h6 class="title">Укажите адрес</h6>
        <div class = "currentPos">
          <div class="imgBx">
            <svg width="29" height="47" viewBox="0 0 29 47" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_f)"><ellipse cx="15" cy="43" rx="8" ry="2" fill="black" fill-opacity="0.1"/></g><line x1="15" y1="28" x2="15" y2="42" stroke="#FF2600" stroke-width="2" stroke-linecap="round"/><circle cx="14.5" cy="14.5" r="14.5" fill="#FF583B"/><circle cx="14.5" cy="14.5" r="6.5" fill="#FFCC81"/><defs><filter id="filter0_f" x="5" y="39" width="20" height="8" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur"/></filter></defs></svg>
          </div>
          <div class="InfBx">
            <h6>Текущий адрес</h6>
            <h6 class="adress">{{LocalAdress}}</h6>
          </div>
          <div class="ChInfBx">
            <div class="sucBtn" @click = "completeAdress">
              <div id = 'openAllPage' v-if="stage==2">Указать</div>
              <div v-else @click.stop="closeTab">Карта</div>
            </div>
          </div>
        </div>
        <div class="button" @click="nextStep">Далее</div>
      </div>
      <q-separator />
      <div class="secondPart">
        <q-input
          color = "indigo-6"
          label-color = "grey"
          clearable
          v-model="LocalAdress"
          label="Адрес"
          >
          <template v-slot:prepend>
            <q-avatar icon="place" font-size="28px" />
          </template>
        </q-input>
        <div v-for="(el,i) in SuggestedVars" :key=i>
          <div v-if="LocalAdress && el.full_name && el.address_name" class="AdressButton" @click="LocalAdress= el.full_name || el.address_name">{{el.full_name || el.address_name}}</div>
        </div>
      </div>
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
import axios from 'axios'
export default {
  name: 'LeftDrower',
  props:{
    IsTurned: Boolean,
    Adress: String,
    Coords: Array
  },
  watch:{
  Adress(newV, oldV){
    this.LocalAdress = newV
  },
  LocalAdress(newV, oldV){
    console.log(1);
    var self = this
    this.$emit('chAdr', this.LocalAdress)
    axios.get(`https://catalog.api.2gis.com/3.0/suggests?q=${newV}&sort_point=${this.Coords[0]},${this.Coords[1]}&key=ruhwrq0201`)
    .then(function(response) {
      self.SuggestedVars = response.data?.result?.items.filter((card,index) => index < 6)
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
  },
},
  data () {
    return {
      stage: 1,
      next: false,
      LocalAdress: '',
      SuggestedVars: null
    }
  },
  Beforemount(){
    this.LocalAdress = this.Adress
  },
  methods:{
    actionButtonPressed(){
      this.stage += 1
      document.getElementById('main').style.height = '35vh'
      document.getElementById('contentBlock').style.bottom = '0'
      setTimeout(() => {
        this.turnBubbling()
      }, 100);
    },
    completeAdress(){
      this.stage += 1
      document.getElementById('main').style.height = '95vh'
    },
    turnBubbling(){
      var containBlock = document.getElementById('contentBlock')
      var but = document.querySelector('.actionButton')
      var openAllPage = document.querySelector('.openAllPage')
      var self = this
      document.querySelector('body').addEventListener('click', function(e){
        console.log(e.target);
        if(self.next == true || e.target == openAllPage || e.target == containBlock || containBlock.contains(e.target) || e.target == but){
          console.log(containBlock.contains(e.target));
        }else{
          console.log(containBlock.contains(e.target));
          self.bubblingCloseTab()
        }
      },{once: true})
    },
    swipeAction({ evt, ...info }){
      console.log(info)
      if(info?.direction == 'up' && info?.duration > 30){
        this.completeAdress()
      } else if(info.direction == 'down' && info?.duration > 30){
        this.bubblingCloseTab()
      }
    },
    bubblingCloseTab(){
      if(document.getElementById('main').style.height == '35vh'){
        setTimeout(() => {
          this.stage = 1
          document.getElementById('main').style.height = '10vh'
        }, 550);
        document.getElementById('contentBlock').style.bottom = '-100%'  
      } else {
        this.stage -= 1
        document.getElementById('main').style.height = '35vh'
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
        document.getElementById('main').style.height = '45vh'
      }, 550);
    },
    fireCall(){
      setTimeout(() => {
        this.next = false  
        this.$emit('Search')   
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
  line-height: 1.6em;
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
  padding: 5% 7% 5% 7%;
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
  min-height: 13vh;
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
.adress{
  min-height: 3em;
}
.imgBx{
  max-height: 50px;
}
.AdressButton{
  width: 80%;
  padding: 3px 5px 3px 5px;
  font-size: 1rem;
  border: 1px solid rgb(175, 19, 19);
  background-color: #e85537;
  border-radius: 10px;
  color: white;
  margin: 10px 0 10px 10%;
  text-align: center;
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
