<template>
  <div class="container">
    <h1>Ajouter un bien immobilier</h1>

    <form @submit.prevent="addProperty">
      <div class="input">
        <label><input type="radio" name="choix" v-model="status" value="acheter" /> Acheter</label><br>
        <label><input type="radio" name="choix" v-model="status" value="louer" /> Louer</label><br>
        <label><input type="radio" name="choix" v-model="status" value="viager" /> Viager </label>
      </div>

      <div class="input">
        <label>Type de bien</label><br>
        <select v-model="category">
          <option value="" :selected="true">Sélectionner un type de bien</option>
          <option value="Maison">Maison</option>
          <option value="Appartement">Appartement</option>
        </select>
      </div>

      <div class="input">
        <label>Surface en m²</label><br>
        <input type="text" v-model="area">
      </div>

      <div class="input">
        <label>Prix</label><br>
        <input type="text" v-model="price">
      </div>

      <div class="input">
        <label>Pièces</label><br>
        <input type="text" v-model="rooms">
      </div>

      <div class="input">
        <label>Chambres</label><br>
        <input type="text" v-model="bedrooms">
      </div>

      <div class="input">
        <label>Salles de bains</label><br>
        <input type="text" v-model="bathrooms">
      </div>

      <div class="input">
        <label>Parkings</label><br>
        <input type="text" v-model="parkings">
      </div>

      <div class="input">
        <label>Garages</label><br>
        <input type="text" v-model="garages">
      </div>

      <div class="input">
        <label>Localisation</label><br>
        <vue-google-autocomplete
          ref="address"
          id="map"
          classname="form-control"
          placeholder="Start typing"
          v-on:placechanged="getAddressData"
          types="(cities)"
          country="be"
          v-model="location"
        >
        </vue-google-autocomplete>
      </div>

      <div class="input">
        <label>Localisation exacte</label><br>
        <input type="text" v-model="exact_location">
      </div>

      <div class="input">
        <label>Titre</label><br>
        <input type="text" v-model="title">
      </div>

      <div class="input"><button type="submit">Ajouter nouveau bien</button></div>
    </form>
  </div>
</template>

<script>
  import VueGoogleAutocomplete from 'vue-google-autocomplete'
  import { createProperty } from '../graphql/mutations';

  export default {
    name: 'addProperty',
    components: {
      VueGoogleAutocomplete
    },
    data() {
      return {
        id: 50,
        title: '',
        category: '',
        price: null,
        bedrooms: null,
        bathrooms: null,
        area: null,
        status: '',
        rooms: null,
        garages: null,
        parkings: null,
        location: '',
        exact_location: '',
      }
    },
    methods: {
      addProperty() {
        const { id, title, category, price, bedrooms, bathrooms, area, status, rooms, garages, parkings, location, exact_location} = this.$data;

        this.$apollo.mutate({
          mutation: createProperty,
          variables: {
            input: {
              id,
              title,
              category,
              price,
              bedrooms,
              bathrooms,
              area,
              status,
              rooms,
              garages,
              parkings,
              location,
              exact_location
            }
          }
        }).then((data) => {

        })
      },
      getAddressData: function (addressData, placeResultData, id) {
        this.address = addressData;
        this.location = this.address.locality;
      }
    }
  }
</script>

<style lang="scss">

</style>

