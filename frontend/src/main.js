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

Vue.prototype.$http = axios;

Vue.prototype.$http.defaults.baseURL = `${process.env.VUE_APP_URL}/v1`

Vue.prototype.$http.interceptors.request.use (
  function (config) {
    const token = localStorage.getItem('userToken');
    const bToken = localStorage.getItem('bToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (bToken) {
      config.headers["X-Auth-User"] = `Bearer ${bToken}`
    }

    return config;
  },
  function (error) {
    return Promise.reject (error);
  }
);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
