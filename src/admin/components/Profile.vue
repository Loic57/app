<template>
  <div class="container">
    <h1>Welcome</h1>

    <router-link to="/admin/addProperty">Ajouter un bien immobilier</router-link><br>
    <router-link to="/admin/properties">Modifier un bien immobilier</router-link>
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