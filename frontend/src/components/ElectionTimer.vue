<template>
  <div class="col-md-6">
      <div class="card">
          <div class="card-header">
              <span class="timerHeader blueColor"><i class="fa fa-clock-o"></i> {{changeMsg}}</span>
          </div>
          <div class="card-body">
              <div class="row">
                  <div class="col-md-3">
                      <span class="timerBody d-block">{{currentDay}}</span>
                      <span v-if="currentDay==1">Day</span>
                      <span v-else>Days</span>
                  </div>
                  <div class="col-md-3">
                      <span class="timerBody d-block">{{currentHour}}</span>
                      <span v-if="currentHour==1">Hour</span>
                      <span v-else>Hours</span>
                  </div>
                  <div class="col-md-3">
                      <span class="timerBody d-block">{{currentMin}}</span>
                      <span v-if="currentMin==1">Min</span>
                      <span v-else>Mins</span>
                  </div>
                  <div class="col-md-3">
                      <span class="timerBody d-block">{{currentSec}}</span>
                      <span v-if="currentSec==1">Sec</span>
                      <span v-else>Secs</span>
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
    data() {
        return {
            interval: ""
        }
    },
    props: ["time","currentDay","currentHour","currentMin","currentSec"],
    methods: {
        startCountdown() {
            let finalTime = new Date(this.time).getTime();
            let currentTime = new Date().getTime();
            // console.log(this.time);
            let interval = finalTime - currentTime

            this.interval = interval;
            this.currentDay = Math.floor(interval / (1000*60*60*24));
            this.currentHour = Math.floor((interval % (1000*60*60*24)) / (1000*60*60));
            this.currentMin =  Math.floor((interval % (1000*60*60*24)) % (1000*60*60) / (1000*60))
            this.currentSec = Math.floor((interval % (1000*60*60*24)) % (1000*60*60) % (1000*60) / 1000)
        }
    },
    computed: {
        changeMsg() {
            if (parseInt(this.interval) <= 0) {
                this.$emit('changeTime')
                return "Election Countdown"
            }
            else {
                return "Time Till Election"
            }
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