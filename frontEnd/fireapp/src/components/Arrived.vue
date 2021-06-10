<template>
    <div class="content">
      <div class="mainPage2" v-if="!lastMsg">
        <h6 v-if="text == 'Ord'">Пожарник на месте</h6>
        <h6 v-if="text == 'Saver'">Вы на месте</h6>
      </div>
    </div>
</template>

<script>
export default {
  props:{
    text: String
  },
  data () {
    return {
      lastMsg: false
    }
  },
  mounted(){
    setTimeout(() => {
        document.querySelector('.content').style.opacity = '0'
    }, 2000);
    setTimeout(() => {
        document.querySelector('.content').style.display = 'none'
    }, 4000);
    setTimeout(() => {
      // location.reload()
    }, 6000);
  }
}
</script>
<style scoped>
.content{
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 2003;
    background-color: #e85537;
    transition: 2s;
}
h6{
  margin-block-start: 6em;
  color: #fff;
  margin-left: 10%;
  margin-block-end: 0;
  font-size: 2.3em;
}
.mainPage2{
  transition: 2s;
}
</style>