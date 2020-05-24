import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import VModal from 'vue-js-modal'
import store from './store'
import axios from 'axios'
import vuetify from './plugins/vuetify';

Vue.use(VModal)

const token = localStorage.getItem('userToken')
Vue.prototype.$http = axios;

if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
