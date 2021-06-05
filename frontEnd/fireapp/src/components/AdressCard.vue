<template>
  <div class = "mainDiv">
    <div class="flex">
      <div class="flexInfo">{{info.address}}</div>
      <div class="flexInfo">{{new Date(Date.parse(info.date)).toLocaleString('ru',options)}}</div>
    </div>
    <button>Выехать</button>
  </div>
</template>

<script>
export default {
  name: 'EssentialLink',
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  data(){
    return {
      options: {
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }
    }
  }
}
</script>

<style scoped>

.mainDiv{
  width: 100%;
  margin: 2vh auto;
  background: #f8ded8;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
}
.flex{
  display: flex;
  justify-content: space-between;
}
.flexInfo{
  max-width: 50%;
  padding: 2%;
  font-size: 1.2em;
  color: #3b3b3b;
  font-weight: 500;
}
button{
  width: 40%;
  padding: 1.7vh 0 1.7vh 0;
  background:#e85537;
  border-radius: 20px;
  text-align: center;
  font-weight: 600;
  color: #fff;
  border: none;
  outline: none;
  margin: 3% 3% 3% 52%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
</style>