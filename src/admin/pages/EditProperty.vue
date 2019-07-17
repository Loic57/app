<template>
  <div class="container">
    <h1>Editer le bien  {{property.reference}} </h1> 
    <Spinner v-if="spinner" />
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
        <div class="column w-20" v-for="file in filesArray" :key="file[1]">
          <div class="box-image" v-bind:class="{ 'featured': indexFeatured === file[1]}">
            <div class="box-image__visual">
              <transition>
                <img v-show="isLoad" :src="file[2]" @load="loaded"  width="200">
              </transition>
            </div>
            <div class="box-image__content">
              <div class="delete" @click="deleteFile(file[1])">delete</div>
              <div class="featured" @click="featuredFile(file[1])">featured</div>
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

      <br><br>

      <h2>PEB</h2>

      <div class="input">
        <label>PEB No</label><br>
        <input type="text" v-model="property.pebNumber" required>
      </div>

      <div class="input">
        <label>PEB Letter</label><br>
        <select v-model="property.pebImage" required>
          <option value="" :selected="true">Sélectionner un type de bien</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="E">E</option>
          <option value="F">F</option>
          <option value="G">G</option>
        </select>
      </div>

      <div class="input">
        <label>E spec (kWh/m².an)</label><br>
        <input type="text" v-model="property.eSpec" required>
      </div>

      <div class="input">
        <label>E totale (kWh/an)</label><br>
        <input type="text" v-model="property.eTotale" required>
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
  import downscale from 'downscale';
  import { Storage } from 'aws-amplify';
  import Spinner from '../../components/Spinner'
  import { DataURItoBlob } from '../../functions/DataURItoBlob'
  import { ObjectToImage } from '../../functions/ObjectToImage'

  export default {
    name: 'EditProperty',
    components: {
      VueGoogleAutocomplete,
      Spinner
    },
    data() {
      return {
        id: '',
        isLoad: false,
        spinner: false,
        featuredProperty: false,
        featuredImage: '',
        filesNamesArray: [],
        filesToDeleteFromServer: [],
        status: '',
        property: [],
        filesArrayURL: [],
        filesNamesArray: [],
        type: '',
        filesArray: [],
        indexFeatured: -1,
        featuredPropertiesNumberMessage: false
      }
    },
    apollo: { 
      property: { 
        query: getProperty,
        fetchPolicy: 'no-cache',
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
          this.createFilesArray(data)
          return data.getProperty;
        }
      }
    },
    methods: {
      loaded() {
        this.isLoad = true
      },
      async createFilesArray(data) {
        if(this.filesArray.length < data.getProperty.files.length) {
          for(let i=0;i<data.getProperty.files.length;i++) {
            this.id = data.getProperty.id;
            await Storage.get(`${data.getProperty.id}/${data.getProperty.files[i]}`, {download: true}) // on obtient les images qui sont sur le serveur
            .then((file) => {
              this.filesArray.push(file)

              if(this.filesArray.length == data.getProperty.files.length) {
                for(let i=0;i<this.filesArray.length;i++) {
                  var size = parseInt(this.filesArray[i].Metadata.size); //on récupère la taille de l'image 
                  var name = this.filesArray[i].Metadata.name; //on récupère le nom de l'image
                  var newFile = ObjectToImage([this.filesArray[i].Body], name, this.filesArray[i].Metadata.type); //on créé un fichier image
                  this.filesArray[i][0] = newFile;
                  this.filesArray[i][1] = `https://app4fd3bd165a5f4b1e8fb0c79f167a6567-dev.s3.eu-west-2.amazonaws.com/public/${data.getProperty.id}/${data.getProperty.files[i]}`;
                  this.filesArray[i][2] = URL.createObjectURL(this.filesArray[i][0]);
                  this.filesArray[i][3] = newFile.name;

                  if(this.filesArray[i].Metadata.featured === 'featured') {
                    this.indexFeatured = this.filesArray[i][1] //on ajoute la class featured pour mettre en évidence l'image qui est en 'featured'
                    this.featuredImage = this.filesArray[i];
                  }
                }
              }
            })
            .catch(err => console.log(err));
          }
          
          this.featuredImage[0] = ObjectToImage([this.featuredImage.Body], this.featuredImage.Metadata.name, this.featuredImage.Metadata.type);
          this.featuredImage[1] = `https://app4fd3bd165a5f4b1e8fb0c79f167a6567-dev.s3.eu-west-2.amazonaws.com/public/${data.getProperty.id}/${this.featuredImage[0].name}`;
          this.featuredImage[2] = URL.createObjectURL(this.featuredImage[0]);
          this.featuredImage[3] = this.featuredImage[0].name;
        }
      },
      editProperty() {
        for(let i=0;i<this.filesArray.length;i++) {
          this.filesNamesArray.push(this.filesArray[i][0].name)
        }

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
          files = this.filesNamesArray,
          featuredImage = this.featuredImage,
          featuredProperty = this.featuredProperty,
          hidden = this.property.hidden;

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
              featuredProperty,
              hidden
            }
          }
        }).then((data) => {
          this.spinner = true;

          for(let i=0;i<this.filesToDeleteFromServer.length;i++) {
            Storage.remove(`${id}/${this.filesToDeleteFromServer[i]}`);
          }

          Storage.put(`${id}/${this.featuredImage[0].name}`, this.featuredImage[0], {
            contentType: this.featuredImage[0].type,
            progressCallback(progress) {console.log(`Uploaded: ${progress.loaded}/${progress.total}`);},
            metadata: { 
              name: this.featuredImage[0].name,
              featured: 'featured',
              size: JSON.stringify(this.featuredImage[0].size)
            }
          })
          .then (() => {
            for(let i=0;i<this.filesArray.length;i++) {
              if(this.filesArray[i][0].name != this.featuredImage[0].name) {
                Storage.put(`${id}/${this.filesArray[i][0].name}`, this.filesArray[i][0], {
                  contentType: this.filesArray[i][0].type,
                  progressCallback(progress) {console.log(`Uploaded: ${progress.loaded}/${progress.total}`);},
                  metadata: { 
                    name: this.filesArray[i][0].name,
                    size: JSON.stringify(this.filesArray[i][0].size)
                  }
                }).then(() => {
                  this.$router.push({ name: 'AdminProperties', params: {propertyUpdated: true} }) //redirect
                })
              }
            }
          })
          .catch((err) => {
            console.log(err)
          })
          
        }).catch((error) => {
          console.log(error)
        })
      },
      deleteFile(file) {
        for(let i=0;i<this.filesArray.length;i++) {
          if(this.filesArray[i][1] === file) {
            if(this.indexFeatured === file) {
              this.indexFeatured = -1;
            }
            this.filesArray.splice(i, 1);
            this.filesToDeleteFromServer.push(this.filesNamesArray[i]);
          }
        }
      },
      featuredFile(file) {
        for(let i=0;i<this.filesArray.length;i++) {
          if(this.filesArray[i][1] == file) {
            this.indexFeatured = file;
            this.featuredMessage = false;
            this.featuredImage = this.filesArray[i];
          }
        }
      },
      resizeFilesArrayImages() {
        for(let i=0;i<this.filesArray.length;i++) {
          downscale(this.filesArray[i][0], 600, 400)
          .then((dataURL) => {
            const resizedImage = DataURItoBlob(dataURL, this.filesArray[i][0].name);
            this.filesArray[i][0] = resizedImage;
          })
        }
      },
      onFileChanged(event) { //au moment de l'ajout des images via le champs input type file
        if(event.target.files.length != 0) { //s'il y a réellement des images
          for(let i=0;i<event.target.files.length;i++) {
            var newFile = ObjectToImage([event.target.files[i].slice(0, event.target.files[i].size, event.target.files[i].type)], Math.random().toString(11).replace('0.', '') + '.' + 'jpeg', {type:'image/jpeg'});
            this.filesArray.push([newFile, '', URL.createObjectURL(event.target.files[i]), newFile.name]); //tableau qui contient fichier img complet
          }
          this.resizeFilesArrayImages();
        }

        console.log(this.filesArray);
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

