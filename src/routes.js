import Vue from 'vue'
import VueRouter from 'vue-router'
import Properties from './pages/Properties.vue'
import SingleProperty from './pages/SingleProperty.vue'
import Home from './pages/Home.vue'

import Profile from './components/Profile'
import Auth from './components/Auth'
import Protected from './components/Protected'

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
    },
    { 
      path: '/auth', 
      component: Auth 
    },
    { 
      path: '/protected', 
      component: Protected, 
      meta: { requiresAuth: true} 
    },
    { 
      path: '/profile', 
      component: Profile, 
      meta: { requiresAuth: true} 
    }
  ]
})


router.beforeResolve((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let user;
    Vue.prototype.$Amplify.Auth.currentAuthenticatedUser().then(data => {
      if (data && data.signInUserSession) {
        user = data;
      }
      next()
    }).catch((e) => {
      next({
        path: '/auth'
      });
    });
  }
  next()
})


export default router