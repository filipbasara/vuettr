<template>
  <div id="app">
    <Vuettr/>
  </div>
</template>

<script>
import Vuettr from "./components/Vuettr.vue";
import "./assets/css/reset.css";
import "./assets/css/basic.css";

export default {
  name: "app",
  components: {
    Vuettr
  }
};
</script>

<style>
html,
body {
  height: 100%;
  max-height: 100%;
  background-color: rgb(46, 169, 240);
}
#app {
  max-width: 50%;
  width: auto;
  margin: 0 auto;
  padding: 2rem;
}
@media screen and (max-width: 1440px) {
  #app {
    max-width: 90%;
    padding: 1rem;
  }
}
@media screen and (max-width: 720px) {
  #app {
    max-width: 100%;
    padding: 0.5rem;
  }
}
</style> 





