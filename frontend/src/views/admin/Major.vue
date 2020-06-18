<template>
  <div class="container">
      <h3 class="main-header mt-4" style="text-align: center;">Admin Page</h3>
      <hr>

      <h4 class="mt-5 text-center">ADMINS</h4>

        <v-btn :color="btnColor" fab class="mt-2 btn-fix float-md-right" v-show="isLoaded" v-if="!showAddForm" title="Add new admin" style="color: floralwhite" @click.prevent="showAddForm = true">
            <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn :color="btnColor" fab class="mt-2 btn-fix float-md-right" v-else title="Close form" style="color: floralwhite" @click.prevent="showAddForm = false">
            <v-icon>mdi-close</v-icon>
        </v-btn>
      <hr>

    <div class="col-md-8 mx-auto" v-show="showAddForm">
        <h5>ADD NEW ADMIN</h5>
        <b-alert class="col-md-12" v-model="showAlert" variant="warning" dismissible>
            <strong>{{errorMsg}}</strong>
        </b-alert>
        <b-form class="col-md-6 mx-auto text-left" @submit.prevent="addAdmin()">
            <b-form-group label-for="name">
                <template v-slot:label>
                    Username <span class="text-danger">*</span>
                </template>
                <b-form-input id="name" v-model="username" required placeholder="e.g user.name"></b-form-input>
            </b-form-group>

            <b-form-group label-for="password">
                <template v-slot:label>
                    Password <span class="text-danger">*</span>
                </template>
                <b-form-input id="password" v-model="password" type="password" required placeholder="Enter Password here..."></b-form-input>
            </b-form-group>

            <b-form-group label-for="conf_password">
                <template v-slot:label>
                    Confirm Password <span class="text-danger">*</span>
                </template>
                <b-form-input :disabled="!password" id="conf_password" v-model="conf_password" type="password" required placeholder="Confirm Password"></b-form-input>
            </b-form-group>

            <div class="mt-3">
                <v-btn type="submit" :disabled="password && password !== conf_password" :loading="loading" :block="true" :color="btnColor" style="color: floralwhite" class="btn btn-block myBtn col-md-6">Add</v-btn>
            </div>
        </b-form>
        <hr>
    </div>

        <v-snackbar v-model="snackbar">
            {{ text }}
            <v-btn color="pink" text @click="snackbar = false">
                Close
            </v-btn>
        </v-snackbar> 

      <div class="row justify-content-center" v-if="isLoaded && admins.length > 0">
          <div class="col-lg-4" v-for="(admin,index) in admins" :key="admin.id">
              <EachAdmin :admin="admin" :index="index" v-on:deleteAdmin="deleteAdmin"/>
          </div>
      </div>
      <div v-else-if="isLoaded && admins.length == 0">
          <p class="text-center">
              No administrators have been added at this time.
          </p>
      </div>
      <div v-else class="row">
          <div class="col-lg-4 mt-5">
              <v-skeleton-loader type="image" width="20rem"></v-skeleton-loader>
              <div class="row mx-auto">
                  <div class="col-2"></div>
                  <v-skeleton-loader class="col-4" type="avatar"></v-skeleton-loader>
                  <!-- <div class="col-md-2"></div> -->
                  <v-skeleton-loader class="col-4" type="avatar"></v-skeleton-loader>
              </div>
          </div>
          <div class="col-lg-4 mt-5">
              <v-skeleton-loader type="image" width="20rem"></v-skeleton-loader>
              <div class="row mx-auto">
                  <div class="col-2"></div>
                  <v-skeleton-loader class="col-4" type="avatar"></v-skeleton-loader>
                  <!-- <div class="col-md-2"></div> -->
                  <v-skeleton-loader class="col-4" type="avatar"></v-skeleton-loader>
              </div>
          </div>
          <div class="col-lg-4 mt-5">
              <v-skeleton-loader type="image" width="20rem"></v-skeleton-loader>
              <div class="row mx-auto">
                  <div class="col-2"></div>
                  <v-skeleton-loader class="col-4" type="avatar"></v-skeleton-loader>
                  <!-- <div class="col-md-2"></div> -->
                  <v-skeleton-loader class="col-4" type="avatar"></v-skeleton-loader>
              </div>
          </div>
          <div class="col-lg-4 mt-5">
              <v-skeleton-loader type="image" width="20rem"></v-skeleton-loader>
              <div class="row mx-auto">
                  <div class="col-2"></div>
                  <v-skeleton-loader class="col-4" type="avatar"></v-skeleton-loader>
                  <!-- <div class="col-md-2"></div> -->
                  <v-skeleton-loader class="col-4" type="avatar"></v-skeleton-loader>
              </div>
          </div>
          <div class="col-lg-4 mt-5">
              <v-skeleton-loader type="image" width="20rem"></v-skeleton-loader>
              <div class="row mx-auto">
                  <div class="col-2"></div>
                  <v-skeleton-loader class="col-4" type="avatar"></v-skeleton-loader>
                  <!-- <div class="col-md-2"></div> -->
                  <v-skeleton-loader class="col-4" type="avatar"></v-skeleton-loader>
              </div>
          </div>
          <div class="col-lg-4 mt-5">
              <v-skeleton-loader type="image" width="20rem"></v-skeleton-loader>
              <div class="row mx-auto">
                  <div class="col-2"></div>
                  <v-skeleton-loader class="col-4" type="avatar"></v-skeleton-loader>
                  <!-- <div class="col-md-2"></div> -->
                  <v-skeleton-loader class="col-4" type="avatar"></v-skeleton-loader>
              </div>
          </div>
      </div>
  </div>
</template>

<script>

import EachAdmin from '@/components/admin/EachAdmin'

export default {
    name: "Major",
    components: {
        EachAdmin
    },
    data() {
        return {
            admins: null,
            isLoaded: false,
            showAlert: false,
            errorMsg: "",
            showAddForm: false,
            loading: false,
            snackbar: false,
            text: "",
            btnColor: "#162059",
            username: "",
            password: "",
            conf_password: ""
        }
    },
    methods: {
        init() {
            this.$http.get('admin/all')
            .then(res => {
                this.admins = res.data.admins
                this.isLoaded = true
            })
            .catch(err => {
                if (err.response) {
                    alert("Access Forbidden to this page")
                    this.$router.replace('/command')
                }
                else {
                    alert("Error Loading Page, Please Try Again")
                }
                
            })
        },
        deleteAdmin(id) {
            this.$http.delete(`admin/deleteAdmin/${id}`)
            .then(res => {
                this.snackbar = true;
                this.text = res.data.message
                this.admins = this.admins.filter(admin => admin.id !== id)
            })
            .catch(err => {
                alert(err.response ? err.response.data.error : "There was an error processing your request, please try again")
            })
        },
        addAdmin() {
            let { username, password } = this
            this.loading = true

            this.$http.post('admin/create', { username, password })
            .then(res => {
                this.loading = false
                this.text = res.data.message
                this.username = ""
                this.password = ""
                this.conf_password = ""
                this.snackbar = true
                let { id, username } = res.data.admin
                this.admins.push({id,username})
            })
            .catch(err => {
                this.loading = false
                this.errorMsg = err.response ? err.response.data.error : "There was an error processing your request, try again"
                this.showAlert = true
            })
        }
    },
    mounted() {
        this.init()
    }
}
</script>

<style>

</style>