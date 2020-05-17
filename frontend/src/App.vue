<template>
  <div id="app">
    <Header />
    <div class="col-md-9 mx-auto text-center">
      <router-view/>
    </div>
    
    <Footer />
  </div>
</template>

<script>

import Header from './layouts/Header.vue';
import Footer from './layouts/Footer.vue';

export default {
  components: {
    Header,
    Footer
  },
  beforeCreate() {
    this.$store.dispatch('setState')
    .then(res => console.log("App state updated!"))
    .catch(err => console.log(`Couldn't check app state: ${err}`))
  },
  created: function () {
    this.$http.interceptors.response.use(undefined, function (err) {
      return new Promise(function (resolve, reject) {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch('logout')
          resolve()
        }
        reject(err);
      });
    });
  }

}
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
} */
</style>
