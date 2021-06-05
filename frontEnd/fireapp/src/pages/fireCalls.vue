<template>
<q-layout view="lHh Lpr lFf">
  <q-page-container>
    <q-page style="display: flex; align-items: center; flex-direction: column">
        <q-card>
        <q-tabs
          v-model="tab"
          dense
          indicator-color="primary"
          active-color="white"
          class="text-white"
          style="margin-top: 5vh"
          align="justify"
        >
          <q-tab name="MyRegion" label="Все районы" />
          <!-- <q-tab name="AllRegions" label="Все районы" /> -->
        </q-tabs>

        <input type="text" v-model="inputText" placeholder="Поиск" />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="MyRegion">
            <AdressCard v-for="element in VerifiedCards" :key="element.id" :info = "element" />
          </q-tab-panel>

          <!-- <q-tab-panel name="AllRegions">
            <AdressCard v-for="element in cards" :key="element.id" :info = "element" />
          </q-tab-panel> -->

        </q-tab-panels>
      </q-card>
  </q-page>
  </q-page-container>
</q-layout>
</template>

<script>
import AdressCard from '../components/AdressCard'
import axios from 'axios'
export default {
  name: 'Login',
  data () {
    return {
      tab: 'MyRegion',
      inputText: '',
      cards: [{
        adress: 'SomeAdress',
        time: Date.now(),
        id: 'SomeId'
      },
      {
        adress: 'AnotherAdress',
        time: Date.now(),
        id: 'SomeId2'
      }]
    }
  },
  created(){
    var self = this
    axios.get('http://localhost:3000/currentFire')
    .then(function (response) {
      console.log(response);
      self.cards = response.data
    })
    .catch(function (error) {
      console.log(error);
    })
  },
  methods: {
  },
  computed: {
    VerifiedCards(){
      return this.cards.filter(card => this.inputText.length == 0 || card.address.toUpperCase().includes(this.inputText.toUpperCase()))
    }
  },
  components:{
    AdressCard
  }
}
</script>
<style scoped>
.q-page-container{
  background: #e85537;
}
.q-tab{
  background: #e85537;
  font-weight: 800;
}
.q-card{
  background: #e85537;
  box-shadow: none;
}
input{
  background: #f8ded8;
  width: 90vw;
  border-radius: 10px;
  height: 5vh;
  border: none;
  outline: none;
  margin-top: 10vh;
  margin-left: 5vw;
  box-sizing: border-box;
  font-size: 1.4em;
}
.q-tab-panels{
  background: #e85537;
  margin-top: 1vh;
}
</style>