<template>
  <div>
    <q-item
      clickable
      tag="a"
      >
      <q-item-section avatar>
        <q-icon name="add" @click="$emit('goPrev')"  style = "font-size: 30px; transform:rotate(45deg)" />
      </q-item-section>

    </q-item>
    <q-card>
      <div class = "phone">Введите СМС код</div>
      <div style="width: 100vw">
        <q-form
        @submit="onSignIn"
        class="q-gutter-md"
        >
        <q-input
          label-slot
          :loading="loadingState"
          clearable
          v-model="messageCode"
          label="Код *"
          lazy-rules
          mask="XXXXX"
          :rules="[ val => val && val.length==5 || 'Пожалуйста, введите код из СМС']"
          >
          <template v-slot:prepend>
            <q-avatar icon="mail_outline" font-size="22px" />
          </template>
        </q-input>
          <div class="buttonParent">
            <button type="submit">Подтвердить</button>
          </div>
        </q-form>
      </div>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      messageCode: '',
      loadingState: false
    }
  },
  mounted(){
    let button = document.getElementsByTagName('button')[0]
    button.addEventListener('touchstart', function(){
      button.style.background = "rgb(245,245,245)"
    })
    button.addEventListener('touchend', function(){
      button.style.background = "#fff"
    })
  },
  methods: {
    onSignIn () {
      this.loadingState = true
      setTimeout(() => {
        this.loadingState = false
        this.$store.commit('cr_token', 'SomeToken')
        this.$emit('ahead')
      }, 4000)
    }
  }
}
</script>
<style scoped>
.q-icon{
  padding: 10px;
  background: rgb(233, 233, 233);
  border-radius: 50%;
  margin-top: 7vh;
  margin-left: 6vw;
}
.q-card{
  box-shadow: none;
  margin-top: 10vh;
}
.phone{
  margin-left: 7vw;
  margin-bottom: 4vh;
  font-size: 20px;
  font-weight: 600;
}
.q-gutter-md{
  width: 90vw;
  margin-left: 3vw;
}
.buttonParent{
  display: flex;
  justify-content: center;
  align-items: center;
}
button{
  width: 70vw;
  padding: 1.7vh 0 1.7vh 0;
  background: #fff;
  border-radius: 20px;
  text-align: center;
  font-weight: 800;
  color:rgb(65, 62, 62);
  border: none;
  outline: none;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
</style>
// this.$q.notify({
//   color: 'red-5',
//   textColor: 'white',
//   icon: 'warning',
//   message: 'You need to accept the license and terms first'
// })