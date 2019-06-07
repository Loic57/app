<template>
  <router-link :to="{ name: 'SingleProperty', params: { id: property.id }}" class="box-article">
    <div class="box-article__image"><img :src=thumbnail /></div>
    <div class="box-article__content">
      <p class="content__title">{{property.title}}</p>
      <p class="content__location">{{property.location}}</p>

      <p class="content__price">
        <span v-if="removeStatusAll() === 'louer'"> {{property.price}} € / mois</span>
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
    </div>
  </router-link>
</template>

<script>

  import { Auth, Storage } from 'aws-amplify';

  
  export default {
    name: 'test',
    props: ['property'],
    data() {
      return {
        thumbnail: null,
        status: this.statusWithoutAll
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
      }
    },
    mounted() {
        Storage.get(`${this.property.id}/${this.property.featuredImage}`)
          .then((result) => {
            this.thumbnail = result;
            console.log(result)         
          })
          .catch(err => console.log(err));
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

    .box-article__content {
      padding: 20px;

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
</style>

