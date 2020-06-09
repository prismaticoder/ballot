<template>
  <div class="container">
      
      <h3 class="main-header" style="text-align: center;">{{name}} Electoral Committee Dashboard</h3>
      <hr>


      <div class="row mt-1 justify-content-center" v-if="isLoaded">
          <ElectionMonitor class="col-lg-6 mt-5" :setting="setting" :btnColor="btnColor" :pageType="pageType"/>
          <CandidateCounter class="col-lg-6 mt-5" :pending="pending" :confirmed="confirmed" :btnColor="btnColor"/>
          <VoterCounter class="col-lg-6 mt-5" :voterCount="voterCount" :accreditedVoterCount="accreditedVoterCount" :btnColor="btnColor"/>
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
      </div>
      
  </div>
</template>

<script>

import ElectionMonitor from "@/components/ElectionMonitor"
import CandidateCounter from "@/components/CandidateCounter"
import VoterCounter from "@/components/VoterCounter"

export default {
    name: "Home",
    data() {
        return {
            btnColor: "#4a558f",
            name: process.env.VUE_APP_NAME,
            setting: null,
            isLoaded: false,
            totalCount: "",
            confirmed: "",
            pending: "",
            voterCount: null,
            accreditedVoterCount: null,
            pageType: 'admin'
        }
    },
    components: {
        ElectionMonitor,
        CandidateCounter,
        VoterCounter
    },
    methods: {
        checkMonitor() {
            this.$http.get(`admin/mainPage`)
            .then(res => {
                this.setting = res.data.setting
                this.pending = res.data.pendingCount;
                this.confirmed = res.data.confirmedCount;
                this.voterCount = res.data.voterCount;
                this.accreditedVoterCount = res.data.accreditedVoterCount
                this.isLoaded = true;
            })
            .catch(err => console.log(err))                
        },
    },
    mounted() {
        this.checkMonitor()
    }
}
</script>

<style>

</style>