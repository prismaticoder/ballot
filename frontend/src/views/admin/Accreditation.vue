<template>
<div class="container" v-if="state && state == 'prevoting'">
     <h3 class="main-header" style="text-align: center;">Admin Accreditation</h3>
      <hr>

      <p class="mt-5 text-left" v-show="!student">
        Here, you can accredit any eligible voter who doesn't have access to his/her student mail and has presented a means of identification. A mail would be sent to such a person's personal email address (which you are to provide) for confirmation.
      </p>
     
    <div class="col-md-6 mt-3 mx-auto" v-if="student == null">
    <hr>

      <b-alert class="col-md-12 mx-auto" v-model="showAlert" variant="warning" dismissible>
        <strong>{{errorMsg}}</strong>
      </b-alert>
      <form class="" action="" @submit.prevent="checkVoter()">
        <div class="form-group">
          <label for="surname">Surname</label>
          <input required type="text" id="surname" v-model="lastName" class="form-control" placeholder="Enter the surname here...">
        </div>
        <div class="form-group">
          <label for="matric">Matric. Number</label>
          <input required type="text" id="matric" minlength="6" maxlength="6" v-model="matric" class="form-control" placeholder="Enter the matric number here...">
        </div>
        <div class="form-group">
          <label for="mail">Personal Email Address</label>
          <input required type="email" id="mail" v-model="mail" class="form-control" placeholder="Enter the personal email address here...">
        </div>
        <div class="mt-5">
          <v-btn type="submit" :loading="loading" :block="true" :color="btnColor" style="color: floralwhite" class="text-capitalize btn btn-block myBtn col-md-6">Accredit Student</v-btn>
        </div>
      </form>
    </div>

    <div class="mt-5 text-left" v-else>
      <p>
        An email has been sent to the email address provided(<strong>{{mail}}</strong>). The student should ensure to follow the steps contained in the mail to formally be confirmed as a voter in the upcoming elections.<br><br>
      </p>

      <hr>

      <div class="text-center mt-5">
        <v-btn rounded :color="btnColor" dark @click.prevent="goBack()">Go Back</v-btn>
      </div>
    </div>
      
  </div>

  <div class="container" v-else-if="!state">
    <h3 class="main-header" style="text-align: center;">Admin Accreditation</h3>
    <hr>
      <p class="mt-3">
        Loading...
      </p>
  </div>

  <div class="container" v-else>
    <h3 class="main-header" style="text-align: center;">Admin Accreditation</h3>
      <hr>
    <p class="mt-3">
      Sorry, accreditation can only be performed during the pre-election period. You would have to wait till the next election iteration to get accredited.
    </p>
  </div>
</template>

<script>
export default {
    name: "AdminAccreditation",
    data() {
      return {
        lastName: "",
        matric: null,
        mail: "",
        student: null,
        loading: false,
        showAlert: false,
        errorMsg: "",
        btnColor: "#162059",
      }
    },
    methods: {
      checkVoter() {
        let { lastName, matric, mail } = this;

        this.loading = true;

        this.$http.post(`admin/accredit`, {
          matric,lastName,mail
        })
        .then(res => {
          this.loading = false
          this.student = res.data.student
        })
        .catch(err => {
          this.loading = false
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