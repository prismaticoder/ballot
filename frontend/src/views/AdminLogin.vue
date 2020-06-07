<template>
  <div class="container">

      <h3 class="main-header" style="text-align: center;">Admin Login | Ballot</h3>
      <hr>

        <b-alert class="mt-4 col-md-5 mx-auto" v-model="showAlert" variant="warning" dismissible>
            <strong>{{errorMsg}}</strong>
        </b-alert>


    <form class="text-dark mt-5" @submit.prevent="attemptLogin()">
    
        <div class="form-group" style="text-align: center;">
            <label for="username">Username</label>

            <input required v-model="username" class="form-control mx-auto col-md-5 col-sm-10" id="username" type="text" placeholder="Enter your username here...">
        </div>


        <div class="form-group" style="text-align: center;">
            <label for="password">Password</label>

            <input required v-model="password" class="form-control mx-auto col-md-5 col-sm-10" id="password" type="password" placeholder="Enter your password here...">
        </div>


        <div class="d-flex justify-content-center mt-5">
                <v-btn type="submit" :loading="loading" :color="btnColor" style="color: floralwhite" class="text-capitalize btn btn-block myBtn col-md-5 col-xs-12 col-sm-12">Submit</v-btn>
        </div>

    </form>
      
  </div>
</template>

<script>
export default {
    name: 'AdminLogin',
    data() {
        return {
            username: "",
            password: "",
            errorMsg: null,
            loading: false,
            showAlert: false,
            btnColor: "#162059",
        }
    },
    methods: {
        attemptLogin() {
            let username = this.username;
            let password = this.password;
            this.loading = true

             this.$http.post(`admin/login`, {
                username,
                password
            })
            .then(res => {
                let { username, token } = res.data;
                let data = {username, token}
                this.$store.dispatch('loginUser', data)
                .then(()=> {
                    this.$router.push({ name: 'admin-home'})
                })
                .catch(() => {
                    console.log("Login error")
                })
                
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