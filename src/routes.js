import Vue from 'vue'
import VueRouter from 'vue-router'
import Properties from './pages/Properties.vue'
import SingleProperty from './pages/SingleProperty.vue'
import Home from './pages/Home.vue'


import Profile from './admin/components/Profile'
import Auth from './admin/components/Auth'
import AddProperty from './admin/pages/AddProperty'
import EditProperty from './admin/pages/EditProperty'
import AdminProperties from './admin/pages/Properties'

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
      path: '/admin/profile', 
      component: Profile, 
      meta: { requiresAuth: true} 
    },
    { 
      path: '/admin/AddProperty', 
      component: AddProperty, 
      meta: { requiresAuth: true} 
    },
    { 
      path: '/admin/EditProperty/:id', 
      name: 'EditProperty',
      component: EditProperty, 
      meta: { requiresAuth: true} 
    },
    { 
      path: '/admin/properties', 
      component: AdminProperties, 
      name: 'AdminProperties', 
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