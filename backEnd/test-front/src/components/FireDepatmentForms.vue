<template>
  <div class="form">
		<span> New Fire Department </span>
		<input type="text" placeholder="Number of fire department" v-model="numberOfFireDepartment">
		<input type="text" placeholder="City" v-model="city">
		<input type="text" placeholder="Region" v-model="region">
		<input type="text" placeholder="Address" v-model="address">
		<button @click="newDepartment"> new department </button>
	</div>
</template>

<script>
import axios from 'axios'
export default {
	name: 'FireDepartmentForms',
	data: () => ({
		numberOfFireDepartment: null,
		city: null,
		region: null,
		address: null,
		newDepartmentResponse: null
	}),
	methods: {
		async newDepartment () {
			const params = {
				numberOfFireDepartment: this.numberOfFireDepartment,
				city: this.city,
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