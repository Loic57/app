<template>
  <div class="page-articles">
    <div class="container">
      <h1>Biens immobiliers</h1>
      <h4 v-if="loading">Loading...</h4>
     
      <div class="mt-3" v-if="propertyCreated">Le bien immobilier a bien été créé.</div>
      <div class="mt-3" v-if="propertyUpdated">Le bien immobilier a bien été mis à jour.</div>
      <div class="grid-flex" >
        <div v-if="properties == 0">Aucun bien pour le moment</div>
        <div class="column w-100" v-for="property in properties" :key="property.id">
          <PropertyRow :property="property"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import PropertyRow from "../components/PropertyRow"
  import { listPropertys } from '../../graphql/queries';

  export default {
    components: {
      PropertyRow
    },
    data() {
      return {
        properties: [],
        loading: 0,
        TypeValue: 'all',
        StatusValue: 'all',
        AreaMinValue: 0,
        AreaMaxValue: 999999,
        PriceMinValue: 0,
        PriceMaxValue: 99999999,
        LocationValue: 'all',
        PriceRange: {
          "min": "min",
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
        },
        propertyCreated: this.$route.params.propertyCreated,
        propertyUpdated: this.$route.params.propertyUpdated,
      }
    },
    apollo: { 
      properties: { 
        query: listPropertys,
        update(data) {
          return data.listPropertys.items;
        }
      }
    },
    mounted() {
      setTimeout(() => {
        if(this.propertyCreated || this.propertyUpdated)
          this.propertyCreated = false;
          this.propertyUpdated = false;
      }, 4000)
    }
  }
</script>

<style lang="scss">
  .input {
    margin-top: 20px;
  }
</style>

