<template>
  <div class="form">
		<span> New Fire Brigade </span>
		<input type="text" placeholder="Number of fire Brigade" v-model="numberOfFireBrigade">
		<input type="text" placeholder="City" v-model="city">
		<input type="text" placeholder="deprtmentId" v-model="departmentId">
		<input type="text" placeholder="team" v-model="team">
		<button @click="newBrigade"> new Brigade </button>
	</div>
</template>

<script>
import axios from 'axios'
export default {
	name: 'FireDepartmentForms',
	data: () => ({
		numberOfFireBrigade: null,
		city: null,
		departmentId: null,
		team: null,
		newBrigadeResponse: null
	}),
	methods: {
		async newBrigade () {
			const params = {
				numberOfFireBrigade: this.numberOfFireBrigade,
				city: this.city,
				pertainFireDepartment: this.departmentId,
				team: this.team.split(',')
			}
			await axios.post('http://143.198.163.37/fireBrigade/', params)
				.then(response => {
					this.newBrigadeResponse = response.data
					console.log(this.newBrigadeResponse)
				})
				.catch(err => {
					console.log(err)
				})
		}
	}
}
</script>

<style lang="sass" scoped>
	.form
		display: flex
		flex-direction: column
		justify-content: space-evenly
		align-items: center
		& *
			margin-top: 10%
</style>