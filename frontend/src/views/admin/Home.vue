<template>
  <div class="container">
      
      <h3 class="main-header" style="text-align: center;">{{name}} Electoral Committee Dashboard</h3>
      <hr>


      <div class="row mt-1 justify-content-center" v-if="isLoaded">
          <ElectionMonitor class="col-lg-6 mt-5" :setting="setting" :btnColor="btnColor"/>
          <CandidateCounter class="col-lg-6 mt-5" :pending="pending" :confirmed="confirmed" :btnColor="btnColor"/>
          <VoterCounter class="col-lg-6 mt-5" :voterCount="voterCount" :accreditedVoterCount="accreditedVoterCount" :btnColor="btnColor"/>
      </div>
      <div v-else>
            Please wait...
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