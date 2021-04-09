<template>
    <div class="content">
      <div class="mainPage" v-if="!lastMsg">
        <h6>Внимание</h6>
        <h2>Пожар на</h2>
        <h4>{{Adress}}</h4>
        <div class="button-parent">
          <div class="button" @click = "HideParent">В путь!</div>
        </div>
      </div>
      <div class="lastMsg">
        <div style="font-size: 2em; color: #fff; width: 100%; text-align: center" v-if = "lastMsg">
          "Сухих Вам рукавов!"
        </div>
      </div>
  </div>
</template>

<script>
export default {
  props:{
    Adress: String
  },
  data () {
    return {
      lastMsg: false
    }
  },
  methods:{
    HideParent(){
      document.querySelector('.mainPage').style.opacity = '0'
      setTimeout(() => {
        this.$router.push('/')
        this.lastMsg = true
        document.querySelector('.lastMsg').style.opacity = '1'
        setTimeout(() => {
          document.querySelector('.content').style.opacity = '0'
          setTimeout(() => {
            this.$emit('HideModal')
          }, 2000);
        }, 2000);
      }, 2000);

    }
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
  color:rgb(65, 62, 62);
}
.lastMsg{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  transition: 2s;
  pointer-events: none;
  opacity: 0;
}
.mainPage{
  transition: 2s;
}
</style>