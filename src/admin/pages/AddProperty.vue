<template>
  <div class="container">
    <h1>Ajouter un bien immobilier</h1>
    <Spinner v-if="spinner" />
    
    <form @submit.prevent="addProperty">
      <div class="input">
        <label><input type="radio" name="choix" v-model="status" value="acheter" selected="selected"/> Acheter</label><br>
        <label><input type="radio" name="choix" v-model="status" value="louer" /> Louer</label><br>
        <label><input type="radio" name="choix" v-model="status" value="viager" /> Viager </label>
      </div>

      <div class="input">
        <label><input type="checkbox" name="choix" v-model="featuredProperty" @click="checkFeaturedNumber()"/> Featured ?</label><br>
      </div>

      <div class="message" v-if="featuredPropertiesNumberMessage">Il existe déja 3 biens immobiliers en statut "featured", merci de d'abord en annuler un.</div>

      <div class="input">
        <label>Type de bien</label><br>
        <select v-model="type" required>
          <option value="" :selected="true">Sélectionner un type de bien</option>
          <option value="Maison">Maison</option>
          <option value="Appartement">Appartement</option>
        </select>
      </div>

      <div class="input">
        <label>Image</label><br>
        <input type="file" @change="onFileChanged" multiple accept="image/png,image/jpeg">
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

      <div class="message" v-if="featuredMessage">Merci de sélectionner une image featured</div>
     
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

      <br><br>

      <h2>PEB</h2>

      <div class="input">
        <label>PEB No</label><br>
        <input type="text" v-model="pebNumber" required>
      </div>

      <div class="input">
        <label>PEB Letter</label><br>
        <select v-model="pebImage" required>
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
        <input type="text" v-model="eSpec" required>
      </div>

      <div class="input">
        <label>E totale (kWh/an)</label><br>
        <input type="text" v-model="eTotale" required>
      </div>

      <input type="hidden" v-model="id">
      <input type="hidden" v-model="creation_date">

      <div class="input"><button type="submit">Ajouter nouveau bien</button></div>
    </form>
  </div>
</template>

