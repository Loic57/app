<template>
  <div class="box-article">
    <div class="box-article__image" v-if="property.featuredProperty">
      <transition>
        <div class="slider"><img :src=file v-for="file in filesArrayURL" :key="file.id" v-show="isLoad" @load="loaded" /></div>
      </transition>
      
      <div v-show="!isLoad" class="loading"><img src="../assets/loader.gif" alt="" ></div>
    </div>
    <div class="box-article__image" v-else>
      <transition>
        <img v-show="isLoad" :src="thumbnail" @load="loaded">
      </transition>
      <div v-show="!isLoad" class="loading"><img src="../assets/loader.gif" alt="" ></div>
    </div>
    
    <router-link :to="{ name: 'SingleProperty', params: { id: property.id }}" class="box-article__content">
      <p class="content__title">{{property.title}}</p>
      <p class="content__location">{{property.location}}</p>

      <p class="content__price">
        <span v-if="removeStatusAll() === 'louer' || removeStatusAll() === 'viager'"> {{property.price}} € / mois</span>
        <span v-if="removeStatusAll() === 'acheter'"> {{property.price}} €</span>
        <span class="label-status">{{removeStatusAll()}}</span>
      </p>

      <div class="grid-flex">
        <div class="column info-house">
          <img src="../assets/home.svg" alt="" > <span>{{property.area}}m²</span>
        </div>
        <div class="column info-house">
          <img src="../assets/plans.svg" alt="" > <span>{{property.room}}</span>
        </div>
        <div class="column info-house">
          <img src="../assets/bed.svg" alt="" > <span>{{property.bedroom}}</span>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
  import { Auth, Storage } from 'aws-amplify';
  import { tns } from 'tiny-slider/src/tiny-slider'
  import style  from 'tiny-slider/dist/tiny-slider.css'
  import { setTimeout } from 'timers';
  import VueLoadImage from 'vue-load-image'


  export default {
    name: 'test',
    components: {
      VueLoadImage
    },
    props: ['property'],
    data() {
      return {
        thumbnail: null,
        isLoad: false,
        index: 0,
        filesArray: [],
        filesArrayURL: [],
        status: this.statusWithoutAll
      }
    },
    methods: {
      loaded() {
        this.isLoad = true
      },
      removeStatusAll() {
        function remove(array, element) {
          return array.filter(el => el !== element);
        }
        const status = this.property.status;
        const statusWithoutAll = remove(status, "all");

        return statusWithoutAll.toString();
      }
    },
    mounted() {
      if(!this.property.featuredProperty) {
        for(let i=0;i<this.property.files.length;i++) {
          Storage.get(`${this.property.id}/${this.property.files[i]}`, {download: true})
          .then((file) => {
            if(file.Metadata.featured === 'featured') { //si dans la liste des fichiers on retrouve un fichier qui a la metadata featured alors...
              var tempFile = this.filesArray[0]

              var size = parseInt(file.Metadata.size); //on récupère la taille de l'image 
              var name = file.Metadata.name;
              var blob = new Blob([file.Body], {type: file.Metadata.type}); //on créé un blob
              var newFile = new File([blob], name, {type:file.Metadata.type}); //qu'on transforme en fichier
              this.thumbnail = URL.createObjectURL(newFile);
            }
          })
        }
      }
      else {
        for(let i=0;i<this.property.files.length;i++) {
          Storage.get(`${this.property.id}/${this.property.files[i]}`, {download: true})
          .then((file) => {
            this.filesArray.push(file) //on push ce nouveau fichier dans un tableau filesArray

            if(this.filesArray.length == this.property.files.length) {
              for(let i=0;i<this.filesArray.length;i++) {
                if(this.filesArray[i].Metadata.featured === 'featured') {
                  var tempFile = this.filesArray[0];
                  var newFile = this.filesArray[i];
                  this.filesArray[0] = newFile;
                  this.filesArray[i] = tempFile;
                }
              }

              for(let i=0;i<this.filesArray.length;i++) {
                var size = parseInt(this.filesArray[i].Metadata.size); //on récupère la taille de l'image 
                var name = this.filesArray[i].Metadata.name;
                var blob = new Blob([this.filesArray[i].Body], {type: this.filesArray[i].Metadata.type}); //on créé un blob
                var newFile = new File([blob], name, {type:this.filesArray[i].Metadata.type}); //qu'on transforme en fichier
                this.filesArrayURL.push(URL.createObjectURL(newFile));
              } 
            
              setTimeout(() => {
                [].forEach.call(document.querySelectorAll('.slider'), function (el) {
                    tns({
                    container: el,
                    items: 1,
                    slideBy: 'page',
                    loop: false,
                    autoplay: false,
                    controls: false
                  });
                });
              }, 500);
            }
          })
        }
      } 
    }
  }
</script>

<style lang="scss">

  .label-status {
    background-color: #aed000;
    color: #ffffff;
    font-weight: 500;
    border-radius: 4px;
    display: inline-block;
    padding: 5px 10px;
    font-size: 14px;
  }

  .box-article {
    text-decoration: none;
    box-shadow: 0 0 23px 0 rgba(0,0,0,0.13);
    display: block;
    border-radius: 8px;

    .box-article__image {
      overflow: hidden;
      position: relative;
      max-height: 240px;
    }

    .box-article__content {
      padding: 20px;
      display: block;
      text-decoration: none;

      .content__title {
        color: #000000;
        font-weight: 700;
        font-size: 18px;
      }

      .content__location {
        color: #666666;
        font-size: 14px;
        margin-top: 2px;
      }

      .content__price {
        margin-top: 10px;
        .label-status {
          margin-left: 10px;
        }
      }

      .grid-flex .column {
        padding-bottom: 0;
      }

      .info-house {
        display: flex;
        align-items: center;
        img {width: 25px;margin-right: 8px;}
        span {
          font-size: 16px;
        }
      }
    }
  }

  .tns-nav {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 10px;
    z-index: 1;
    text-align: center;

    button {
      border-radius: 100px;
      background-color: #ffffff;
      width: 12px;
      height: 12px;
      border: 0;
      margin: 0 5px;

      &.tns-nav-active {
        background-color: #aed000
      }
    }
  }
</style>