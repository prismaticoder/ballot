<template>
  <div class="container mt-4">
      <h2 class="text-center mt-5"><span class="redColor text-uppercase">{{region}}</span> ADMIN DASHBOARD</h2>
      <div class="row mt-5">
          <ElectionTimer v-bind:time="time" :currentDay="currentDay" :currentHour="currentHour" :currentMin="currentMin" :currentSec="currentSec"/>
            <CandidateCounter :totalCount="totalCount" :pending="pending" :confirmed="confirmed"/>
      </div>
      
  </div>
</template>

<script>
import axios from "axios";
import ElectionTimer from "../../components/ElectionTimer"
import CandidateCounter from "../../components/CandidateCounter"

export default {
    name: "Home",
    data() {
        return {
            region: "Law",
            time: "",
            currentDay: "",
            currentHour: "",
            currentMin: "",
            currentSec: "",
            totalCount: "",
            confirmed: "",
            pending: "",
        }
    },
    components: {
        ElectionTimer,
        CandidateCounter
    },
    methods: {
        giveDefaultValues() {
            let finalTime = new Date(this.time).getTime();
            let currentTime = new Date().getTime();
            // console.log(this.time);
            let interval = finalTime - currentTime

            this.currentDay = Math.floor(interval / (1000*60*60*24));
            this.currentHour = Math.floor((interval % (1000*60*60*24)) / (1000*60*60));
            this.currentMin =  Math.floor((interval % (1000*60*60*24)) % (1000*60*60) / (1000*60))
            this.currentSec = Math.floor((interval % (1000*60*60*24)) % (1000*60*60) % (1000*60) / 1000)
        },
        getTime() {
            axios.get(`http://localhost:4010/law/admin/settings`)
            .then(res => {
                if (res.data.ok) {
                    this.time = res.data.setting.startDate;
                    this.giveDefaultValues();
                }
            })
            .catch(err => console.log(err))
        },
    },
    created() {
        this.getTime();
        axios.get(`http://localhost:4010/law/admin/candidates`)
        .then (res => {
            this.totalCount = res.data.candidates.length;
            this.pending = res.data.candidates.filter(candidate => candidate.status == "pending").length;
            this.confirmed = res.data.candidates.filter(candidate => candidate.status == "confirmed").length;
        })
    }
}
</script>

<style>

</style>