<script>
  import VueGoogleAutocomplete from 'vue-google-autocomplete'
  import { Storage } from 'aws-amplify';
  import { createProperty } from '../../graphql/mutations';
  import { listPropertys } from '../../graphql/queries';
  import downscale from 'downscale';
  import uuidv1 from 'uuid/v1'
  import Spinner from '../../components/Spinner'
  

  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var currentDate = date + 'T' + time;

  export default {
    name: 'addProperty',
    components: {
      VueGoogleAutocomplete,
      Spinner
    },
    data() {
      return {
        eTotale: '',
        pebNumber: '',
        pebImage: '',
        eSpec: '',
        spinner: false,
        listProperties: [],
        skipQuery: true,
        filesArray: [],
        filesArrayURL: [],
        filesArrayNames: [],
        featuredImage: null,
        featuredProperty: false,
        filesNamesArray: [],
        id: uuidv1(),
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
        creation_date: currentDate,
        indexFeatured: -1,
        featuredMessage: false,
        featuredPropertiesNumberMessage: false
      }
    },
    apollo: { 
      properties: { 
        query: listPropertys,
        update(data) {
          return this.listProperties = data.listPropertys.items;
        }
      }
    },
    methods: {
      checkFeaturedNumber() {
        let arrayFeaturedProperties = [];
        this.featuredPropertiesNumberMessage = false;

        for(let i=0;i<this.listProperties.length;i++) {
          if(this.listProperties[i].featuredProperty) {
            arrayFeaturedProperties.push(this.listProperties[i]);
          }
        }

        if(!this.featuredProperty) {
          if(arrayFeaturedProperties.length >= 3) {
            this.featuredPropertiesNumberMessage = true
          }
        }
        else {
          this.featuredPropertiesNumberMessage = false
        }

        return arrayFeaturedProperties.length
      },
      addProperty() {
        this.spinner = true;
        if(this.featuredImage == null) {
          this.featuredMessage = true;
          this.spinner = false;
        }
        else if(this.featuredProperty && this.checkFeaturedNumber() >= 3) {
          this.featuredPropertiesNumberMessage = true
        }
        else {
          this.arrayLocation.push('all', this.location);
          this.arrayStatus.push('all', this.status);
          this.arrayType.push('all', this.type);

          console.log(this.filesArray)

          for(let i=0;i<this.filesArray.length;i++) {
            this.filesNamesArray.push(this.filesArray[i].name)
          }

          const id = uuidv1(),
                area = parseInt(this.area),
                exact_location = this.exact_location,
                location = this.location,
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
                creation_date = this.creation_date,
                files = this.filesNamesArray,
                featuredImage = this.featuredImage.name,
                featuredProperty = this.featuredProperty,
                eTotale = this.eTotale,
                pebNumber = this.pebNumber,
                pebImage = this.pebImage,
                eSpec = this.eSpec;
                

                

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
              creation_date,
              files,
              featuredProperty,
              eTotale,
              pebNumber,
              pebImage,
              eSpec
            }
          },
          update: (store, { data: { createProperty } }) => {
            const data = store.readQuery({
              query: listPropertys
            })

            data.listPropertys.items.push(createProperty)

            store.writeQuery({ query: listPropertys, data })
          }
        }).then(() => {
            for(let i=0;i<this.filesArray.length;i++) {
              //upload de l'image featured
              Storage.put(`${id}/${this.featuredImage.name}`, this.featuredImage, {
                contentType: this.featuredImage.type,
                metadata: { 
                  name: this.featuredImage.name,
                  featured: 'featured',
                  size: JSON.stringify(this.featuredImage.size)
                }
              })
              .then (() => {
                //et ensuite de toutes les autres images
                if(this.filesArray[i].name != this.featuredImage.name) {
                  Storage.put(`${id}/${this.filesArray[i].name}`, this.filesArray[i], {
                    contentType: this.filesArray[i].type,
                    metadata: { 
                      name: this.filesArray[i].name,
                      size: JSON.stringify(this.filesArray[i].size)
                    }
                  }).then(() => {
                    this.$router.push({ name: 'AdminProperties', params: {propertyCreated: true} }) //redirect
                  })
                }
              })
              .catch((err) => {
                console.log(err)
              })
            }
          }).catch((error) => {
            console.log(error)
            this.spinner = false;
          })
        }
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
          }
          //this.resizeImage(this.filesArray[i]); //on redimensionne les images
        }
      },
      dataURItoBlob(dataURI, index) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        var blob = new Blob([ab]);
        var file = new File([blob], this.filesArrayNames[index], {type:mimeString})
        
        return file;
      },
      resizeImage() {
        for(let i=0;i<this.filesArray.length;i++) {
          downscale(this.filesArray[i], 600, 400).
          then((dataURL) => {
            const resizedImage = this.dataURItoBlob(dataURL, i);
            this.filesArray[i] = resizedImage;
          })
        }
      },
      onFileChanged(event) { //au moment de l'ajout des images via le champs input type file
        if(event.target.files.length != 0) { //s'il y a réellement des images
          for(let i=0;i<event.target.files.length;i++) {
            var blob = event.target.files[i].slice(0, event.target.files[i].size, event.target.files[i].type); 
            var newFile = new File([blob], Math.random().toString(11).replace('0.', '') + '.' + 'jpeg', {type:'image/jpeg'});
            this.filesArray.push(newFile); //tableau qui contient fichier img complet
            this.filesArrayNames.push(newFile.name)
            this.filesArrayURL.push(URL.createObjectURL(event.target.files[i])); //tableau qui contient url custom pour preview des images
          }
        }
      },
      getAddressData: function (addressData) {
        this.address = addressData;
        this.location = this.address.locality;
      }
    }
  }
</script>

<style lang="scss">
  .box-image {
    position: relative;
    background-color: #ffffff;
    box-shadow: 0 0 23px 0 rgba(0,0,0,0.13);
    border-radius: 15px;
    border: 5px solid transparent;

    &.featured {border: 5px solid green}

    .box-image__content {
      border-radius:  0 0 10px 10px;
      display: flex;
      align-items: center;
      text-align: center;

      .delete {
        background-color: red;
        flex: 0 0 50%;
        max-width: 50%;
        color: #ffffff;
        padding: 10px;
        border-radius:  0 0 0 10px;
        cursor: pointer;
      }

      .featured {
        padding: 10px;
        flex: 0 0 50%;
        max-width: 50%;
        background-color: green;
        color: #ffffff;
        border-radius:  0 0 10px 0;
        cursor: pointer;
      }
    }

    img {
      border-radius: 10px 10px 0 0;
      width: 100%;
    }

  }
</style>

