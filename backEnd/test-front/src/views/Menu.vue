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
		phoneNumber: null,
    userData: null
	}),
	async mounted () {
		this.phoneNumber = this.$route.params.phoneNumber
    await axios.get('http://localhost:3000/users/login/' + this.phoneNumber)
      .then(response => {
        this.userData = response.data
        console.log(this.userData)
      })
      .catch(err => {
        console.log(err)
      })
		connection = new WebSocket('ws://localhost:1000/' + this.phoneNumber)
		connection.onmessage = async msg => {
			msg = JSON.parse(msg.data)
			console.log(msg)
			if (msg.action === 'registeredNewFire' && this.userData.typeOfUser === 'fireman') {
        const message = {
          action: 'takeCall',
          agent: 'fireMan',
          data: {
            fireManId: this.userData._id,
            causing: msg.data.resultRegistrationNewFire.causing,
            currentFireId: msg.data.resultRegistrationNewFire._id
          }
        }
				connection.send(JSON.stringify(message))
      }
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