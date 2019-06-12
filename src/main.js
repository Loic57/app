import Vue from 'vue'
import VueApollo from 'vue-apollo'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './routes'
import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
import { InMemoryCache } from 'apollo-cache-inmemory'
import awsmobile from './aws-exports'
import AWSAppSyncClient from 'aws-appsync'
import reset from './scss/reset.scss'


//init graphql server
const client = new AWSAppSyncClient({
  url: "https://pffeaxgw7bad5obxfhddq4k3rm.appsync-api.eu-west-2.amazonaws.com/graphql",
  region: "eu-west-2",
  auth: {
    type: "API_KEY",
    apiKey: "da2-fpo3zm3ry5bprkc35gakjy4n3y",
  },
  Storage: {
    AWSS3: {
      bucket: 'app4fd3bd165a5f4b1e8fb0c79f167a6567',
      region: "eu-west-2"
    }
  },
  disableOffline: true
});

// Cache implementation
const cache = new InMemoryCache()


const apolloProvider = new VueApollo({
  defaultClient: client,
  cache
})




Amplify.configure(awsmobile)
Vue.use(AmplifyPlugin, AmplifyModules)
Vue.use(VueRouter)
Vue.use(VueApollo)
Vue.config.productionTip = false





new Vue({
  router,
  apolloProvider,
  render: h => h(App),
}).$mount('#app')
