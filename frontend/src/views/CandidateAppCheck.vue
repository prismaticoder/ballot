<template>
  <div class="container mt-5">

    <v-breadcrumbs :items="items" class="">
            <template v-slot:divider>
                <v-icon>mdi-chevron-right</v-icon>
            </template>
        </v-breadcrumbs>

      <hr>

    <div class="col-md-6 mt-5 mx-auto" v-if="candidate == null">

      <b-alert class="mt-4 col-md-8 mx-auto" v-model="showAlert" variant="warning" dismissible>
        <strong>{{errorMsg}}</strong>
      </b-alert>
      <form class="mt-5" action="" @submit.prevent="checkCandidate()">
        <div class="form-group">
          <label for="matric">Matric. Number</label>
          <input required type="text" id="matric" minlength="6" maxlength="6" v-model="matric" class="form-control" placeholder="Enter your matric number here...">
        </div>
        <div class="form-group">
          <label for="statusCode">Status Code</label>
          <input required type="text" id="statusCode" v-model="statusCode" class="form-control" placeholder="Enter your status code here...">
        </div>
        <div class="mt-5">
          <v-btn type="submit" :loading="loading" :block="true" :color="btnColor" style="color: floralwhite" class="text-capitalize btn btn-block myBtn col-md-6">Submit</v-btn>
        </div>
      </form>
    </div>


    <div v-else class="mx-auto mt-5 text-left">
      <div v-if="candidate.status == 'confirmed'">
        <p class="mb-5">
          <strong>Congratulations {{candidate.firstName}},</strong><br><br>
          You have been confirmed as a candidate for the post of <strong>{{candidate.category.name}}</strong> in the upcoming elections. We wish you best of luck.<br><br>
          Regards,<br>
          The <strong>{{appName}}</strong> Electoral Committee.
        </p>

        <v-icon>mdi-arrow-left</v-icon> <a href="#" class="blueColor" @click.prevent="reloadPage()">Go Back</a>
      </div>
      <div v-else-if="candidate.status == 'denied'">
        <p class="mb-5">
          <strong>Dear {{candidate.firstName}},</strong><br><br>
          We regret to inform you that your application for candidacy for the post of <strong>{{candidate.category.name}}</strong> in the upcoming election has been denied after thorough vetting by the electoral committee. Do well to check in with us if you assume we made any error as reagrds this decision.<br><br>
          Regards,<br>
          The <strong>{{appName}}</strong> Electoral Committee.
        </p>

        <v-icon>mdi-arrow-left</v-icon> <a href="#" class="blueColor" @click.prevent="reloadPage()">Go Back</a>
      </div>
      <div v-else>
        Dear {{candidate.firstName}},<br>
        Your application for the candidacy for the post of <strong>{{candidate.category.name}}</strong> in the upcoming election is still <strong>pending</strong>. Keep checking this page as regards any updates.<br>
        In the mean time, you can update some parts of your application here:

        <form class="mt-5 col-md-5" action="" @submit.prevent="updateCandidate(candidate.id)">

          <b-alert class="mt-4 col-md-8" v-model="showAlert" variant="warning" dismissible>
            <strong>{{errorMsg}}</strong>
          </b-alert>

          <v-dialog v-model="dialog" persistent max-width="300">
              <v-card>
                  <v-card-title class="headline">Cancel Application?</v-card-title>
                  <v-card-text>
                    Are you sure you want to cancel your application as a candidate in the upcoming elections? 
                  </v-card-text>
                  <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="green darken-1" text @click="dialog = false">No</v-btn>
                      <v-btn :loading="dialogLoad" color="green darken-1" text @click="cancelApplication(candidate.id)">Yes</v-btn>
                  </v-card-actions>
              </v-card>
          </v-dialog>

          <div class="form-group">
              <label for="name">Name</label>
              <input type="text" class="form-control" readonly :value="candidate.fullName">
          </div>
          <b-form-group label="Alias" label-for="alias" description="Fill in this field if you have an alias you would like to be recognized with for the election">
              <b-form-input id="alias" v-model="candidate.alias" type="text" placeholder="Enter alias here..." :value="candidate.alias"></b-form-input>
          </b-form-group>

          <b-form-group label="Phone Number" label-for="phoneNumber">
              <b-form-input required id="phoneNumber" v-model="candidate.phoneNumber" type="text" minlength="11" maxlength="11" pattern="\d*" title="This field must contain numbers only" placeholder="E.g 08012345678"></b-form-input>
          </b-form-group>

          <b-form-group label="Twitter Profile Link" label-for="twitter">
              <b-form-input id="twitter" pattern="http://(www\.)?twitter\.com\/(\w+)|https://(www\.)?twitter\.com\/(\w+)" title="This field must contain a valid twitter url" v-model="candidate.twitter" type="url" placeholder="E.g https://twitter.com/myusername"></b-form-input>
          </b-form-group>

            <b-form-group label="Instagram Profile Link" label-for="instagram">
              <b-form-input id="instagram" pattern="http://(www\.)?instagram\.com\/(\w+)|https://(www\.)?instagram\.com\/(\w+)" title="This field must contain a valid instagram url"  v-model="candidate.instagram" type="url" placeholder="E.g https://instagram.com/myusername"></b-form-input>
          </b-form-group>

          <b-form-group label="Your plans as a candidate (<100 words)" label-for="manifesto">
              <b-form-textarea v-model="candidate.manifesto" required placeholder="Enter not more than 100 words" rows="8"></b-form-textarea>
          </b-form-group>


          <div class="mt-3">
            <v-btn type="submit" :loading="loading" :block="true" :color="btnColor" style="color: floralwhite" class="text-capitalize btn btn-block myBtn col-md-6">Submit</v-btn>
          </div>

        </form>

        <p class="mt-5">
          In the event that you wish to cancel your application, you can click <a href="#" @click.prevent="dialog = true">here</a>
        </p>
      </div>

    </div>
  </div>
