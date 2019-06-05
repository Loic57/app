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
        <select v-model="type" required>
          <option value="" :selected="true">Sélectionner un type de bien</option>
          <option value="Maison">Maison</option>
          <option value="Appartement">Appartement</option>
        </select>
      </div>

      <div class="input">
        <label>Image</label><br>
        <input type="file" @change="onFileChanged" multiple>
      </div>
      <div class="grid-flex">
        <div class="column w-20" v-for="(file, index) in filesArray" :key="file.id">
          <div class="box-image" v-bind:class="{ 'featured': indexFeatured === index}">
            <div class="box-image__visual"><img :src="file[1]" width="200"/></div>
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
        filesArray: [],
        featured: null,
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
        featuredMessage: false
      }
    },
    methods: {
      addProperty() {

        if(this.featured == null) {
          this.featuredMessage = true;
        }
        else {
          this.arrayLocation.push('all', this.location);
          this.arrayStatus.push('all', this.status);
          this.arrayType.push('all', this.type);

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
                bucket = "app4fd3bd165a5f4b1e8fb0c79f167a6567",
                region = "eu-west-2",
                key = id,
                files = this.filesNamesArray,
                featured = this.featured[0].name;

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
              featured,
              file: {
                bucket,
                region,
                key
              }
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
            //const test = this.resizeImage(this.featured[0]);

            //upload images
            for(let i=0;i<this.filesArray.length;i++) {
              Storage.put(`${id}/${this.filesArray[i][0].name}`, this.filesArray[i][0], {
                contentType: this.filesArray[i][0].type,
                metadata: { key: this.filesArray[i][0].name },
                progressCallback(progress) {
                  //console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
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
            this.filesArray.splice(index, 1); //on supprime une seule entrée du tableau à partir de l'index
          }
        }
      },
      featuredFile(index) {
        for(let i=0;i<this.filesArray.length;i++) {
          if(i == index) {
            this.featured = this.filesArray[i]; 
            this.indexFeatured = index;
            this.featuredMessage = false;
          }
        }
      },
      resizeImage(file) {
        const width = 500;
        const height = 300;
        const fileName = file.name;
        const fileType = file.type;

        const reader = new FileReader(); //create instance filereader
        reader.readAsDataURL(file); //read input image using filereader

        reader.onload = event => {
          const img = new Image(); //Create an instance of Image.
          img.src = event.target.result; //Set the result of the FileReader as source for the image.

          img.onload = () => {
            const elem = document.createElement('canvas'); //Create a HTML5 Canvas element
            const width = 500;
            const scaleFactor = width / img.width;
            elem.width = width;
            elem.height = img.height * scaleFactor;

            const ctx = elem.getContext('2d'); //Create an object that is used to draw graphics on the canvas.
            
            ctx.drawImage(img, 0, 0, width, img.height * scaleFactor); // img.width and img.height will contain the original dimensions

            if (!HTMLCanvasElement.prototype.toBlob) {
              Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
                value: function (callback, type, quality) {
                  var dataURL = this.toDataURL(type, quality).split(',')[1];
                  setTimeout(function() {
                    var binStr = atob( dataURL ),
                        len = binStr.length,
                        arr = new Uint8Array(len);
                    for (var i = 0; i < len; i++ ) {
                      arr[i] = binStr.charCodeAt(i);
                    }
                    callback( new Blob( [arr], {type: type || 'image/png'} ) );
                  });
                }
              });
            }
            else {
              //const data = ctx.canvas.toDataURL(img, mime, quality);
              ctx.canvas.toBlob((blob) => { //Export the canvas as a blob or DataURL by specifying MIME type, image quality.
                return file = new File([blob], fileName, {
                  type: fileType,
                  lastModified: Date.now()
                });

              }, fileType, 1);
            }
          },
          reader.onerror = error => console.log(error);
        };
      },
      onFileChanged(event) {
        if(event.target.files.length != 0) {
          for(let i=0;i<event.target.files.length;i++) {
            this.filesArray.push([event.target.files[i], URL.createObjectURL(event.target.files[i])]); //tableau qui contient [fichier img complet, url]
            this.filesNamesArray.push(event.target.files[i].name); //tableau qui contient [nom de l'image]

            
          }


          for(let i=0;i<this.filesArray.length;i++) {
            var blob = this.filesArray[i][0].slice(0, this.filesArray[i][0].size, this.filesArray[i][0].type); 
            var newFile = new File([blob], Math.random().toString(11).replace('0.', '') + '.' + this.filesArray[i][0].type, {type: this.filesArray[i][0].type});
            console.log(newFile);
            //this.filesArray[i][0].name = Math.random().toString(11).replace('0.', '');
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

