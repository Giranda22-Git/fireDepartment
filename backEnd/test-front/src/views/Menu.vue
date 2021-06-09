<template>
  <div class="wrapper">
		<div class="form">
			<span> New Fire </span>
			<input type="text" class="address" placeholder="address" v-model="newFireAddress">
			<button class="send" @click="newFireSend">Send</button>
      <button @click="brigadeArrived">Arrived</button>
      <button @click="sendEnd">End</button>
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
    userData: null,
    activeCausingPhoneNumber: null,
    activeFireManPhoneNumber: null,
    loopKey: null,
    report: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum tempora vel voluptas saepe quaerat earum, a quos. Neque odio, aliquam asperiores explicabo earum rerum at obcaecati nisi eum praesentium tempora!',
    victims: [
      {
        state: 'alive'
      }
    ],
    combustionPercentage: '50%'
	}),
	async mounted () {
		this.phoneNumber = this.$route.params.phoneNumber
    await axios.get('http://143.198.163.37/users/login/' + this.phoneNumber)
      .then(response => {
        this.userData = response.data
        console.log(this.userData)
      })
      .catch(err => {
        console.log(err)
      })
		connection = new WebSocket('ws://143.198.163.37:1000/' + this.phoneNumber)
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

      if (msg.action === 'fireTruckDispatched') {
        this.activeFireManPhoneNumber = msg.data.fireManPhoneNumber
      }

      if (msg.action === 'startGeoDataTransfering') {
        const geoDataTranfering = {
          action: 'geoDataTransfering',
          agent: 'fireMan',
          data: {
            phoneNumber: msg.data.causingPhoneNumber,
            geoData: {
              latitude: Math.floor(Math.random() * 100) + 1,
              altitude: Math.floor(Math.random() * 100) + 1
            }
          }
        }
        this.activeCausingPhoneNumber = msg.data.causingPhoneNumber
        this.loopSendGeoData(geoDataTranfering)
      }

      if (msg.action === 'fireBrigadeArrived') {
        clearInterval(this.loopKey)
      }
		}
	},
	methods: {
		async newFireSend () {
			const causing = await axios.get('http://143.198.163.37/users/login/'+this.phoneNumber)
			console.log(causing)
			const message = {
				action: 'newFire',
        agent: 'user',
        data: {
					causing: causing.data._id,
          address: this.newFireAddress,
          geoData: {
            latitude: 54,
            altitude: 45
          }
        }
      }
			connection.send(JSON.stringify(message))
		},
    brigadeArrived () {
      const message = {
        action: 'fireBrigadeArrived',
        agent: 'client',
        data: {
          fireManPhoneNumber: this.activeFireManPhoneNumber,
          loopKey: this.loopKey
        }
      }
      connection.send(JSON.stringify(message))
    },
    sendEnd () {
      const message = {
        action: 'fireFightingIsOver',
        agent: 'fireMan',
        data: {
          fireManPhoneNumber: this.activeFireManPhoneNumber,
          report: this.report,
          victims: this.victims,
          combustionPercentage: this.combustionPercentage
        }
      }
      connection.send(JSON.stringify(message))
    },
    loopSendGeoData (message) {
      this.loopKey = setInterval(() => connection.send(JSON.stringify(message)), 500)
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