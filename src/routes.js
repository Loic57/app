
import VueRouter from 'vue-router'
import Properties from './pages/Properties.vue'
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
    }
  ]
})

export default router