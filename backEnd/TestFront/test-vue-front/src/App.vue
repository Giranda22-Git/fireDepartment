<template>
  <div id="app">
    <div class="button" @click="newFire">new Fire</div>
  </div>
</template>

<script>
const connection = new WebSocket('ws://localhost:1000/+7(705)553-99-66')
export default {
  name: 'App',
  data: () => ({
    actionMsg: null
  }),
  mounted () {
    connection.onmessage = async (msg) => {
      this.actionMsg = JSON.parse(msg.data)
      console.log(this.actionMsg)
    }
  },
  methods: {
    newFire () {
      const message = {
        action: 'newFire',
        agent: 'user',
        data: {
          address: 'abay auezova 31'
        }
      }
      console.log(message)
      connection.send(JSON.stringify(message))
    }
  }
}
</script>

<style>
</style>
