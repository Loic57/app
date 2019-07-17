<template>
  <div class="page-articles">
    <div class="container">
      <h1>Biens immobiliers</h1>
      <h4 v-if="loading">Loading...</h4>

      <div class="grid-flex">
        <div class="column w-50">
          <form v-on:submit.prevent>

            <div class="input">
              <label><input type="radio" name="choix" v-model="StatusValue" value="all" /> Tout </label><br>
              <label><input type="radio" name="choix" v-model="StatusValue" value="acheter" /> Acheter</label><br>
              <label><input type="radio" name="choix" v-model="StatusValue" value="louer" /> Louer</label><br>
              <label><input type="radio" name="choix" v-model="StatusValue" value="viager" /> Viager </label>
            </div>

            <div class="input">
              <label>Type de bien</label><br>
              <select v-model="TypeValue">
                <option value="" :selected="true">Sélectionner un type de bien</option>
                <option value="all">Tous</option>
                <option value="Maison">Maison</option>
                <option value="Appartement">Appartement</option>
              </select>
            </div>

            <div class="input">
              <label>Surface en m²</label><br>
              <select v-model="AreaMinValue">
                <option :selected="true" disabled>Min</option>
                <option v-for="(item, key) in AreaRange" :value="key" :key="item">{{item}}</option>
              </select>
              <select v-model="AreaMaxValue">
                <option :selected="true" disabled>Max</option>
                <option v-for="(item, key) in AreaRange" :value="key" :key="item">{{item}}</option>
              </select>
            </div>

            <div class="input">
              <label>Prix</label><br>
              <select v-model="PriceMinValue" id="PriceMin">
                <option value="" :selected="true">Min</option>
                <option v-for="(item, key) in PriceRange" :value="key" :key="item">{{item}}</option>
              </select>
              <select v-model="PriceMaxValue" id="PriceMax">
                <option value="" :selected="true">Max</option>
                <option v-for="(item, key) in PriceRange" :value="key" :key="item">{{item}}</option>
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

            <button type="button" @click="cleanFilters()">Clean filters</button>
          </form>
        </div>
        <div class="column w-50">

          <select @change="changeOrder($event)">
            <option selected>Trier</option>
            <option value="ascendingPrice">Par prix du moins cher au plus cher</option>
            <option value="decreasingPrice">Par prix du plus cher au moins cher</option>
            <option value="ascendingArea">De la plus petite surface à la plus grande</option>
            <option value="decreasingArea">De la plus grande surface à la plus petite</option>
          </select>
        </div>
      </div>

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
  import VueGoogleAutocomplete from 'vue-google-autocomplete'

  export default {
    components: {
      Property,
      VueGoogleAutocomplete
    },
    data() {
      return {
        properties: [],
        loading: 0,
        TypeValue: this.$route.params.TypeValue || 'all',
        StatusValue: this.$route.params.StatusValue || 'all',
        AreaMinValue: 0,
        AreaMaxValue: 999999,
        PriceMinValue: 0,
        PriceMaxValue: 99999999,
        LocationValue: this.$route.params.LocationValue || '',
        PriceRange: {
          "10000":"10000",
          "50000":"50000",
          "100000":"100000",
          "150000":"150000",
          "200000":"200000",
          "250000":"250000",
          "300000":"300000",
          "350000":"350000",
          "400000":"400000",
          "500000":"500000",
          "550000":"550000",
          "600000":"600000",
          "650000":"650000",
          "700000":"700000",
          "750000":"750000",
          "800000":"800000",
          "850000":"850000",
          "900000":"900000",
          "950000":"950000",
          "1000000":"1000000"
        },
        AreaRange: {
          "10":"10",
          "20":"20",
          "30":"30",
          "40":"40",
          "50":"50",
          "60":"60",
          "70":"70",
          "80":"80",
          "90":"90",
          "100":"100",
          "110":"110",
          "120":"120",
          "130":"130",
          "140":"140",
          "150":"150",
          "160":"160",
          "170":"170",
          "180":"180",
          "190":"190",
          "200":"200"
        }
      }
    },
    apollo: { 
      properties: { 
        query: listPropertys,
        variables() {
          if(this.LocationValue == '') {
            return {
              "filter": {
                "status": {
                  "contains": this.StatusValue
                },
                "area": {
                  "ge": this.AreaMinValue, 
                  "le": this.AreaMaxValue
                },
                "price": {
                  "ge": this.PriceMinValue, 
                  "le": this.PriceMaxValue
                },
                "type": {
                  "contains": this.TypeValue
                },
                "hidden": {
                  "eq": false
                }
              }
            }
          }
          else {
            return {
              "filter": {
                "status": {
                  "contains": this.StatusValue
                },
                "area": {
                  "ge": this.AreaMinValue, 
                  "le": this.AreaMaxValue
                },
                "price": {
                  "ge": this.PriceMinValue, 
                  "le": this.PriceMaxValue
                },
                "type": {
                  "contains": this.TypeValue
                },
                "location": {
                  "contains": this.LocationValue
                },
                "hidden": {
                  "eq": false
                }
              }
            }
          }
        },
        update(data) {
          return data.listPropertys.items
        }
      }
    },
    mounted() {
      // To demonstrate functionality of exposed component functions
      // Here we make focus on the user input
      this.$refs.address.focus();
    },
    methods: {
      cleanFilters: function() {
        this.TypeValue = 'all';
        this.StatusValue = 'all';
        this.LocationValue = '';
        this.AreaMinValue = 0;
        this.AreaMaxValue = 999999;
        this.PriceMinValue = 0;
        this.PriceMaxValue = 99999999;
      },
      changeOrder(event) {
        if(event.target.value === 'ascendingPrice') {
          function orderASC(a, b) {
            if (a.price < b.price)
              return -1;
            if (a.price > b.price)
              return 1;
            return 0;
          }

          return this.properties.sort(orderASC);
        }

        if(event.target.value === 'decreasingPrice') {
          function orderDESC(a, b) {
            if (a.price < b.price)
              return 1;
            if (a.price > b.price)
              return -1;
            return 0;
          }

          return this.properties.sort(orderDESC);
        }

        if(event.target.value === 'ascendingArea') {
          function orderASC(a, b) {
            if (a.area < b.area)
              return -1;
            if (a.area > b.area)
              return 1;
            return 0;
          }

          return this.properties.sort(orderASC);
        }

        if(event.target.value === 'ascendingArea') {
          function orderASC(a, b) {
            if (a.area < b.area)
              return -1;
            if (a.area > b.area)
              return 1;
            return 0;
          }

          return this.properties.sort(orderASC);
        }
      },
      getAddressData: function (addressData) {
        this.address = addressData;
        this.LocationValue = this.address.locality;
      }
    }
  }
</script>

<style lang="scss">
  .input {
    margin-top: 20px;
  }
</style>

