<template>
  <div class="col-md-6">
      <div class="card">
          <div class="card-header">
              <span class="timerHeader blueColor">Election Timer</span>
          </div>
          <div class="card-body">
              <div class="row">
                  <div class="col-md-3">
                      <span class="timerBody d-block">{{currentDay}}</span>
                      Days
                  </div>
                  <div class="col-md-3">
                      <span class="timerBody d-block">{{currentHour}}</span>
                      Hours
                  </div>
                  <div class="col-md-3">
                      <span class="timerBody d-block">{{currentMin}}</span>
                      Mins
                  </div>
                  <div class="col-md-3">
                      <span class="timerBody d-block">{{currentSec}}</span>
                      Secs
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>

// import axios from 'axios';

export default {
    name: "ElectionTimer",
    props: ["time","currentDay","currentHour","currentMin","currentSec"],
    methods: {
        startCountdown() {
            let finalTime = new Date(this.time).getTime();
            let currentTime = new Date().getTime();
            // console.log(this.time);
            let interval = finalTime - currentTime

            this.currentDay = Math.floor(interval / (1000*60*60*24));
            this.currentHour = Math.floor((interval % (1000*60*60*24)) / (1000*60*60));
            this.currentMin =  Math.floor((interval % (1000*60*60*24)) % (1000*60*60) / (1000*60))
            this.currentSec = Math.floor((interval % (1000*60*60*24)) % (1000*60*60) % (1000*60) / 1000)
        }
    },
    mounted() {
        setInterval(this.startCountdown, 1000)
    }
}
</script>

<style scoped>

.timerHeader {
    font-size: 1.7rem;
}

.timerBody {
    font-size: 2.5rem
}


</style>