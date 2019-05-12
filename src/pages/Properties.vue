<template>
  <div class="page-articles">
    <div class="container">
      <h1>Biens immobiliers</h1>
      <h4 v-if="loading">Loading...</h4>
      <form action="">
        <div class="input">
          <label>Type de bien</label><br>
          <select v-model="categoryInput" @change="onChange()">
            <option value="Tous" selected>Sélectionner un type de bien</option>
            <option value="Maison">Maison</option>
            <option value="Appartement">Appartement</option>
          </select>
          {{categoryInput}}
        </div>

        <div class="input">
          <label>Surface en m²</label><br>
          <select>
            <option>Min</option>
            <option>10</option>
            <option>20</option>
            <option>30</option>
            <option>40</option>
            <option>50</option>
            <option>60</option>
            <option>70</option>
            <option>80</option>
            <option>90</option>
            <option>100</option>
            <option>110</option>
            <option>120</option>
            <option>130</option>
            <option>140</option>
            <option>150</option>
            <option>160</option>
            <option>170</option>
            <option>180</option>
            <option>190</option>
            <option>200</option>
          </select>
          <select>
            <option>Max</option>
            <option>10</option>
            <option>20</option>
            <option>30</option>
            <option>40</option>
            <option>50</option>
            <option>60</option>
            <option>70</option>
            <option>80</option>
            <option>90</option>
            <option>100</option>
            <option>110</option>
            <option>120</option>
            <option>130</option>
            <option>140</option>
            <option>150</option>
            <option>160</option>
            <option>170</option>
            <option>180</option>
            <option>190</option>
            <option>200</option>
          </select>
        </div>
      </form>
      <div class="grid-flex">
        <div class="column" v-for="property in properties" :key="property.id">
          <Property :property="property"/>
        </div>
      </div>

    </div>
  </div>
</template>


<script>
  import Property from "../components/Property"
  //import SearchForm from "../components/SearchForm"
  import { API, graphqlOperation } from 'aws-amplify'
  import { listPropertys } from '../graphql/queries';
  import gql from 'graphql-tag'


  export default {
    components: {
      Property,
      //SearchForm
    },
    data() {
      return {
        // Initialize your apollo data
        properties: [],
        loading: 0,
        categoryInput: 'Tous'
      }
    },
    apollo: { //Apollo object
      properties: { //property
        query: listPropertys,
        update(data) {
          return data.listPropertys.items;
        }
      }
    },
		methods: {
			onChange() {
				//this.$apollo.queries.properties.skip = false
				this.$apollo.queries.properties.refetch()
			}
		}
  }
</script>

<style lang="scss">

</style>

