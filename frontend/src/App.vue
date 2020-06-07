<template>
  <div id="app" data-app="true">
    <Header />
    <div class="col-md-9 mx-auto text-center">
      <router-view v-if="!error"/>
      <div v-else>
        <div class="container mt-5">
          <h1 class="text-center mt-5">
              503 | Service Unavailable
          </h1>

          <p class="text-center mt-3">
              Sorry, our servers are currently down :( <br>
              Be rest assured that our brightest minds are doing all they can to bring the server back up. Please bear with us :)<br>
          </p>
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script>

import Header from './layouts/Header.vue';
import Footer from './layouts/Footer.vue';
// import router from './router'
import store from './store'

export default {
  components: {
    Header,
    Footer
  },
  data() {
    return {
      error: false
    }
  },
  beforeCreate() {
    this.$store.dispatch('setState')
    .then(res => console.log(res))
    .catch(err => {
      
      this.error = true
      console.log(`${err}`)})
  },

  created() {
    this.$http.interceptors.response.use(undefined, function (err) {
    let originalRequest = err.config
    
    if (err.response.status === 401 && !originalRequest._retry) {
      if (window.location.pathname.includes('command')) {
        originalRequest._retry = true
        store.dispatch('logout')
        .then(() => {
          window.location.href = "/command/login"
        })
        .catch(() => {
          console.log("Error logging user out")
        })
      }
      else {
        localStorage.removeItem('bToken')
        localStorage.removeItem('votes-stored')
        window.location.reload()
      }
    }

    else {
      throw err
    }
  
});
  }
}
</script>

<style>

@import "https://fonts.googleapis.com/css2?family=Lato&family=PT+Sans&display=swap";
@import "https://fonts.googleapis.com/css2?family=Arvo:wght@700&display=swap";
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";

@import "./assets/sticky-footer.css";

        nav.myNav {
            font-family: 'PT Sans', sans-serif;
            color: #020824;
            background: #4a558f;
        }
        .tag{font-weight:700;display:block;color:#020824}
        .main-logo {
            color: floralwhite;
            font-size:x-large
        }
        .required .control-label:after {
          content:"*";
          color:red;
        }
        .font-button {
          color: rgba(0,0,0,.095)
        }
        .font-button:hover {
          color: #162059;
          cursor: pointer;
          font-size: 33px;
        }
        .header {
          color: #020824;
          text-decoration: underline;
          font-weight: bold;
          font-size: larger;
          display: block;
          margin-bottom: 10px;
        }
        .main-logo:hover {
            text-decoration: none;
        }
        body {
            font-family: 'Lato', sans-serif;
        }
        h1,h2 {
            font-family: 'PT Sans', sans-serif;
            color: #162059;
            font-size: 2.6rem;
        }
        h3,h4,h5,h6 {
            font-family: 'PT Sans', sans-serif;
            color: #162059;
        }
        .myBtn {
             background: #162059;
          color: floralwhite;
        }
        .myBtn:hover {
          background: #162059;
          color: floralwhite;
        }
        a.myBtn {
            color: rgb(196, 175, 175);
        }
        footer {
            background-color:rgba(0,0,0,.03)
        }
        .specColor {
            color : #162059;
            text-decoration: underline;
        }
        .specColor:hover {
            color: #BF1111;
            text-decoration: underline;
        }
        .btn-fix:focus::before { opacity: 0 !important; }
        li.nav-item {
            font-size: larger;
            padding: 3px;
            /* margin-left: 5px; */
        }
        li.nav-item>a:hover, li.active>a{
            border-bottom:solid #162059 1.7px;
        }
        .blueColor {
        color : #162059;
       }
       .redColor {
        color: #BF1111;
       }
       .timer {
          font-family: 'Arvo', serif;
          font-size: x-large;
      }
       .editor {
           cursor:pointer
       }
       .editor:hover {
        background-color:rgba(0,0,0,.03)
       }

</style>
