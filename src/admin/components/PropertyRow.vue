<template>
  <div class="row-property">
    <div class="row-property__image"><img src="../../assets/visual-1.jpg" /></div>
    <div class="row-property__content">
      <span class="content__title">{{property.title}}<br><span>{{property.location[1]}}</span></span>

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
        <router-link to=""><span class="btn">delete</span></router-link>
        <router-link to=""><span class="btn">edit</span></router-link>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    name: 'test',
    props: ['property'],
    data() {
      return {
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

