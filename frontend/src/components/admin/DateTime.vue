<template>
  <div>
      <div class="row justify-content-center" v-if="setting">
          <div class="col-md-2"></div>
          <div class="col-md-4 border-right">
              <span class="tag">START</span>
              {{formatDate(setting.startDate)}}
          </div>
          <div class="col-md-4">
              <span class="tag">END</span> 
              {{formatDate(setting.endDate)}}
          </div>
          <div class="col-md-2"></div>
          <a class="mt-3" v-show="!changeDateForm" href="#" @click.prevent="changeDateForm = true">Change</a>
      </div>

      <div v-else class="mt-5 col-md-6 mx-auto">
          <h5>Set Date And Time</h5>
          <b-alert class="col-md-10 mx-auto" v-model="showAlert" variant="warning" dismissible>
              <strong>{{errorMsg}}</strong>
          </b-alert>
          <div class="row">

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
              <v-btn :loading="loading" :color="btnColor" style="color: floralwhite" class="btn btn-block myBtn col-4" @click="createSetting()">SUBMIT</v-btn>
          </div>
      </div>

      <div class="mt-5 col-md-6 mx-auto rounded border" v-if="setting" v-show="changeDateForm">
          <h5>Change Date And Time</h5>
          <b-alert class="col-md-10 mx-auto" v-model="showAlert" variant="warning" dismissible>
              <strong>{{errorMsg}}</strong>
          </b-alert>
          <div class="row">
              <v-btn :color="btnColor" top right absolute fab title="Close" style="color: floralwhite" @click.prevent="closeDateForm()">
                  <v-icon>mdi-close</v-icon>
              </v-btn>
              <div class="col-md-4">
                  <v-menu ref="startMenu" v-model="startMenu" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                      <template v-slot:activator="{ on }">
                          <v-text-field solo readonly @change="setEndDate()" v-model="startDay" label="Date" persistent-hint v-on="on"></v-text-field>
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

          </div>
          <div class="row">
              <div class="col-md-4 border-top pt-3">
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
              <v-btn :loading="loading" :color="btnColor" style="color: floralwhite" class="btn btn-block myBtn col-4" @click="updateSetting()">CHANGE</v-btn>
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
        startTime: "",
        endDay: null,
        endTime: "",
        endPeriod: "",
        startPeriod: "",
        loading: false

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
    }
}
</script>

<style>

</style>