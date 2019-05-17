<template>
  <div class="container">
    <h1>Editer le bien  {{property.reference}} </h1> 

    <form @submit.prevent="editProperty">

      <div class="input">
        <label><input type="radio" name="choix" value="acheter" :checked="property.status[1] === 'acheter'"/> Acheter</label><br>
        <label><input type="radio" name="choix" value="louer" :checked="property.status[1] === 'louer'"/> Louer</label><br>
        <label><input type="radio" name="choix" value="viager" :checked="property.status[1] === 'viager'"/> Viager</label><br>
      </div>

      <div class="input">
        <label>Type de bien</label><br>
        <select required>
          <option value="">Sélectionner un type de bien</option>
          <option value="Maison" :selected="property.type[1] === 'Maison'">Maison</option>
          <option value="Appartement" :selected="property.type[1] === 'appartement'">Appartement</option>
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
          v-model="property.location[1]"
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
  import { listPropertys } from '../../graphql/queries';

  export default {
    name: 'EditProperty',
    components: {
      VueGoogleAutocomplete
    },
    data() {
      return {
        property: this.$route.params.property
      }
    },
    methods: {
       editProperty() {


        const id = parseInt(Math.random() * 100000),
          area = parseInt(this.area),
          exact_location = this.exact_location,
          location = this.arrayLocation,
          price = parseInt(this.price),
          status = this.arrayStatus,
          title = this.title,
          bathroom = parseInt(this.bathroom),
          bedroom = parseInt(this.bedroom),
          garage = parseInt(this.garage),
          parking = parseInt(this.parking),
          reference = this.reference,
          room = parseInt(this.room),
          type = this.arrayType,
          creation_date = this.creation_date;

          

        this.$apollo.mutate({
          mutation: createProperty,
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
          },
          update: (store, { data: { createProperty } }) => {
            const data = store.readQuery({
              query: listPropertys
            })

            data.listPropertys.items.push(createProperty)

            store.writeQuery({ query: listPropertys, data })
          }
        }).then((data) => {
          this.$router.push({ name: 'AdminProperties', params: {propertyCreated: true} })
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

