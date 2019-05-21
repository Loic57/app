<template>
  <div class="container">
    <h1>Editer le bien  {{property.reference}} </h1> 

    <form @submit.prevent="editProperty">
      <!-- :checked="property.status[1] === 'viager'" -->
      <div class="input">
        <label><input type="radio" v-model="property.status" name="choix" value="acheter" /> Acheter</label><br>
        <label><input type="radio" v-model="property.status" name="choix" value="louer" /> Louer</label><br>
        <label><input type="radio" v-model="property.status" name="choix" value="viager" /> Viager</label><br>
      </div>

      <div class="input">
        <label>Type de bien</label><br>
        <select required v-model="property.type">
          <option value="">Sélectionner un type de bien</option>
          <option value="Maison">Maison</option>
          <option value="Appartement">Appartement</option>
        </select>
      </div>

      <div class="input">
        <label>Surface en m²</label><br>
        <input type="text" v-model="property.area" required>
      </div>

      <div class="input">
        <label>Prix</label><br>
        <input type="text" v-model="property.price" required>
      </div>

      <div class="input">
        <label>Pièces</label><br>
        <input type="text" v-model="property.room" required>
      </div>

      <div class="input">
        <label>Chambres</label><br>
        <input type="text" v-model="property.bedroom" required>
      </div>

      <div class="input">
        <label>Salles de bains</label><br>
        <input type="text" v-model="property.bathroom" required>
      </div>

      <div class="input">
        <label>Parkings</label><br>
        <input type="text" v-model="property.parking" required>
      </div>

      <div class="input">
        <label>Garages</label><br>
        <input type="text" v-model="property.garage" required>
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
          v-model="property.location"
        >
        </vue-google-autocomplete>
        {{property.location}}
      </div>

      <div class="input">
        <label>Localisation exacte</label><br>
        <input type="text" v-model="property.exact_location" required>
      </div>

      <div class="input">
        <label>Titre</label><br>
        <input type="text" v-model="property.title" required>
      </div>

      <div class="input">
        <label>Réference</label><br>
        <input type="text" v-model="property.reference" required>
      </div>

      <input type="hidden" v-model="property.id">
      <input type="hidden" v-model="property.creation_date">

      <div class="input"><button type="submit">Editer bien</button></div>
    </form>
  </div>
</template>

<script>
  import VueGoogleAutocomplete from 'vue-google-autocomplete'
  import { updateProperty } from '../../graphql/mutations';
  
  export default {
    name: 'EditProperty',
    components: {
      VueGoogleAutocomplete
    },
    data() {
      return {
        property: this.$route.params.property,
        arrayStatus: [],
        arrayType: [],
        arrayLocation: []
      }
    },
    methods: {
       editProperty() {
        this.arrayStatus.push('all', this.property.status);
        this.arrayType.push('all', this.property.type);

        console.log(this.property.location[1]);

        const id = this.property.id,
          area = this.property.area,
          exact_location = this.property.exact_location,
          location = this.property.location,
          price = this.property.price,
          status = this.arrayStatus,
          title = this.property.title,
          bathroom = this.property.bathroom,
          bedroom = this.property.bedroom,
          garage = this.property.garage,
          parking = this.property.parking,
          reference = this.property.reference,
          room = this.property.room,
          type = this.arrayType,
          creation_date = this.property.creation_date;

        this.$apollo.mutate({
          mutation: updateProperty,
          variables: {
            input: {
              id,
              area,
              exact_location,
              location,
              price,
              status,
              title,
              bathroom,
              bedroom,
              garage,
              parking,
              reference,
              room,
              type,
              creation_date
            }
          }
        }).then((data) => {
          this.$router.push({ name: 'AdminProperties', params: {propertyUpdated: true} })
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

