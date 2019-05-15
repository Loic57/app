<template>
  <div class="container">
    <h1>Ajouter un bien immobilier</h1>

    <form @submit.prevent="addProperty">
      <div class="input">
        <label><input type="radio" name="choix" v-model="status" value="acheter" selected="selected"/> Acheter</label><br>
        <label><input type="radio" name="choix" v-model="status" value="louer" /> Louer</label><br>
        <label><input type="radio" name="choix" v-model="status" value="viager" /> Viager </label>
      </div>

      <div class="input">
        <label>Type de bien</label><br>
        <select v-model="category" required>
          <option value="" :selected="true">Sélectionner un type de bien</option>
          <option value="Maison">Maison</option>
          <option value="Appartement">Appartement</option>
        </select>
      </div>

      <div class="input">
        <label>Surface en m²</label><br>
        <input type="text" v-model="area" required>
      </div>

      <div class="input">
        <label>Prix</label><br>
        <input type="text" v-model="price" required>
      </div>

      <div class="input">
        <label>Pièces</label><br>
        <input type="text" v-model="rooms" required>
      </div>

      <div class="input">
        <label>Chambres</label><br>
        <input type="text" v-model="bedrooms" required>
      </div>

      <div class="input">
        <label>Salles de bains</label><br>
        <input type="text" v-model="bathrooms" required>
      </div>

      <div class="input">
        <label>Parkings</label><br>
        <input type="text" v-model="parkings" required>
      </div>

      <div class="input">
        <label>Garages</label><br>
        <input type="text" v-model="garages" required>
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
  import { createProperty } from '../../graphql/mutations';

  export default {
    name: 'addProperty',
    components: {
      VueGoogleAutocomplete
    },
    data() {
      return {
        id: '',
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
        const id = Math.randomInt(100000),
          title = this.title,
          category = this.category,
          status = this.status,
          location = this.location,
          exact_location = this.exact_location,
          price = parseInt(this.price),
          bedrooms = parseInt(this.bedrooms),
          bathrooms = parseInt(this.bathrooms),
          area = parseInt(this.area),
          rooms = parseInt(this.rooms),
          garages = parseInt(this.garages),
          parkings = parseInt(this.parkings);

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
          this.$router.push({ name: 'IndexPosts' })
        }).catch((error) => {
          console.log(error)
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

