<template>
  <div class="pulse">
    <span style="--i: 1"></span>
    <span style="--i: 2"></span>
    <span style="--i: 3"></span>
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
  position: absolute;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  pointer-events: none;
}
.pulse span {
  position: absolute;
  top: 52%;
  background-color: #b43131;
  border-radius: 50%;
  display: inline-block;
  width: 100px;
  height: 100px;
  animation: animate 2s linear infinite;
  animation-delay: calc(-1s * var(--i));
}
@keyframes animate {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  90% {
    transform: scale(4);
  }
  100% {
    transform: scale(5);
    opacity: 0;
  }
}
</style>