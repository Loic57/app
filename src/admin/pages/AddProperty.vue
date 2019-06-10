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
        <label><input type="checkbox" name="choix" v-model="featuredProperty" @click="checkFeaturedNumber"/> Featured ?</label><br>
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

      <input type="hidden" v-model="id">
      <input type="hidden" v-model="creation_date">

      <div class="input"><button type="submit">Ajouter nouveau bien</button></div>
    </form>
  </div>
</template>

<script>
  import VueGoogleAutocomplete from 'vue-google-autocomplete'
  import { Auth, Storage } from 'aws-amplify';
  import { createProperty } from '../../graphql/mutations';
  import { listPropertys } from '../../graphql/queries';
  import downscale from 'downscale';

  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var currentDate = date + 'T' + time;

  export default {
    name: 'addProperty',
    components: {
      VueGoogleAutocomplete
    },
    data() {
      return {
        listProperties: [],
        skipQuery: true,
        filesArray: [],
        filesArrayURL: [],
        filesArrayNames: [],
        featuredImage: null,
        featuredProperty: false,
        featuredImageAdminPanel: null,
        filesNamesArray: [],
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
        },
        skip() {
          return this.skipQuery
        },
      }
    },
    methods: {
      checkFeaturedNumber() {
        this.$apollo.queries.properties.skip = false
        this.$apollo.queries.properties.refetch();

        let arrayFeaturedProperties = []

        for(let i=0;i<this.listProperties.length;i++) {
          if(this.listProperties[i].featuredProperty) {
            arrayFeaturedProperties.push(this.listProperties[i]);
          }
        }

        if(arrayFeaturedProperties.length >= 3) {
          this.featuredPropertiesNumberMessage = true
        }
      },
      addProperty() {
        if(this.featuredImage == null) {
          this.featuredMessage = true;
        }
        else {
          this.arrayLocation.push('all', this.location);
          this.arrayStatus.push('all', this.status);
          this.arrayType.push('all', this.type);

          for(let i=0;i<this.filesArray.length;i++) {
            this.filesNamesArray.push(this.filesArray[i].name)
          }

          const id = parseInt(Math.random() * 100000),
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
                key = id,
                files = this.filesNamesArray,
                featuredImage = this.featuredImage.name,
                featuredProperty = this.featuredProperty,
                featuredImageAdminPanel = this.featuredImageAdminPanel.name

                

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
              featuredImage,
              featuredImageAdminPanel
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
            
            //upload miniature qui apparait dans la liste du panneau d'admin
            Storage.put(`${id}/${this.featuredImageAdminPanel.name}`, this.featuredImageAdminPanel, {
              contentType: this.featuredImageAdminPanel.type,
              metadata: { key: this.featuredImageAdminPanel.name },
              progressCallback(progress) {
                console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
              }
            })
            
            for(let i=0;i<this.filesArray.length;i++) {
              Storage.put(`${id}/${this.filesArray[i].name}`, this.filesArray[i], {
                contentType: this.filesArray[i].type,
                metadata: { key: this.filesArray[i].name },
                progressCallback(progress) {
                  console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
                }
              })
              .then ((result) => {
                this.$router.push({ name: 'AdminProperties', params: {propertyCreated: true} }) //redirect
              })
              .catch((err) => {
                console.log(err)
              })
            }
          }).catch((error) => {
            console.log(error)
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

          var blob = this.filesArray[i].slice(0, this.filesArray[i].size, this.filesArray[i].type); 
          var type = this.filesArray[i].type;
          var newType = type.substring(6);
          var tempName = this.filesArray[i].name;
          var newFile = new File([blob], tempName, {type:this.filesArray[i].type});

          if(this.filesArray[i].name.startsWith('featured-')) { //si l'élément i du tableau a un nom qui commence par featured alors... 
            var tempArrayName = this.filesArray[i].name.split('-'); //on divise le nom en deux, à partir du tiret
            tempArrayName.shift(); //on supprime la première partie
            var newFile = new File([blob], tempArrayName, {type:this.filesArray[i].type}); //on met le nouveau nom
          }
          
          if(i == index) {
            console.log('ici')
            var tempName = 'featured-' + this.filesArray[i].name; //on donne un nouveau nom à l'image en featured
            var newFile = new File([blob], tempName, {type:this.filesArray[i].type}); //on met le nouveau nom
            this.featuredImage = newFile; //on attribute à featuredImage le fichier image qui est en feature

            this.indexFeatured = index;
            this.featuredMessage = false;

            this.featuredImageAdminPanel = newFile; //un tableau qui ne contient que l'image featured
          }

  
          this.filesArray[i] = newFile //tableau qui contient les images
    
          
          this.filesArrayNames[i] = newFile.name; //tableau qui contient uniquement les noms d'images
          this.resizeImage(this.filesArray[i]); 


          
        }

        this.resizeFeaturedImageAdminPanel(this.featuredImageAdminPanel);

        
      },
      dataURItoBlob(dataURI, index, featuredImageAdminPanelName) {
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
        if(index == 9999) {
          var file = new File([blob], featuredImageAdminPanelName, {type:mimeString})
        }
        else {
          var file = new File([blob], this.filesArrayNames[index], {type:mimeString})
        }
        
        return file;
      },
      resizeImage(file) {
        for(let i=0;i<this.filesArray.length;i++) {
          downscale(this.filesArray[i], 600, 400).
          then((dataURL) => {
            const resizedImage = this.dataURItoBlob(dataURL, i);
            this.filesArray[i] = resizedImage;
          })
        }
      },
      resizeFeaturedImageAdminPanel(file) {
        downscale(file, 228, 152).
        then((dataURL) => {
          var featuredImageAdminPanelName = this.featuredImageAdminPanel.name
          const resizedImage = this.dataURItoBlob(dataURL, 9999, featuredImageAdminPanelName); //fonction qui va convertir la base64 en File object
          this.featuredImageAdminPanel = resizedImage; //on stock ce File object dans featuredImageAdminPanel
          var tempName = this.featuredImageAdminPanel.name; 

          var blob = this.featuredImageAdminPanel.slice(0, this.featuredImageAdminPanel.size, this.featuredImageAdminPanel.type); 
          var newFile = new File([blob], 'adminPanel-' + tempName, {type:'image/jpeg'}); //on change le nom de notre nouvelle image

          this.featuredImageAdminPanel = newFile; //nouvelle image avec nouveau nom et une taille de 228/152
        })
      },
      onFileChanged(event) { //au moment de l'ajout des images via le champs input type file
        if(event.target.files.length != 0) { //s'il y a réellement des images
          for(let i=0;i<event.target.files.length;i++) {

            var blob = event.target.files[i].slice(0, event.target.files[i].size, event.target.files[i].type); 
            var type = event.target.files[i].type;
            var newType = type.substring(6);

            var newFile = new File([blob], Math.random().toString(11).replace('0.', '') + '.' + 'jpeg', {type:'image/jpeg'});

            this.filesArray.push(newFile); //tableau qui contient fichier img complet
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

