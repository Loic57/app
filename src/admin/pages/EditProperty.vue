<template>
  <div class="container">
    <h1>Editer le bien  {{property.reference}}</h1> 

    <form @submit.prevent="addProperty">
      <div class="input">
        <label><input type="radio" name="choix" v-model="status" value="acheter" selected="selected"/> Acheter</label><br>
        <label><input type="radio" name="choix" v-model="status" value="louer" /> Louer</label><br>
        <label><input type="radio" name="choix" v-model="status" value="viager" /> Viager </label>
      </div>

      <div class="input">
        <label>Type de bien</label><br>
        <select v-model="type" required>
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
        <input type="text" v-model="room" required>
      </div>

      <div class="input">
        <label>Chambres</label><br>
        <input type="text" v-model="bedroom" required>
      </div>

      <div class="input">
        <label>Salles de bains</label><br>
        <input type="text" v-model="bathroom" required>
      </div>

      <div class="input">
        <label>Parkings</label><br>
        <input type="text" v-model="parking" required>
      </div>

      <div class="input">
        <label>Garages</label><br>
        <input type="text" v-model="garage" required>
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
        {{location}}
      </div>

      <div class="input">
        <label>Localisation exacte</label><br>
        <input type="text" v-model="exact_location" required>
      </div>

      <div class="input">
        <label>Titre</label><br>
        <input type="text" v-model="title" required>
      </div>

      <div class="input">
        <label>Réference</label><br>
        <input type="text" v-model="reference" required>
      </div>

      <input type="hidden" v-model="id">
      <input type="hidden" v-model="creation_date">

      <div class="input"><button type="submit">Ajouter nouveau bien</button></div>
    </form>
  </div>
</template>

<script>
  import VueGoogleAutocomplete from 'vue-google-autocomplete'
  import { createProperty } from '../../graphql/mutations';
  import { listPropertys } from '../../graphql/queries';

  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var currentDate = date + 'T' + time;

  export default {
    name: 'EditProperty',
    props: ['property'],
    components: {
      VueGoogleAutocomplete
    },
    data() {
      return {
        property: property,
        id: parseInt(Math.random() * 1000000),
        area: null,
        exact_location: '',
        location: [],
        price: null,
        status: [],
        title: '',
        bathroom: null,
        bedroom: null,
        garage: null,
        parking: null,
        reference: '',
        room: null,
        type: [],
        arrayLocation: [],
        arrayStatus: [],
        arrayType: [],
        creation_date: currentDate
      }
    },
    methods: {
      addProperty() {

        this.arrayLocation.push('all', this.location);
        this.arrayStatus.push('all', this.status);
        this.arrayType.push('all', this.type);


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

