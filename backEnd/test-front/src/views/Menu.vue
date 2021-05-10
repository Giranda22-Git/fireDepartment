<template>
  <div class="wrapper">
		<div class="form">
			<span> New Fire </span>
			<input type="text" class="address" placeholder="address" v-model="newFireAddress">
			<button class="send" @click="newFireSend">Send</button>
		</div>
		<fireDepartmentForms class="newForm" />
		<fireBrigadeForms class="newForm" />
	</div>
</template>

<script>
import axios from 'axios'
import fireDepartmentForms from '../components/FireDepatmentForms.vue'
import fireBrigadeForms from '../components/FireBrigadeForms.vue'
let connection = null
export default {
	name: 'Menu',
	data: () => ({
		newFireAddress: null,
		phoneNumber: null
	}),
	mounted () {
		this.phoneNumber = this.$route.params.phoneNumber
		connection = new WebSocket('ws://localhost:1000/' + this.phoneNumber)
		connection.onmessage = async msg => {
			msg = JSON.parse(msg.data)
			console.log(msg)
			if (msg.action === 'registeredNewFire')
				console.log(msg)
		}
	},
	methods: {
		async newFireSend () {
			const causing = await axios.get('http://localhost:3000/users/login/'+this.phoneNumber)
			console.log(causing)
			const message = {
				action: 'newFire',
        agent: 'user',
        data: {
					causing: causing.data._id,
          address: this.newFireAddress
        }
      }
			connection.send(JSON.stringify(message))
		}
	},
	components: {
		fireDepartmentForms,
		fireBrigadeForms
	}
}
</script>

<style lang="sass" scoped>
	.wrapper
		width: 100vw
		min-height: 100vh
		display: flex
		flex-direction: column
		justify-content: flex-start
		align-items: center
		.form
			display: flex
			flex-direction: column
			justify-content: space-evenly
			align-items: center
			& *
				margin-top: 10%
		.newForm
			margin-top: 5%
</style>