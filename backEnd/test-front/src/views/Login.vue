<template>
  <div class="wrapper">
		<div class="authForm">
			<span> Login </span>
			<input v-model="phoneNumber" type="text" class="phoneNumber" v-mask="{mask: '+7(999)999-99-99'}" placeholder="phone number">
			<button @click="send" class="send">Send</button>
			<br><br>
			<span> Verify code </span>
			<input v-model="verifyCode" type="text" class="verifyCode" v-mask="{mask: '99  99  99'}" placeholder="verify code">
			<button @click="verify" class="verify">Verify</button>
			<button @click="send" class="tryAgain">отправить код повторно</button>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import sweetalert2 from 'sweetalert2'
export default {
	name: 'Login',
	data: () => ({
		phoneNumber: null,
		verifyCode: null
	}),
	methods: {
		async send () {
			const params = {
				phoneNumber: this.phoneNumber
			}
			await axios.post('http://localhost:3000/verification', params)
				.then(response => {
          if (response.data !== '') {
            console.log(response.data)
            sweetalert2.fire({
              title: 'Введите код потверждения',
              text: 'мы отправили сообщение с кодом подтверждения на ваш номер телефона',
              icon: 'success',
              confirmButtonText: 'OK'
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
		},
		async verify () {
			const verifyCode = this.verifyCode.replace(/\s+/g, '')
			const params = {
				phoneNumber: this.phoneNumber,
				verificationCode: verifyCode
			}
			await axios.post('http://localhost:3000/verification/verify', params)
				.then(response => {
          if (!response.data.result) {
            console.log(response.data)
            sweetalert2.fire({
              title: 'Ошибка',
              text: 'код введен не верно, попробуйте еще раз',
              icon: 'error',
              confirmButtonText: 'OK'
            })
          } else {
            sweetalert2.fire({
              title: 'OK',
              text: 'С возвращением',
              icon: 'success',
              confirmButtonText: 'Войти'
            }).then(() => {
              window.location.href = 'http://localhost:8080/menu'
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
		}
	}
}
</script>

<style lang="sass" scoped>
	.wrapper
		width: 100vw
		height: 100vh
		display: flex
		justify-content: center
		align-items: center
		.authForm
			width: 30%
			height: 30%
			display: flex
			flex-direction: column
			justify-content: space-evenly
			align-items: center
</style>
