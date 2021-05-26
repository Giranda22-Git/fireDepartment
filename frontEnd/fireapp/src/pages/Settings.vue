<template>
<q-layout view="lHh Lpr lFf">
  <q-page-container>
    <q-page style="display: flex; align-items: center; flex-direction: column">
      <q-icon
        name="settings"
        style="font-size: 9em; color: white"
      />
      <span style="font-size: 3em; color: white">Settings</span>
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
          <q-tab name="Brigads" label="Бригады" />
          <q-tab name="Depos" label="Департаменты" />
           <q-tab name="Workers" label="Сливание" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="Brigads">
            <div class="form">
              <span class = 'title'> New Fire Brigade </span>
              <input type="text" placeholder="Number of fire Brigade" v-model="numberOfFireBrigade">
              <input type="text" placeholder="City" v-model="cityB">
              <textarea type="text" placeholder="team(перечислите id через запятую)" v-model="team"></textarea>
              <button @click="newBrigade"> new Brigade </button>
            </div>
          </q-tab-panel>

          <q-tab-panel name="Depos">
            <div class="form">
              <span class = 'title'> New Fire Department </span>
              <input type="text" placeholder="Number of fire department" v-model="numberOfFireDepartment">
              <input type="text" placeholder="City" v-model="cityD">
              <input type="text" placeholder="Region" v-model="region">
              <input type="text" placeholder="Address" v-model="address">
              <button @click="newDepartment"> new department </button>
            </div>
          </q-tab-panel>

          <q-tab-panel name="Workers">
            <div class="form">
              <span class = 'title'> Присоединение </span>
              <input type="text" placeholder="DepartmentId" v-model="departmentIdPlus">
              <textarea type="text" placeholder="team(перечислите id через запятую)" v-model="brigadesPlus"></textarea>
              <button @click="Connection"> Присоединить </button>
            </div>
          </q-tab-panel>

        </q-tab-panels>
      </q-card>
  </q-page>
  </q-page-container>
</q-layout>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Login',
  data () {
    return {
      tab: 'Brigads',
  		numberOfFireBrigade: null,
      departmentId: null,
      team: null,
      newBrigadeResponse: null,
      numberOfFireDepartment: null,
      cityD: null,
      cityB: null,
      region: null,
      address: null,
      newDepartmentResponse: null,
      brigadesPlus: null,
      departmentIdPlus: null
    }
  },
  methods: {
		async newBrigade () {
			const params = {
				numberOfFireBrigade: this.numberOfFireBrigade,
				city: this.cityB,
				team: this.team.split(',')
			}
			await axios.post('http://localhost:3000/fireBrigade/', params)
				.then(response => {
					this.newBrigadeResponse = response.data
					console.log(this.newBrigadeResponse)
				})
				.catch(err => {
					console.log(err)
				})
		},
    async newDepartment () {
			const params = {
				numberOfFireDepartment: this.numberOfFireDepartment,
				city: this.cityD,
				region: this.region,
				address: this.address
			}
			await axios.post('http://localhost:3000/fireDepartment/', params)
				.then(response => {
					this.newDepartmentResponse = response.data
					console.log(this.newDepartmentResponse)
				})
				.catch(err => {
					console.log(err)
				})
		},
    async Connection () {
			const params = {
				departmentId: this.departmentIdPlus,
        brigades: this.brigadesPlus.split(',')
			}
			await axios.post('http://localhost:3000/fireDepartment/binding', params)
				.then(response => {
					this.newDepartmentResponse = response.data
					console.log(this.newDepartmentResponse)
				})
				.catch(err => {
					console.log(err)
				})
		}
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
.q-tab-panels{
  background: #e85537;
  margin-top: 1vh;
}
.form{
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
}
.form *{
  margin-top: 20px;
}
textarea{
  width: 200px;
  height: 120px;
}
.title{
  color: white;
  font-size: 1.4em;
}
</style>