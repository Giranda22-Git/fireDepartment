<template>
  <div id="app">
    {{ actionMsg }}
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
      this.actionMsg = msg
      console.log(msg)
    }
  }
}
</script>

<style>
</style>
