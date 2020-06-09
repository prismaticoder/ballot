<template>
  <div class="container-fluid">

    <div class="main-page-div mt-4 p-4">
      <div class="row">
        <div class="col-md-5">
          <img src="@/assets/ballot.svg" class="mt-n3" srcset="" width="60" height="60"> 
          <h3 class="mt-4">BALLOT - <span>{{name}}</span></h3>
        </div>
        <div class="col-md-7 text-left">
          <blockquote class="blockquote">
            <p><span class="blueColor">BALLOT</span> is a coercion-resistant voting application designed for use within student bodies in the University of Ibadan. You can get more information about us <a class="blueColor" href="#">here</a>.</p>
          </blockquote>
        </div>
      </div>
    </div>

    <div class="row mt-1 justify-content-center" v-if="isLoaded">
      <ElectionMonitor class="col-lg-6 mt-5" :pageType="pageType" :setting="setting" :btnColor="btnColor" />
      <div v-show="state == 'voting'" class="col-lg-6 mt-5">
        <h5>STATS</h5>
        <hr>

        <p>Click the button below to check voting statistics by level...</p>
        <v-btn to="/stats" rounded :color="btnColor" class="mt-4 text-white col-md-7">
          GO TO STATS
        </v-btn>
      </div>
      <div class="col-lg-6 mt-5">
        <h5>POSTS/CANDIDATES</h5>
        <hr>

        <div class="row timer blueColor">
            <div class="col-6">{{categoryCount}}</div>
            <div class="col-6">{{candidateCount}}</div>
        </div>
        <div class="row">
            <div class="col-6">Posts</div>
            <div class="col-6">Candidates</div>
        </div>

        <v-btn to="/candidates" rounded :color="btnColor" class="mt-4 text-white col-md-7">
            VIEW ALL CANDIDATES
        </v-btn>

      </div>
      <div v-show="state == 'prevoting'" class="col-lg-6 mt-5">
        <h5>APPLY FOR CANDIDACY</h5>
        <hr>

        <p>Want to be a candidate in the next election? Click the button below to apply for candidacy</p>

        <v-btn to="/candidates/apply" rounded :color="btnColor" class="mt-4 text-white col-md-7">
            APPLY
        </v-btn>

      </div>      
    </div>

    <div class="row mt-1 justify-content-center" v-else>
      <div class="col-lg-6 mt-5 mx-auto">
        <v-skeleton-loader class="mx-auto" width="35rem" type="heading"></v-skeleton-loader>
        <hr>
        <v-skeleton-loader class="mt-4" type="image"></v-skeleton-loader>
        <v-skeleton-loader class="mt-4 mx-auto" width="4rem" type="button"></v-skeleton-loader>  
      </div>
      <div class="col-lg-6 mt-5 mx-auto">
        <v-skeleton-loader class="mx-auto" width="35rem" type="heading"></v-skeleton-loader>
        <hr>
        <v-skeleton-loader class="mt-4" type="image"></v-skeleton-loader>
        <v-skeleton-loader class="mt-4 mx-auto" width="4rem" type="button"></v-skeleton-loader>  
      </div>
      <div class="col-lg-6 mt-5 mx-auto mt-5">
        <v-skeleton-loader class="mx-auto" width="35rem" type="heading"></v-skeleton-loader>
        <hr>
        <v-skeleton-loader class="mt-4" type="image"></v-skeleton-loader>
        <v-skeleton-loader class="mt-4 mx-auto" width="4rem" type="button"></v-skeleton-loader>  
      </div>
      <div class="col-lg-6 mt-5 mx-auto mt-5">
        <v-skeleton-loader class="mx-auto" width="35rem" type="heading"></v-skeleton-loader>
        <hr>
        <v-skeleton-loader class="mt-4" type="image"></v-skeleton-loader>
        <v-skeleton-loader class="mt-4 mx-auto" width="4rem" type="button"></v-skeleton-loader>  
      </div>
    </div>
    
  </div>
</template>

<script>
// @ is an alias to /src
import ElectionMonitor from '@/components/ElectionMonitor.vue';



export default {
  name: 'Home',
  components: {
    ElectionMonitor
  },
  data() {
    return {
      state: this.$store.getters.state,
      name: process.env.VUE_APP_NAME.toUpperCase(),
      pageType: 'home',
      setting: null,
      btnColor: "#4a558f",
      candidateCount: null,
      categoryCount: null,
      isLoaded: false
    }
  },
  methods: {
    init() {
      this.$http.get('ballotMainPage')
      .then(res => {
        this.setting = res.data.setting
        this.candidateCount = res.data.candidateCount
        this.categoryCount = res.data.categoryCount
        this.isLoaded = true;
      })
      .catch(err => {
        console.log(err.response ? err.response.data.error : err)
      })
    }
  },
  mounted() {
    this.init()
  }
}
</script>
