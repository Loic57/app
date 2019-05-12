<template>
  <div id="app">
    <Nav/>
    <router-view></router-view>
  </div>
</template>

<script>
import Nav from './components/Nav.vue'

export default {
  name: 'app',
  components: {
    Nav
  }
}
</script>

<style lang="scss">
  body {
    margin: 0;
    padding: 0;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .container {
    max-width: 1170px;
    padding: 0 15px;
    margin: auto;
  }

  img {
    max-width: 100%;
  }

  p {
    margin: 0;
  }


.grid-flex {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -1.5rem;

  [class^=column] {
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;
    padding: 1.5rem;
  }


  & + .grid-flex {margin-top: 1.5rem;}

  &.h-align-left {justify-content: flex-start;}
  &.h-align-middle {justify-content: center;}
  &.h-align-right {justify-content: flex-end;}

  &.v-align-top {align-items: flex-start;}
  &.v-align-middle {align-items: center;}
  &.v-align-bottom {align-items: flex-end;}


  //Loop for creating width class
  @for $i from 1 through 100 {
    @if ($i == 33) {
      .w-#{$i} { max-width: 33.3333%;flex: 0 0 33.3333%; }
    }

    @else if ($i == 66) {
      .w-#{$i} { max-width: 66.6667%;flex: 0 0 66.6667%; }
    }

    @else {
      .w-#{$i} { max-width: percentage($i / 100);flex: 0 0 percentage($i / 100); }
    }
  }


  //Loop for creating offset
  @for $i from 1 through 100 {
    @if ($i == 33) {
      .o-#{$i} { margin-left: 33.3333%;}
    }

    @else if ($i == 66) {
      .o-#{$i} { margin-left: 66.6667%;}
    }

    @else {
      .o-#{$i} { margin-left: percentage($i / 100);}
    }
  }
}
</style>
