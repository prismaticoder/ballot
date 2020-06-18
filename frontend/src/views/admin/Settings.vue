<template>
  <div class="container">
      <h3 class="main-header mt-4" style="text-align: center;">Election Settings And Configuration</h3>
      <hr>

      <div>
          <h4 class="mt-4">DATE AND TIME</h4>
          <DateTime class="mt-4" v-if="isLoaded" :setting="setting" :types="types" :items="items" :btnColor="btnColor" :today="today" v-on:updateSetting="updateSetting" v-on:createSetting="createSetting"/>
          <div v-else>
              <div class="row">
                  <div class="col-md-2"></div>
                  <div class="col-md-4 border-right">
                      <v-skeleton-loader type="heading" width="15rem"></v-skeleton-loader>
                      <v-skeleton-loader type="text" class="mt-3" width="18rem"></v-skeleton-loader>
                  </div>
                  <div class="col-md-2"></div>
                  <div class="col-md-4">
                      <v-skeleton-loader type="heading" width="15rem"></v-skeleton-loader>
                      <v-skeleton-loader type="text" class="mt-3" width="18rem"></v-skeleton-loader>
                  </div>
              </div>
          </div>
      </div>
      
      
        <h4 class="mt-5 text-center">ALL CATEGORIES (POSTS)</h4>

        <v-btn :color="btnColor" fab class="mt-2 btn-fix float-md-right" v-show="isLoaded" v-if="!showAddForm" title="Add new category" style="color: floralwhite" @click.prevent="showAddForm = true">
            <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn :color="btnColor" fab class="mt-2 btn-fix float-md-right" v-else title="Close form" style="color: floralwhite" @click.prevent="showAddForm = false">
            <v-icon>mdi-close</v-icon>
        </v-btn>
      <hr>

    <div class="col-md-8 mx-auto" v-show="showAddForm">
        <h5>ADD NEW POST</h5>
        <b-alert class="col-md-12" v-model="showAlert" variant="warning" dismissible>
            <strong>{{errorMsg}}</strong>
        </b-alert>
        <b-form class="col-md-6 mx-auto text-left" @submit.prevent="addCategory()">
            <b-form-group label-for="name">
                <template v-slot:label>
                    Post Name <span class="text-danger">*</span>
                </template>
                <b-form-input id="name" v-model="name" required placeholder="e.g Vice President"></b-form-input>
            </b-form-group>

            <b-form-group label-for="minLevel">
                <template v-slot:label>
                    Minimum Level required to run for this post <span class="text-danger">*</span>
                </template>
                <b-form-select required v-model="minLevel">
                    <b-form-select-option :value="level" v-for="level in levels" :key="level">{{level}}</b-form-select-option>
                </b-form-select>
            </b-form-group>

             <b-form-group label-for="maxLevel">
                <template v-slot:label>
                    Maximum Level required to run for this post <span class="text-danger">*</span>
                </template>
                <b-form-select required v-model="maxLevel">
                    <b-form-select-option :value="level" v-for="level in levels" :key="level">{{level}}</b-form-select-option>
                </b-form-select>
            </b-form-group>

            <div class="mt-3">
                <v-btn type="submit" :loading="loading" :block="true" :color="btnColor" style="color: floralwhite" class="text-capitalize btn btn-block myBtn col-md-6">Submit</v-btn>
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

      <div class="row justify-content-center" v-if="isLoaded && categories">
          <div class="col-lg-4" v-for="(category,index) in categories" :key="category.id">
              <SingleCategory :category="category" :levels="levels" :index="index" v-on:updateCategory="updateCategory" v-on:deleteCategory="deleteCategory"/>
          </div>
      </div>
      <div v-else-if="isLoaded && !categories">
          <p class="text-center">
              No categories have been created at this time.
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

import SingleCategory from '@/components/admin/SingleCategory';
import DateTime from '@/components/admin/DateTime'

export default {
    name: "Settings",
    components: {
        SingleCategory,
        DateTime
    },
    data() {
        return {
            setting: null,
            categories: null,
            levels: [],
            today: new Date().toISOString().substr(0, 10),
            name: "",
            minLevel: ((process.env.VUE_APP_HIGHEST_LEVEL)/(process.env.VUE_APP_HIGHEST_LEVEL)) * 100,
            maxLevel: process.env.VUE_APP_HIGHEST_LEVEL,
            showAddForm: false,
            btnColor: "#162059",
            isLoaded: false,
            loading: false,
            snackbar: false,
            text: "",
            showAlert: false,
            errorMsg: "",
            types: ["AM","PM"],
            items: ['12:00','1:00','2:00','3:00','4:00','5:00','6:00','7:00','8:00','9:00','10:00','11:00']
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.$http.get(`admin/categories`)
            .then(res => {
                this.categories = res.data.categories;
                let highestLevel = process.env.VUE_APP_HIGHEST_LEVEL;

                for (let i = 100; i <= highestLevel; i+=100) {
                    this.levels.push(i)
                }

                return this.$http.get(`admin/settings`)
                .then(res => {
                    this.setting = res.data.setting;
                    this.isLoaded = true
                })
                .catch(err => {
                    if (err.status === 404) {
                        this.setting = null
                        this.isLoaded = true
                    }
                })
            })
            .catch(err => {
                alert(err.response ? err.response.data.error : "There was an error loading this page, please try again")
            })
        },
        updateCategory(index,category) {
            this.categories.splice(index,1,category)
        },
        deleteCategory(id) {
            this.$http.delete(`admin/categories/${id}`)
            .then(res => {
                this.snackbar = true;
                this.text = res.data.message
                this.categories = this.categories.filter(category => category.id !== id)
            })
            .catch(err => {
                alert(err.response ? err.response.data.error : "There was an error processing your request, please try again")
            })
        },
        addCategory() {
            let { name, minLevel, maxLevel } = this;
            this.loading = true;

            //Remove unnecessary white spaces
            name = name.replace(/\s+/g,' ').trim()

            // Check for some errors before going to the API

            if (maxLevel < minLevel) {
                this.loading = false;
                this.showAlert = true;
                this.errorMsg = "Error: The minimum level must be either less than or equal to the maximum level set";
            }

            else {
                 this.$http.post(`admin/categories`, {
                    name,minLevel,maxLevel
                })
                .then(res => {
                    this.loading = false;
                    this.snackbar = true;
                    this.text = res.data.message
                    this.categories.push(res.data.category)
                    this.name = "";
                    this.minLevel = ((process.env.VUE_APP_HIGHEST_LEVEL)/(process.env.VUE_APP_HIGHEST_LEVEL)) * 100
                    this.maxLevel = process.env.VUE_APP_HIGHEST_LEVEL
                })
                .catch(err => {
                    this.loading = false
                    this.showAlert = true;
                    this.errorMsg = err.response ? err.response.data.error : "Error processing your request, please try again"
                })
            }

        },
        //Automatically set the end date to the start date on change
        setEndDate() {
            if (this.endDay < this.startDay) {
                this.endDay = this.startDay
            }
        },

        updateSetting(setting) {
            this.setting = setting;
        },

        createSetting(setting) {
            this.setting = setting;
        }
    },
    computed: {
        
    }
}
</script>

<style scoped>

@import '../../../node_modules/vue-datetime/dist/vue-datetime.css';

</style>