
import VueRouter from 'vue-router'
import Properties from './pages/Properties.vue'
import SingleProperty from './pages/SingleProperty.vue'
import Home from './pages/Home.vue'

const router = new VueRouter({
  routes: [
    { 
      path: '/', 
      component: Home 
    },
    { 
      path: '/properties', 
      component: Properties 
    },
    { 
      path: '/properties/:id', 
      component: SingleProperty,
      name: 'SingleProperty'
    }
  ]
})

export default router