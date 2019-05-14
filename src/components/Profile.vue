<template>
  <div class="container">
    <h1>Welcome, {{user.attributes.email}}</h1>

    <router-link to="/addProperty">Ajouter un bien immobilier</router-link><br>
    <router-link to="/addProperty">Modifier un bien immobilier</router-link>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'

export default {
  name: 'Profile',
  data() {
    return {
      user: {}
    }
  },
  beforeCreate() {
    Auth.currentAuthenticatedUser()
      .then(user => {
        this.user = user
      })
      .catch(() => console.log('not signed in...'))
  }
}
</script>