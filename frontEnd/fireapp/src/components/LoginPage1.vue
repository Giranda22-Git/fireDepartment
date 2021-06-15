<template>
  <div class="content">
    <h6>Добро пожаловать</h6>
    <h2>101.kz</h2>
    <h4>Вызов пожарных через телефон!</h4>
    <div class="button-parent">
      <div class="button" @click = "$emit('ahead')">Вход</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login1',
  data () {
    return {
    }
  },
  mounted(){
    let button = document.querySelector('.button')
    button.addEventListener('touchstart', function(){
      button.style.background = "rgb(245,245,245)"
    })
    button.addEventListener('touchend', function(){
      button.style.background = "#fff"
    })
  }
}
</script>
<style scoped>
.content{
    width: 100vw;
    height: 100vh;
    background: #e85537;
}
h2,
h4,
h6{
  color: #fff;
  margin-left: 10%;
  margin-block-start: 0;
  margin-block-end: 0;
}
h2{
  margin-block-start: 0.3em;
  font-weight: 500;
}
h6{
  margin-block-start: 3em;
  opacity: 0.6
}
h4{
  margin-block-start: 0.5em;
  max-width: 300px;
  font-weight: 300;
}
.button-parent{
  position: absolute;
  width: 100%;
  bottom: 4vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.button{
  width: 70vw;
  padding: 1.7vh 0 1.7vh 0;
  background: #fff;
  border-radius: 20px;
  text-align: center;
  font-weight: 800;
  color:rgb(65, 62, 62)
}
</style>