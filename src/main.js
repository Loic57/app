import Vue from 'vue'
import VueApollo from 'vue-apollo'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './routes'
import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
import awsmobile from './aws-exports'
import AWSAppSyncClient from 'aws-appsync'


//init graphql server
const client = new AWSAppSyncClient({
  url: "https://pffeaxgw7bad5obxfhddq4k3rm.appsync-api.eu-west-2.amazonaws.com/graphql",
  region: "eu-west-2",
  auth: {
    type: "API_KEY",
    apiKey: "da2-ajhuqgbbbze3jkzknzps4jeawi",
  }
});


const apolloProvider = new VueApollo({
  defaultClient: client,
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
