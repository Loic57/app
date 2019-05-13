<template>
  <div class="page-articles">
    <div class="container">
      <h1>Biens immobiliers</h1>
   
    </div>
  </div>
</template>

<script>
  import Property from "../components/Property"
  import { getProperty } from '../graphql/queries';
  import VueGoogleAutocomplete from 'vue-google-autocomplete'

  export default {
    components: {
      Property,
      VueGoogleAutocomplete
    },
    data() {
      return {

      }
    },
    apollo: { 
      property: { 
        query: getProperty,
        update(data) {
          return data.getProperty.items;
        }
      }
    }
  }
</script>

<style lang="scss">
</style>

