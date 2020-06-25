<template>
  <div>
      <div class="row justify-content-center" v-if="setting">
        <v-dialog v-model="dialog" persistent max-width="350">
            <v-card>
                <v-card-title class="headline">End Election?</v-card-title>
                <v-card-text>
                Are you sure you want to put a stop to this election?
                Doing so would mean all voting would come to an end and results will be collated immediately.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="btnLoading" color="green darken-1" text @click="dialog = false">No</v-btn>
                    <v-btn :loading="btnLoading" :disabled="btnLoading" color="green darken-1" text @click="endElection()">Yes</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
          <div class="col-md-2"></div>
          <div class="col-md-4 border-right">
              <span class="tag" v-if="state !== 'voting'">START</span>
              <span v-else class="tag">STARTED</span>
              {{formatDate(setting.startDate)}}
          </div>
          <div class="col-md-4">
              <span class="tag" v-if="state !== 'voting'">END</span>
              <span v-else class="tag">ENDING</span> 
              {{formatDate(setting.endDate)}}
          </div>
          <div class="col-md-2"></div>
          <v-btn rounded v-if="state !== 'voting'" v-show="!changeDateForm" @click.prevent="changeDateForm = true" :color="btnColor" class="mt-3 text-white col-md-3">
            CHANGE
          </v-btn>
          <div v-else class="row justify-content-center mx-auto">
            <v-btn rounded :color="btnColor" class="mt-3 text-white col-md-5 col-12" @click="dialog = true">
              END ELECTION
            </v-btn>
            <div class="col-md-1"></div>
            <v-btn rounded v-show="!changeDateForm" @click.prevent="changeDateForm = true" :color="btnColor" class="mt-3 text-white col-md-5 col-12">
              ELONGATE
            </v-btn>
          </div>
      </div>

      <div v-else class="mt-5 col-md-6 mx-auto">
          <h5>Set Date And Time</h5>
          <b-alert class="col-md-10 mx-auto" v-model="showAlert" variant="warning" dismissible>
              <strong>{{errorMsg}}</strong>
          </b-alert>
          <div class="row mt-4">

              <div class="col-md-4">
                  <v-menu ref="startMenu" v-model="startMenu" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                      <template v-slot:activator="{ on }">
                          <v-text-field solo placeholder="Select Start Day" readonly @change="setEndDate()" v-model="startDay" label="Date" persistent-hint v-on="on"></v-text-field>
                      </template>
                      <v-date-picker :color="btnColor" :min="today"  v-model="startDay" no-title @input="startMenu = false"></v-date-picker>
                  </v-menu>
              </div>
              <div class="col-md-4 col-6">
                      <v-select :items="items" v-model="startTime" solo></v-select>
              </div>
              <div class="col-md-4 col-6">
                  <v-select :items="types" v-model="startPeriod" solo></v-select>
              </div>

              <span class="tag d-block text-center mx-auto">TO</span>
              <hr>

          </div>
          <div class="row border-top pt-3">
              <div class="col-md-4">
                  <v-menu ref="endMenu" v-model="endMenu" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                      <template v-slot:activator="{ on }">
                          <v-text-field placeholder="Select End Day" solo readonly v-model="endDay" label="Date" persistent-hint v-on="on"></v-text-field>
                      </template>
                      <v-date-picker :color="btnColor" :min="today" v-model="endDay" no-title @input="endMenu = false"></v-date-picker>
                  </v-menu>
              </div>
              <div class="col-md-4 col-6">
                      <v-select :items="items" v-model="endTime" solo></v-select>
              </div>
              <div class="col-md-4 col-6">
                  <v-select solo :items="types" v-model="endPeriod"></v-select>
              </div>
          </div>

          <div class="col-12 mt-2">
              <v-btn :loading="loading" :disabled="loading" :color="btnColor" style="color: floralwhite" class="btn btn-block myBtn col-4" @click="createSetting()">SUBMIT</v-btn>
          </div>
      </div>

      <div class="mt-5 col-md-6 mx-auto rounded border" v-if="setting" v-show="changeDateForm">
          <h5>Change Date And Time</h5>
          <b-alert class="col-md-10 mx-auto" v-model="showAlert" variant="warning" dismissible>
              <strong>{{errorMsg}}</strong>
          </b-alert>
          <v-btn :color="btnColor" top right absolute fab title="Close" style="color: floralwhite" @click.prevent="closeDateForm()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <div class="row" v-show="state !== 'voting'">
              <div class="col-md-4">
                  <v-menu ref="startMenu" v-model="startMenu" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                      <template v-slot:activator="{ on }">
                          <v-text-field solo readonly @change="setEndDate()" v-model="startDay" label="Date" v-on="on"></v-text-field>
                      </template>
                      <v-date-picker :color="btnColor" :min="today"  v-model="startDay" no-title @input="startMenu = false"></v-date-picker>
                  </v-menu>
              </div>
              <div class="col-md-4 col-6">
                      <v-select :items="items" v-model="startTime" solo></v-select>
              </div>
              <div class="col-md-4 col-6">
                  <v-select :items="types" v-model="startPeriod" solo></v-select>
              </div>
              <span class="tag d-block text-center mx-auto">TO</span>
              <hr>
          </div>
          
          <div class="row">
              <div class="col-md-4">
                  <v-menu ref="endMenu" v-model="endMenu" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                      <template v-slot:activator="{ on }">
                          <v-text-field solo readonly v-model="endDay" label="Date" persistent-hint v-on="on"></v-text-field>
                      </template>
                      <v-date-picker :color="btnColor" :min="today" v-model="endDay" no-title @input="endMenu = false"></v-date-picker>
                  </v-menu>
              </div>
              <div class="col-md-4 col-6">
                      <v-select :items="items" v-model="endTime" solo></v-select>
              </div>
              <div class="col-md-4 col-6">
                  <v-select solo :items="types" v-model="endPeriod"></v-select>
              </div>
          </div>

          <div class="col-12 mt-2">
              <v-btn :loading="loading" :disabled="loading" :color="btnColor" style="color: floralwhite" class="btn btn-block myBtn col-7" @click="updateSetting()"><span v-if="state !== 'voting'">CHANGE</span><span v-else>ELONGATE</span></v-btn>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    name: "DateTime",
    props: ["setting","btnColor","types","items","today"],
    data() {
      return {
        changeDateForm: false,
        startMenu: false,
        endMenu: false,
        showAlert: false,
        errorMsg: "",
        startDay: null,
        dialog: false,
        startTime: "",
        endDay: null,
        endTime: "",
        endPeriod: "",
        startPeriod: "",
        loading: false,
        btnLoading: false

      }
    },
    computed: {
      state() {
        return this.$store.getters.state
      }
    },
    mounted() {

      if (this.setting) {
        let endTime = parseInt(new Date(this.setting.endDate).toISOString().substr(11,2)) + 1
        let startTime = parseInt(new Date(this.setting.startDate).toISOString().substr(11,2)) + 1

        this.startTime = startTime > 12 ? `${startTime - 12}:00` : (startTime == 0 ? `${startTime + 12}:00` : `${startTime}:00`) 
        this.startPeriod = startTime > 12 ? "PM" : "AM"

        this.endTime = endTime > 12 ? `${endTime - 12}:00` : (endTime == 0 ? `${endTime + 12}:00` : `${endTime}:00`) 
        this.endPeriod = endTime > 12 ? "PM" : "AM"

        this.startDay = new Date(this.setting.startDate).toISOString().substr(0, 10)
        this.endDay = new Date(this.setting.endDate).toISOString().substr(0, 10)
      }

      else {
        this.startTime = "8:00";
        this.startPeriod = "AM";
        this.endTime = "4:00";
        this.endPeriod = "PM"
      }
      
    },
    methods: {
      formatDate(dateString) {
        const options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" }
        return new Date(dateString).toLocaleDateString(undefined, options)
      },
      updateSetting() {
        let { startDay, startTime, startPeriod, endDay, endTime, endPeriod } = this;

        if (this.state == 'voting') {
          endTime = (endPeriod == "AM") ? (endTime == "12:00" ? "00:00" : endTime) : (endTime == "12:00" ? "12:00" : `${parseInt(endTime) + 12}:00`)
          let newDate = new Date(`${endDay} ${endTime}`)
          let now = new Date()

          if (newDate <= now) {
            this.errorMsg = "You can only elongate the election to a future date"
            this.showAlert = true;
          }

          else if (new Date(newDate).getTime() == new Date(this.setting.endDate).getTime()) {
            this.changeDateForm = false
          }

          else {
            this.loading = true;

            this.$http.patch('admin/settings?type=elongate', {
              newDate
            })
            .then(res => {
              this.$emit('updateSetting',res.data.setting)
              this.loading = false
              this.changeDateForm = false
            })
            .catch(err => {
              this.loading = false
              this.errorMsg = err.response ? err.response.data.error : "Error processing request, please try again"
              this.showAlert = true;
            })

          }
            
        }

        else {
          if (!startDay || !startTime || !startPeriod || !endDay || !endTime || !endPeriod) {
            this.errorMsg = "All Fields are required"
            this.showAlert = true;
          }

          else {
            startTime = (startPeriod == "AM") ? (startTime == "12:00" ? "00:00" : startTime) : (startTime == "12:00" ? "12:00" : `${parseInt(startTime) + 12}:00`) 
            endTime = (endPeriod == "AM") ? (endTime == "12:00" ? "00:00" : endTime) : (endTime == "12:00" ? "12:00" : `${parseInt(endTime) + 12}:00`) 

            let startDate = new Date(`${startDay} ${startTime}`)
            let endDate = new Date(`${endDay} ${endTime}`)

            let now = new Date();

            if (startDate > endDate) {
              this.errorMsg = "Error: start date should be less than end date"
              this.showAlert = true
            }

            else if (startDate < now) {
              this.errorMsg = "Error: election date should be a future date"
              this.showAlert = true
            }

            else if (new Date(startDate).getTime() == new Date(this.setting.startDate).getTime() && new Date(endDate).getTime() == new Date(this.setting.endDate).getTime()) {
              this.changeDateForm = false
            }

            else {
              this.loading = true;

              this.$http.put(`admin/settings`, {
                startDate,endDate
              })
              .then(res => {
                this.$emit('updateSetting',res.data.setting)
                this.loading = false
                this.changeDateForm = false
              })
              .catch(err => {
                this.loading = false
                this.errorMsg = err.response ? err.response.data.error : "Error processing request, please try again"
                this.showAlert = true;
              })
            }
          }
        }
      },

      closeDateForm() {
            this.changeDateForm = false;

            let endTime = parseInt(new Date(this.setting.endDate).toISOString().substr(11,2)) + 1
            let startTime = parseInt(new Date(this.setting.startDate).toISOString().substr(11,2)) + 1

            this.startTime = startTime > 12 ? `${startTime - 12}:00` : (startTime == 0 ? `${startTime + 12}:00` : `${startTime}:00`) 
            this.startPeriod = startTime > 12 ? "PM" : "AM"

            this.endTime = endTime > 12 ? `${endTime - 12}:00` : (endTime == 0 ? `${endTime + 12}:00` : `${endTime}:00`) 
            this.endPeriod = endTime > 12 ? "PM" : "AM"

            this.startDay = new Date(this.setting.startDate).toISOString().substr(0, 10)
            this.endDay = new Date(this.setting.endDate).toISOString().substr(0, 10)
      },

      createSetting() {
        let { startDay, startTime, startPeriod, endDay, endTime, endPeriod } = this;

        if (!startDay || !startTime || !startPeriod || !endDay || !endTime || !endPeriod) {
          this.errorMsg = "All Fields are required"
          this.showAlert = true;
        }

        else {
          startTime = (startPeriod == "AM") ? (startTime == "12:00" ? "00:00" : startTime) : (startTime == "12:00" ? "12:00" : `${parseInt(startTime) + 12}:00`) 
          endTime = (endPeriod == "AM") ? (endTime == "12:00" ? "00:00" : endTime) : (endTime == "12:00" ? "12:00" : `${parseInt(endTime) + 12}:00`) 

          let startDate = new Date(`${startDay} ${startTime}`)
          let endDate = new Date(`${endDay} ${endTime}`)
          let now = new Date();

          if (startDate > endDate) {
            this.errorMsg = "Error: start date should be less than end date"
            this.showAlert = true
          }

          else if (startDate < now) {
            this.errorMsg = "Error: election date should be a future date"
            this.showAlert = true
          }

          else {
            this.loading = true;

             this.$http.post(`admin/settings`, {
              startDate,endDate
            })
            .then(res => {
              this.$emit('createSetting',res.data.setting)
              this.loading = false
            })
            .catch(err => {
              this.loading = false
              this.errorMsg = err.response ? err.response.data.error : "Error processing request, please try again"
              this.showAlert = true;
            })
          }
        }
      },
      endElection() {
        this.btnLoading = true
        this.$http.patch('admin/settings?type=end')
        .then(res => {
          this.$emit('updateSetting', res.data.setting)
          this.btnLoading = false
          this.dialog = false;
            return this.$store.dispatch('setState')
                  .catch(err => console.log(err))
        })
        .catch(err => {
          this.dialog = false;
          this.btnLoading = false
          err.response ? alert(err.response.data.error) : alert("Error processing request, please try again")
        })
      }
    }
}
</script>

<style>

</style>