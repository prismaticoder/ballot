<template>
  <div class="container" v-if="state && state == 'prevoting'">
     <h3 class="main-header" style="text-align: center;">Voter Accreditation</h3>
      <hr>

      <p class="mt-5 text-left" v-show="!student">
        <span class="header">IMPORTANT NOTICE</span>
        For privacy and verification purposes, to be accredited for this election, you will need access to your student email address; as your voter's number and the necessary confirmation details will be sent to that address. <br>
        In the event that you do not already have access to your student email address, you are advised to visit <a href="http://osmis.ui.edu.ng/mail">osmis.ui.edu.ng/mail</a> to set a valid password for your student email account after which you will be able to access it.<br>
        If you are still having challenges with your student email address after following the steps above, you will have to physically meet any member of the electoral committee and present a proof of identification after which a voter's number will be generated for you.
      </p>
     
    <div class="col-md-6 mt-3 mx-auto" v-if="student == null">
      <hr>
      <v-dialog v-model="dialog" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Please wait...
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>

      <b-alert class="col-md-12 mx-auto" v-model="showAlert" variant="warning" dismissible>
        <strong>{{errorMsg}}</strong>
      </b-alert>
      <form class="" action="" @submit.prevent="checkVoter()">
        <div class="form-group">
          <label for="surname">Surname</label>
          <input required type="text" id="surname" v-model="lastName" class="form-control" placeholder="Enter your surname here...">
        </div>
        <div class="form-group">
          <label for="matric">Matric. Number</label>
          <input required type="text" id="matric" minlength="6" maxlength="6" v-model="matric" class="form-control" placeholder="Enter your matric number here...">
        </div>
        <div class="mt-5">
          <v-btn type="submit" :block="true" :color="btnColor" style="color: floralwhite" class="text-capitalize btn btn-block myBtn col-md-6">Verify Me!</v-btn>
        </div>
      </form>
    </div>

    <div class="mt-5 text-left" v-else>
      <p>
          <strong>Hey {{student.firstName}},</strong><br><br>
          An email has been sent to your student email address (<strong>{{student.prospectiveMail}}</strong>). Do ensure to follow the steps contained in the mail to formally confirm yourself as a voter in the upcoming elections.<br><br>
          Regards,<br>
          The <strong>{{appName}}</strong> Electoral Committee.
        </p>

        <hr>

        <div class="text-center mt-5">
          <v-btn rounded :color="btnColor" dark @click.prevent="goBack()">Go Back</v-btn>
        </div>
    </div>
      
  </div>

  <div class="container" v-else-if="!state">
    <h3 class="main-header" style="text-align: center;">Voter Accreditation</h3>
      <hr>
    <p class="mt-3">
      Loading...
    </p>
  </div>

  <div class="container" v-else>
    <h3 class="main-header" style="text-align: center;">Voter Accreditation</h3>
      <hr>
    <p class="mt-3">
      Sorry, accreditation can only be performed during the pre-election period. You would have to wait till the next election iteration to get accredited.
    </p>
  </div>
</template>

<script>
export default {
    name: 'Accreditation',
    data() {
      return {
        btnColor: "#162059",
        lastName: "",
        matric: "",
        student: null,
        appName: process.env.VUE_APP_NAME,
        dialog: false,
        showAlert: false,
        errorMsg: ""
      }
    },
    methods: {
      checkVoter() {
        let { lastName, matric } = this;

        this.dialog = true;

        this.$http.post(`${process.env.VUE_APP_URL}/accredit`, {
          matric,lastName
        })
        .then(res => {
          this.dialog = false
          this.student = res.data.student
        })
        .catch(err => {
          this.dialog = false
          this.showAlert = true;
          this.errorMsg = err.response ? err.response.data.error : "Error processing your request, please try again"
        })
      },

      goBack() {
        window.location.reload()
      }
    },

    computed: {
      state() {
        return this.$store.getters.state
      }
    }
}
</script>

<style>

</style>