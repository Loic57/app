<template>
  <div class="container">
    <h1>Editer le bien  {{property.reference}} </h1> 

    <form @submit.prevent="editProperty">
      <!-- :checked="property.status[1] === 'viager'" -->
      <div class="input">
        <label><input type="radio" v-model="status" name="choix" value="acheter" /> Acheter</label><br>
        <label><input type="radio" v-model="status" name="choix" value="louer" /> Louer</label><br>
        <label><input type="radio" v-model="status" name="choix" value="viager" /> Viager</label><br>
      </div>

      <div class="input">
        <label><input type="checkbox" name="choix" v-model="featuredProperty"/> Featured ?</label><br>
      </div>

      <div class="input">
        <label>Type de bien</label><br>
        <select required v-model="type">
          <option value="">Sélectionner un type de bien</option>
          <option value="Maison">Maison</option>
          <option value="Appartement">Appartement</option>
        </select>
      </div>

      <div class="input">
        <label>Image</label><br>
        <input type="file" @change="onFileChanged" multiple>
      </div>

      <div class="grid-flex">
        <div class="column w-20" v-for="(file, index) in filesArrayURL" :key="file.id">
          <div class="box-image" v-bind:class="{ 'featured': indexFeatured === index}">
            <div class="box-image__visual"><img :src="file" width="200"/></div>
            <div class="box-image__content">
              <div class="delete" @click="deleteFile(index)">delete</div>
              <div class="featured" @click="featuredFile(index)">featured</div>
            </div>
          </div>
        </div>
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
  import { getProperty } from '../../graphql/queries';
  import { Auth, Storage } from 'aws-amplify';
  export default {
    name: 'EditProperty',
    components: {
      VueGoogleAutocomplete
    },
    data() {
      return {
        featuredProperty: false,
        featuredImage: '',
        filesArrayNames: [],
        status: '',
        property: [],
        filesArrayURL: [],
        type: '',
        filesArray: [],
        indexFeatured: -1,
        featuredPropertiesNumberMessage: false
      }
    },
    apollo: { 
      property: { 
        query: getProperty,
        variables() {
          return {
            id: this.$route.params.id
          }
        },
        update(data) {
          this.property = data.getProperty;
          this.type = this.property.type[1];
          this.featuredProperty = this.property.featuredProperty;
          this.status = this.property.status[1];
          
          for(let i=0;i<data.getProperty.files.length;i++) {
            Storage.get(`${data.getProperty.id}/${data.getProperty.files[i]}`, {download: true}) // on obtient les images qui sont sur le serveur
            .then((file) => {
              this.filesArray.push(file)
              if(this.filesArray.length == data.getProperty.files.length) {
                for(let i=0;i<this.filesArray.length;i++) {
                  if(this.filesArray[i].Metadata.featured === 'featured') {
                    this.indexFeatured = i //on ajoute la class featured pour mettre en évidence l'image qui est en 'featured'
                  }
                }

                for(let i=0;i<this.filesArray.length;i++) {
                  var size = parseInt(this.filesArray[i].Metadata.size); //on récupère la taille de l'image 
                  var name = this.filesArray[i].Metadata.name;
                  var blob = new Blob([this.filesArray[i].Body], {type: this.filesArray[i].Metadata.type}); //on créé un blob
                  var newFile = new File([blob], name, {type:this.filesArray[i].Metadata.type}); //qu'on transforme en fichier
                  this.filesArray[i] = newFile;
                  this.filesArrayNames.push(newFile.name)
                  this.filesArrayURL.push(URL.createObjectURL(newFile));
                }
              }
            })
            .catch(err => console.log(err));
          }

          console.log(this.filesArray)
  
          return data.getProperty;
        }
      }
    },
    methods: {
      editProperty() {

        const id = this.property.id,
          area = this.property.area,
          exact_location = this.property.exact_location,
          location = this.location,
          price = this.property.price,
          status = ['all', this.status],
          title = this.property.title,
          bathroom = this.property.bathroom,
          bedroom = this.property.bedroom,
          garage = this.property.garage,
          parking = this.property.parking,
          reference = this.property.reference,
          room = this.property.room,
          type = ['all', this.type],
          creation_date = this.property.creation_date,
          files = this.filesArrayNames,
          featuredImage = this.featuredImage,
          featuredProperty = this.featuredProperty;

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
              creation_date,
              files,
              featuredProperty
            }
          }
        }).then((data) => {
          for(let i=0;i<this.filesArray.length;i++) {
            Storage.put(`${id}/${this.filesArray[i].name}`, this.filesArray[i], {
              contentType: this.filesArray[i].type,
              metadata: { 
                name: this.filesArray[i].name,
                size: JSON.stringify(this.filesArray[i].size)
              },
              progressCallback(progress) {
                console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
              }
            })
            .then (() => {
              //upload de l'image featured
              Storage.put(`${id}/${this.featuredImage.name}`, this.featuredImage, {
                contentType: this.featuredImage.type,
                featured: true,
                metadata: { 
                  name: this.featuredImage.name,
                  featured: 'featured',
                  size: JSON.stringify(this.featuredImage.size)
                },
                progressCallback(progress) {
                  console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
                }
              }).then(() => {
                this.$router.push({ name: 'AdminProperties', params: {propertyUpdated: true} }) //redirect
              })
              
            })
            .catch((err) => {
              console.log(err)
            })
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      deleteFile(index) {
        for(let i=0;i<this.filesArray.length;i++) {
          if(i == index) {
            this.filesArrayURL.splice(index, 1); //on supprime une seule entrée du tableau à partir de l'index
            this.filesArray.splice(index, 1);
          }
        }
      },
      featuredFile(index) {
        for(let i=0;i<this.filesArray.length;i++) {
          if(i == index) {
            this.indexFeatured = index;
            this.featuredMessage = false;
            this.featuredImage = this.filesArray[i];
            console.log(this.featuredImage)
          }
          //this.resizeImage(this.filesArray[i]); //on redimensionne les images
        }
      },
      onFileChanged(event) { //au moment de l'ajout des images via le champs input type file
        if(event.target.files.length != 0) { //s'il y a réellement des images
          for(let i=0;i<event.target.files.length;i++) {

            var blob = event.target.files[i].slice(0, event.target.files[i].size, event.target.files[i].type); 
            var type = event.target.files[i].type;
            var newType = type.substring(6);

            var newFile = new File([blob], Math.random().toString(11).replace('0.', '') + '.' + newType, {type:event.target.files[i].type});

            this.filesArray.push(newFile); //tableau qui contient fichier img complet
            this.filesArrayURL.push(URL.createObjectURL(event.target.files[i])); //tableau qui contient url custom pour preview des images
          }
        }
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

