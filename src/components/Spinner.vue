
<template>
  <pulse-loader></pulse-loader>
</template>

<script>
  import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

  export default {
    name: 'spinner',
    components: {
      PulseLoader
    }
  }
</script>



<style lang="scss">
  .v-spinner {
    height: 100vh;
    width: 100vw;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,0.5);
    z-index: 1;
  }
</style>
