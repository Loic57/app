<template>
  <div class="header">
    <a href="#" class="logo"><img alt="Vue logo" src="../assets/logo.png"></a>
    <ul class="nav-primary">
      <li><router-link to="/">Accueil</router-link></li>
      <li><router-link to="/properties">Biens</router-link></li>
    </ul>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss">

  .header {
    display: flex;
    padding: 10px;
    align-items: center;
  }

  .logo {
    flex: 0 0 50%;
    max-width: 50%;

    img {width: 50px;}
  }

  .nav-primary {
    list-style: none;
    flex: 0 0 50%;
    max-width: 50%;
    text-align: right;
    padding: 0;
    margin: 0;

    li {
      display: inline-block;
      margin-left: 20px;
    }
  }
</style>

