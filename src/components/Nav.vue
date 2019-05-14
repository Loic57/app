<template>
  <div class="header">
    <a href="#" class="logo"><img alt="Vue logo" src="../assets/logo.png"></a>
    <ul class="nav-primary">
      <li><router-link to="/">Accueil</router-link></li>
      <li><router-link to="/properties">Biens</router-link></li>
      <li><router-link to="/profile">Profile</router-link></li>
      <li><router-link to="/auth" v-if="!signedIn">Sign Up / Sign In</router-link></li>
      <li><amplify-sign-out v-if="signedIn"></amplify-sign-out></li>
    </ul>
  </div>
</template>

<script>
import { AmplifyEventBus } from 'aws-amplify-vue'
  import { Auth } from 'aws-amplify'

  export default {
    name: 'navigation',
    data() {
      return {
        signedIn: false
      }
    },
    beforeCreate() {
      AmplifyEventBus.$on('authState', info => {
        if (info === 'signedIn') {
          this.signedIn = true
          this.$router.push('/profile')
        }
        if (info === 'signedOut') {
          this.$router.push('/auth')
          this.signedIn = false
        }
      });

      Auth.currentAuthenticatedUser()
        .then(user => {
          this.signedIn = true
        })
        .catch(() => this.signedIn = false)
    }
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