</template>

<script>
export default {
    name: 'CandidateAppCheck',
    data() {
      return {
        candidate: null,
        btnColor: "#162059",
        statusCode: "",
        loading: false,
        showAlert: false,
        errorMsg: "",
        dialogLoad: false,
        matric:"",
        dialog: false,
        appName: process.env.VUE_APP_NAME,
        items: [
            {
                disabled: false,
                text: "CANDIDATES",
                exact: true,
                link: true,
                to: "/candidates"
            },
            {
                disabled: false,
                text: `CHECK APPLICATION STATUS`,
            },]
      }
    },
    methods: {
      checkCandidate() {
        let {statusCode,matric} = this;

        this.loading = true 

        this.$http.get(`${process.env.VUE_APP_URL}/candidates/checkStatus?statusCode=${statusCode}&matric=${matric}`)
        .then(res => {
          this.loading = false
          this.showAlert = false
          this.candidate = res.data.candidate
        })
        .catch(err => {
          this.loading = false
          this.showAlert = true;
          this.errorMsg = err.response ? err.response.data.error : "Error processing request, please try again"
        })

      },
      updateCandidate(id) {
        let {alias,twitter,instagram,manifesto,phoneNumber} = this.candidate

        let numWords = manifesto.split(' ').length;

        if (numWords > 100) {
          this.showAlert = true;
          this.errorMsg = "Your plans shouldn't be more than 100 words"
          window.scrollTo(0,0);
        }

        else {
          this.loading = true

          this.$http.put(`${process.env.VUE_APP_URL}/candidates/${id}`, {
            alias,twitter,instagram,manifesto,phoneNumber
          })
          .then(res => {
            this.loading = false
            this.showAlert = true;
            this.errorMsg = res.data.message;
            window.scrollTo(0,0);
          })
          .catch(err => {
            this.loading = false;
            this.showAlert = true
            this.errorMsg = err.response ? err.response.data.error : "Error processing request, please try again"
            window.scrollTo(0,0);
          })
        }
      },

      cancelApplication(id) {
        this.dialogLoad = true;

        this.$http.delete(`${process.env.VUE_APP_URL}/candidates/${id}?statusCode=${this.statusCode}`)
        .then(res => {
          this.dialog = false;
          alert(res.data.message)
          this.$router.replace({name : 'all-candidates'})
        })
        .catch(err => {
          this.dialogLoad = false
          this.dialog = false
          err.response ? alert(err.response.data.error) : alert("Error processing your request, please try again")
        })
      },

      reloadPage() {
        window.location.reload()
      }

    }
}
</script>

<style>

</style>