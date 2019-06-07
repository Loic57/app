<template>
  <div class="page-home">
    <div class="container">
      <h1>Homepage</h1>
      <div class="grid-flex" >
        <div class="column w-33" v-for="property in properties" :key="property.id">
          <Property :property="property"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Property from "../components/Property"
  import { listPropertys } from '../graphql/queries';

  export default {
    components: {
      Property
    },
    data() {
      return {
        properties: []
      }
    },
    apollo: { 
      properties: { 
        query: listPropertys,
        variables() {
          return {
            featuredProperty: true
          }
        },
        update(data) {
          return data.listPropertys.items;
        }
      }
    }
  }
</script>

<style lang="scss">
  .class {color: red;}
</style>