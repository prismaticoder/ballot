<template>
  <div class="container">

      <h3 class="main-header mt-4" style="text-align: center;">Vote Your Candidates | Ballot</h3>
      <hr>

        <b-alert class="mt-4 col-md-5 mx-auto" v-model="showAlert" variant="warning" dismissible>
            <strong>{{errorMsg}}</strong>
        </b-alert>


    <form class="text-dark mt-5" @submit.prevent="attemptLogin()">
    
        <div class="form-group" style="text-align: center;">
            <label for="matric">Matric. No</label>

            <input required v-model="matric" minlength="6" maxlength="6" pattern="\d{6}" title="This field must contain numbers only"  class="form-control mx-auto col-md-5 col-sm-10" id="matric" type="text" placeholder="Enter your matric number here...">
        </div>


        <div class="form-group" style="text-align: center;">
            <label for="voterCode">Voter Number</label>

            <input required v-model="voterCode" class="form-control mx-auto col-md-5 col-sm-10" id="voterCode" type="text" placeholder="Enter your voter number here...">
        </div>


        <div class="d-flex justify-content-center mt-5">
                <v-btn type="submit" :loading="loading" :disabled="loading" :color="btnColor" style="color: floralwhite" class="text-capitalize btn btn-block myBtn col-md-5 col-xs-12 col-sm-12">Submit</v-btn>
        </div>

    </form>
      
  </div>
</template>

<script>
export default {
    name: 'AdminLogin',
    data() {
        return {
            matric: "",
            voterCode: "",
            errorMsg: null,
            loading: false,
            showAlert: false,
            btnColor: "#162059",
        }
    },
    methods: {
        attemptLogin() {
            let matric = this.matric;
            let voterCode = this.voterCode;
            this.loading = true

             this.$http.post(`voter/verify`, {
                matric,
                voterCode
            })
            .then(res => {
                let { voteToken } = res.data;
                localStorage.setItem('bToken', voteToken)
                this.$emit('updateToken')
            })
            .catch(err => {
                this.showAlert = true
                this.errorMsg = err.response ? err.response.data.error : "Error processing your request, please try again"
                this.loading = false
            })
        }
    }
}
</script>

<style>

</style>