<template>
  <div class="container">
      <h3 class="main-header" style="text-align: center;">Election Settings And Configuration</h3>
      <hr>

        
        <h4 class="mt-5 text-center">ALL CATEGORIES (POSTS)</h4>

        <v-btn :color="btnColor" fab class="mt-2 btn-fix float-md-right" v-if="!showAddForm" title="Add new category" style="color: floralwhite" @click="showAddForm = true">
            <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn :color="btnColor" fab class="mt-2 btn-fix float-md-right" v-else title="Close form" style="color: floralwhite" @click="showAddForm = false">
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

      <div class="row" v-if="categories">
          <div class="col-lg-4" v-for="(category,index) in categories" :key="category.id">
              <SingleCategory :category="category" :levels="levels" :index="index" v-on:updateCategory="updateCategory" v-on:deleteCategory="deleteCategory"/>
          </div>
      </div>
      <div v-else>
          <p class="text-center">
              No categories have been created at this time.
          </p>
      </div>
  </div>
</template>

<script>

import SingleCategory from '../../components/admin/SingleCategory'

export default {
    name: "Settings",
    components: {
        SingleCategory
    },
    data() {
        return {
            date: "",
            categories: null,
            levels: [],
            name: "",
            minLevel: ((process.env.VUE_APP_HIGHEST_LEVEL)/(process.env.VUE_APP_HIGHEST_LEVEL)) * 100,
            maxLevel: process.env.VUE_APP_HIGHEST_LEVEL,
            showAddForm: false,
            btnColor: "#162059",
            loading: false,
            showAlert: false,
            errorMsg: "",
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.$http.get(`${process.env.VUE_APP_URL}/admin/categories`)
            .then(res => {
                this.categories = res.data.categories;
                let highestLevel = process.env.VUE_APP_HIGHEST_LEVEL;

                for (let i = 100; i <= highestLevel; i+=100) {
                    this.levels.push(i)
                }
            })
            .catch(err => {
                console.log(err)
            })
        },
        updateCategory(index,category) {
            this.categories.splice(index,1,category)
        },
        deleteCategory(id) {
            this.$http.delete(`${process.env.VUE_APP_URL}/admin/categories/${id}`)
            .then(res => {
                setTimeout(alert(res.data.message), 2500)

                this.categories = this.categories.filter(category => category.id !== id)
            })
            .catch(err => {
                console.log(err.response.data.error)
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
                this.$http.post(`${process.env.VUE_APP_URL}/admin/categories`, {
                    name,minLevel,maxLevel
                })
                .then(res => {
                    this.loading = false;
                    alert(res.data.message)
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

        }
    }
}
</script>

<style scoped>

@import '../../../node_modules/vue-datetime/dist/vue-datetime.css';

</style>