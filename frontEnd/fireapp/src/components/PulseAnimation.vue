<template>
  <div class="pulse">
    <div style="position: absolute; z-index: 10; font-size: 2em; color: #ffb340">
      Поиск...
    </div>
    <span style="--i: 1"></span>
    <span style="--i: 2"></span>
    <span style="--i: 3"></span>
    <span style="--i: 4"></span>
    <span style="--i: 5"></span>
  </div>
</template>

<script>
export default {
  name: "Home",
  mounted() {},
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.pulse {
  animation: opacity 2s;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  background: #b43131;
  border-radius: 50%;
  top: 53vh
}
.pulse span {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #b43131;
  border-radius: 50%;
  display: inline-block;
  width: 100%;
  height: 100%;
  animation: animate 2.5s linear infinite;
  animation-delay: calc(-0.5s * var(--i));
}
@keyframes animate {
  0% {
    transform: scale(1);
  }
  90% {
    transform: scale(3);
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}
@keyframes opacity{
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
}
</style>