<template>
  <div id="main" class="main">
    <div class="contentBlock" id="contentBlock" :style="`${Theme == 'black' ? 'background: #121212' : 'background: #fff'}`">
        <div class="title">Поиск пожарной машины...</div>
        <div @click="$emit('cancelTrip')" style="margin-top: 10px; display: flex; justify-content: center; flex-direction: column; align-items: center">
            <q-btn round color="red-5" icon="close" />
            <div style = "text-align: center">Отменить<br>поездку</div>
        </div>
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
  computed: {
    Theme(){
      return this.$store.state.theme
    }
  }
}
</script>

<style scoped>
.contentBlock{
  position: absolute;
  width: 96%;
  margin-left: 2%;
  height: 22%;
  transition: 0.5s;
  padding: 5% 7% 5% 7%;
  bottom: 2%;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,0.4);
  background: #fff;
  animation: CBAppearing 0.5s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between
}
.main{
  width: 100vw;
  height:100vh;
  position: absolute;
  bottom: 0vh;
  transition: 0.5s;
  overflow: hidden;
}
.title{
    font-size: 1.5em;
}
.contentBlock h4{
  margin-top: 4%;
}
@keyframes CBAppearing{
  0%{
    bottom: -100%;
  }
  100%{
    bottom: 2%;
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
