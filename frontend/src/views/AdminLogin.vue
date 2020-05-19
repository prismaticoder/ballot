<template>
  <div class="container mt-5">

      <h1 class="main-header mt-5" style="text-align: center;">Admin Login | Ballot</h1>
      <hr>

        <b-alert show variant="warning" v-if="errorMsg" dismissible>
            <strong>{{errorMsg}}</strong>
        </b-alert>


    <form class="text-dark mt-4" @submit.prevent="attemptLogin()">
    
        <div class="form-group" style="text-align: center;">
            <label for="username">Username</label>

            <input required v-model="username" class="form-control mx-auto col-md-5 col-sm-10" id="username" type="text" placeholder="Enter your username here...">
        </div>


        <div class="form-group" style="text-align: center;">
            <label for="password">Password</label>

            <input required v-model="password" class="form-control mx-auto col-md-5 col-sm-10" id="password" type="password" placeholder="Enter your password here...">
        </div>


        <div class="d-flex justify-content-center mt-5">
                <button type="submit" class="btn btn-block myBtn col-md-5 col-xs-12 col-sm-12">Submit</button>
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
            errorMsg: null
        }
    },
    methods: {
        attemptLogin() {
            let username = this.username;
            let password = this.password;

            this.$http.post(`${process.env.VUE_APP_URL}/admin/login`, {
                username,
                password
            })
            .then(res => {
                if (res.data.success) {
                    let { username, token } = res.data;
                    localStorage.setItem('userToken', token)
                    this.$store.commit('USER_LOGIN', token, username)
                    this.$router.push('/admin/')
                }
                else {
                    this.errorMsg = res.data.error;
                }
            })
            .catch(err => {
                this.errorMsg = err.response.data.error;
            })
        }
    }
}
</script>

<style>

</style>