<template>
    <div v-if="state == 'prevoting'">

        <div v-if="setting">
            <div v-if="interval > (24*60*60*1000)">
                <h5>DATE AND TIME</h5>
                <hr>
                 <v-timeline>
                    <v-timeline-item :color="btnColor">Start: {{formatDate(setting.startDate)}}</v-timeline-item>
                    <v-timeline-item :color="btnColor" class="text-right mt-5">End: {{formatDate(setting.endDate)}}</v-timeline-item>
                </v-timeline>
                <v-btn to="/command/settings" v-if="pageType == 'admin'" rounded :color="btnColor" class="mt-4 text-white col-md-7">
                    Change dates
                </v-btn>
                <v-btn to="/accreditation" v-else rounded :color="btnColor" class="mt-4 text-white col-md-7">
                    GET ACCREDITED
                </v-btn>
            </div>
           
            <div v-else>
                <h5>COUNTDOWN TILL ELECTION</h5>
                <hr>
                <div class="row timer blueColor">
                    <div class="col-4">{{this.hours}}</div>
                    <div class="col-4">{{this.minutes}}</div>
                    <div class="col-4">{{this.seconds}}</div>
                </div>
                <div class="row">
                    <div class="col-4">Hour(s)</div>
                    <div class="col-4">Minute(s)</div>
                    <div class="col-4">Second(s)</div>
                </div>

                <v-btn to="/command/settings" v-if="pageType == 'admin'" rounded :color="btnColor" class="mt-4 text-white col-md-7">
                    Change election time
                </v-btn>
                <v-btn to="/accreditation" v-else rounded :color="btnColor" class="mt-4 text-white col-md-7">
                    GET ACCREDITED
                </v-btn>
            </div>
        </div>

        <div v-else>
            <h5>DATE AND TIME</h5>
            <hr>
            <i style="display:block" class="text-grey">
                No date and time set yet
            </i>

            <v-btn to="/command/settings" v-if="pageType == 'admin'" rounded :color="btnColor" class="mt-4 text-white col-md-7">
                Set Day and Time
            </v-btn>
            <v-btn to="/accreditation" v-else rounded :color="btnColor" class="mt-4 text-white col-md-7">
                GET ACCREDITED
            </v-btn>
        </div>
        
    </div>

    <div v-else-if="state == 'voting'">
        <div v-if="interval > (24*60*60*1000)">
            <h5>ELECTION END DATE</h5>
            <hr>
            {{formatDate(setting.endDate)}}
        </div>
        <div v-else>
            <h5>ELECTION ENDS IN:</h5>
            <hr>
            <div class="row timer redColor">
                <div class="col-4">{{this.hours}}</div>
                <div class="col-4">{{this.minutes}}</div>
                <div class="col-4">{{this.seconds}}</div>
            </div>
            <div class="row">
                <div class="col-4">Hour(s)</div>
                <div class="col-4">Minute(s)</div>
                <div class="col-4">Second(s)</div>
            </div>
        </div>

        <v-btn to="/command/settings" v-if="pageType == 'admin'" rounded :color="btnColor" class="mt-4 text-white col-md-7">
            END/ELONGATE ELECTION
        </v-btn>
        <v-btn to="/vote" v-else rounded :color="btnColor" class="mt-4 text-white col-md-7">
            VOTE
        </v-btn>
    </div>
    <div v-else>
        <h5>RESULTS</h5>
        <hr>

        <p v-if="pageType == 'admin'">Approve and View Official Election Results</p><p v-else>Results are out! View approved election results</p>
        <v-btn to="/command/results" v-if="pageType == 'admin'" rounded :color="btnColor" class="mt-4 text-white col-md-7">
            GO TO RESULTS
        </v-btn>
        <v-btn to="/results" v-else rounded :color="btnColor" class="mt-4 text-white col-md-7">
            GO TO RESULTS
        </v-btn>
    </div>
</template>

<script>

export default {
    name: "ElectionMonitor",
    data() {
        return {
            interval: null,
            state: this.$store.getters.state,
            hours: '-',
            minutes: '-',
            seconds: '-',
            x: null
        }
    },
    props: ["setting","btnColor","pageType"],
    methods: {
        formatDate(dateString) {
        const options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" }
        return new Date(dateString).toLocaleDateString(undefined, options)
        },
        changeInterval() {
            this.interval = this.interval - 1000;
            this.hours = Math.floor(this.interval / (1000*60*60));
            this.minutes =  Math.floor((this.interval % (1000*60*60*24)) % (1000*60*60) / (1000*60))
            this.seconds = Math.floor((this.interval % (1000*60*60*24)) % (1000*60*60) % (1000*60) / 1000)
        },
        setInterval() {
            let { state } = this

            if (this.setting) {
                if (state == 'prevoting') {
                    this.interval = new Date(this.setting.startDate).getTime() - new Date().getTime();
                }
                else if (state == 'voting') {
                    this.interval = new Date(this.setting.endDate).getTime() - new Date().getTime() 
                }
                else {
                    this.interval = null
                }

                this.x = this.interval ? setInterval(this.changeInterval, 1000) : null;
            }
        }
    },
    mounted() {
        this.setInterval()
    },
    watch: {
        interval() {
            if (this.interval && this.interval < 0) {
                clearInterval(this.x)
                this.hours = 0;
                this.minutes = 0;
                this.seconds = 0;
                this.$store.dispatch('setState')
                .then(res => {
                    this.state = res;
                    if (res == 'voting') {
                        this.interval = new Date(this.setting.endDate).getTime() - new Date().getTime()
                        this.x = setInterval(this.changeInterval,1000)
                    }
                })
                .catch(err => console.log(err))
            }
        }
    }
}
</script>

<style scoped>

</style>