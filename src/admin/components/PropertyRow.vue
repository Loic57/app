<template>
  <div class="row-property" :class="{ 'is-featured': property.featuredProperty }">
    <div class="row-property__image"><img :src=thumbnail /></div>
    <div class="row-property__content">
      <span class="content__title">{{property.reference}}<br><span>{{property.location}}</span></span>

      <div class="content__price">
        <span v-if="this.removeStatusAll() === 'louer'"> {{property.price}} € / mois</span>
        <span v-if="this.removeStatusAll() === 'acheter'"> {{property.price}} €</span>
      </div>

      <div class="content__status"><span class="label-status">{{this.removeStatusAll()}}</span></div>

      <div class="content__infos">
        <div class="infos__area info-house">
          <img src="../../assets/home.svg" alt="" > <span>{{property.area}}m²</span>
        </div>
        <div class="infos__room info-house">
          <img src="../../assets/plans.svg" alt="" > <span>{{property.room}}</span>
        </div>
        <div class="infos__bedroom info-house">
          <img src="../../assets/bed.svg" alt="" > <span>{{property.bedroom}}</span>
        </div>
      </div>

      <div class="content__buttons"> 
        <button class="btn" @click="deleteProperty()">delete</button>
        <router-link :to="{ name: 'EditProperty', params: { id: property.id, property: currentProperty }}"><span class="btn">edit</span></router-link>
      </div>

    </div>
  </div>
</template>

<script>
  import { deleteProperty } from '../../graphql/mutations';
  import { listPropertys } from '../../graphql/queries';
  import { Auth, Storage } from 'aws-amplify';

  export default {
    name: 'PropertyRow',
    props: ['property'], // get props from Properties component
    data() {
      return {
        status: this.statusWithoutAll,
        currentProperty: this.property,
        thumbnail: null
      }
    },
    methods: {
      removeStatusAll() {
        function remove(array, element) {
          return array.filter(el => el !== element);
        }

        const status = this.property.status;
        const statusWithoutAll = remove(status, "all");
        return statusWithoutAll.toString();
      },
      deleteProperty() {

        const id = this.property.id;

        this.$apollo.mutate({
          mutation: deleteProperty,
          variables: {
            input: {
              id
            }
          },
          update: (store, { data: { deleteProperty } }) => {
            const data = store.readQuery({
              query: listPropertys
            })

            for( var i = 0; i < data.listPropertys.items.length; i++){ 
              if ( data.listPropertys.items[i].id === id) {
                data.listPropertys.items.splice(i, 1); 
              }
            }

            store.writeQuery({ query: listPropertys, data })
          }
        }).then((data) => {
            for(let i=0;i<data.data.deleteProperty.files.length;i++) { //on supprime toutes les images
              Storage.remove(`${id}/${data.data.deleteProperty.files[i]}`)
              .then((result) => {console.log(result)})
              .catch(err => console.log(err));
            }
        }).catch((error) => {
        })
      }
    },
    mounted() {
      for(let i=0;i<this.property.files.length;i++) {
        Storage.get(`${this.property.id}/${this.property.files[i]}`, {download: true}) // on obtient les images qui sont sur le serveur
        .then((file) => {
          if(file.Metadata.featured === 'featured') { //si dans la liste des fichiers on retrouve un fichier qui a la metadata featured alors...
            var size = parseInt(file.Metadata.size); //on récupère la taille de l'image 
            var name = file.Metadata.name;
            var blob = new Blob([file.Body], {type: file.Metadata.type}); //on créé un blob
            var newFile = new File([blob], name, {type:file.Metadata.type}); //qu'on transforme en fichier
            this.thumbnail = URL.createObjectURL(newFile) 
          }
        })
        .catch(err => console.log(err));
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
    text-align: center;
  }


  .row-property {
    display: flex;
    flex-wrap: wrap;
    text-decoration: none;
    box-shadow: 0 0 23px 0 rgba(0,0,0,0.13);
    border-radius: 8px;
    align-items: center;

    &.is-featured {
      border: 3px solid #aed000;
    }

      .label-status {
      background-color: #aed000;
      color: #ffffff;
      font-weight: 500;
      border-radius: 4px;
      display: block;
      padding: 5px 10px;
      font-size: 14px;
      text-align: center;
      width: 100px;
    }

    .row-property__image {
      flex: 0 0 10%;
      max-width: 10%;

      img {border-radius: 8px 0 0 8px}
    }

    .row-property__content {
      flex: 0 0 90%;
      max-width: 90%;
      padding-left: 20px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;

      .content__title {
        color: #000000;
        font-weight: 700;
        flex: 0 0 20%;
        max-width: 20%;
        font-size: 16px;

        span {
          color: gray;
          font-weight: 500;
          font-size: 14px;
        }
      }

      .content__price {
        flex: 0 0 15%;
        max-width: 15%;
      }

      .content__status {
        flex: 0 0 15%;
        max-width: 15%;
        justify-content: center;
      }

      .content__infos {
        flex: 0 0 35%;
        max-width: 35%;
        justify-content: center;
        display: flex;

        .info-house {
          margin-right: 30px;
          &:last-child {margin: 0;}
          display: flex;
          align-items: center;

          img {width: 20px;margin-right: 5px;}
          span {font-size: 15px;}

          &.infos__room {
            img {width: 25px;}
          }

          &.infos__bedroom {
            img {width: 25px;}
          }
        }
      }



      .content__buttons {
        flex: 0 0 15%;
        max-width: 15%;
        text-align: right;
        padding-right: 20px;

        .btn {
          background-color: #aed000;
          display: inline-block;
          border-radius: 100px;
          width: 40px;
          height: 40px;
          text-align: center;
          line-height: 3.2rem;
          margin-left: 20px;
          img {width: 20px;}
        }
      }


    }
  }
</style>

