<template>
  <div class="page-home">
    <div class="container">
      <h1>Homepage</h1>

       <form>

        <div class="input">
          <label><input type="radio" name="choix" v-model="StatusValue" value="acheter" selected="selected"/> Acheter</label><br>
          <label><input type="radio" name="choix" v-model="StatusValue" value="louer" /> Louer</label><br>
          <label><input type="radio" name="choix" v-model="StatusValue" value="viager" /> Viager </label>
        </div>

        <div class="input">
          <select v-model="TypeValue">
            <option value="" :selected="true">Sélectionner un type de bien</option>
            <option value="all">Tous</option>
            <option value="Maison">Maison</option>
            <option value="Appartement">Appartement</option>
          </select>
        </div>

        <div class="input">
          <vue-google-autocomplete
            ref="address"
            id="map"
            classname="form-control"
            placeholder="Start typing"
            v-on:placechanged="getAddressData"
            types="(cities)"
            country="be"
            v-model="LocationValue"
          >
          </vue-google-autocomplete>
          {{LocationValue}}
        </div>

        <button type="button" @click="checkForm">Submit</button>
      </form>
      <div class="grid-flex">
        <div class="column w-33" v-for="property in properties" :key="property.id">
          <Property :property="property" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Property from "../components/Property"
  import { listPropertys } from '../graphql/queries';
  import VueGoogleAutocomplete from 'vue-google-autocomplete'

  export default {
    components: {
      Property,
      VueGoogleAutocomplete
    },
    data() {
      return {
        properties: [],
        TypeValue: '',
        StatusValue: '',
        LocationValue: ''
      }
    },
    apollo: { 
      properties: { 
        query: listPropertys,
        update(data) {
          this.$apollo.queries.properties.refetch({
            "filter": {
              "featuredProperty": {
                "eq": true
              }
            }
          })
          return data.listPropertys.items;
        }
      }
    },
    methods:  {
      checkForm()  {
        this.$router.push({ 
          name: 'properties', 
          params: {
            TypeValue: this.TypeValue,
            StatusValue: this.StatusValue,
            LocationValue: this.LocationValue
          } 
        })
      },
      getAddressData: function (addressData, placeResultData, id) {
        this.address = addressData;
        this.LocationValue = this.address.locality;
      }
    }
  }
</script>

<style lang="scss">
  .class {color: red;}
</style>