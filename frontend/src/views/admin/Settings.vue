<template>
  <div class="container">
      <h3 class="main-header" style="text-align: center;">Election Settings And Configuration</h3>
      <hr>

      <div>
          <h4 class="mt-4">DATE AND TIME</h4>
            <hr>

                <div class="row justify-content-center">
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
                    
                </div>

                <div class="mt-5 col-md-6 mx-auto border rounded">
                    <h5>Change Date And Time Settings</h5>
                    <div class="row">
                        <div class="col-md-4">
                            <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field solo readonly v-model="startDay" label="Date" persistent-hint v-on="on"></v-text-field>
                                </template>
                                <v-date-picker :color="btnColor" :min="today"  v-model="startDay" no-title @input="menu1 = false"></v-date-picker>
                            </v-menu>
                        </div>
                        <div class="col-4">
                                <v-select :items="items" v-model="startTime" solo></v-select>
                        </div>
                        <div class="col-4">
                            <v-select :items="types" v-model="startPeriod" solo></v-select>
                        </div>

                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <v-menu ref="menu3" v-model="menu3" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field solo readonly v-model="endDay" label="Date" persistent-hint v-on="on"></v-text-field>
                                </template>
                                <v-date-picker :color="btnColor" :min="today" v-model="endDay" no-title @input="menu3 = false"></v-date-picker>
                            </v-menu>
                        </div>
                        <div class="col-4">
                                <v-select :items="items" v-model="endTime" solo></v-select>
                        </div>
                        <div class="col-4">
                            <v-select solo :items="types" v-model="endPeriod"></v-select>
                        </div>
                    </div>

                    <div class="col-12 mt-2">
                        <v-btn :color="btnColor" style="color: floralwhite" class="btn btn-block myBtn col-4" @click="updateSetting()">CHANGE</v-btn>
                    </div>
                </div>
      </div>
      <hr>
        <h4 class="mt-5 text-center">ALL CATEGORIES (POSTS)</h4>

        <v-btn :color="btnColor" fab class="mt-2 btn-fix float-md-right" v-if="!showAddForm" title="Add new category" style="color: floralwhite" @click.prevent="showAddForm = true">
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
            menu1: false,
            menu3: false,
            otherColor: "white",
            setting: null,
            categories: null,
            levels: [],
            showStart: false,
            showEnd: false,
            startDay: null,
            startTime: "",
            endDay: null,
            endTime: "",
            endPeriod: "",
            startPeriod: "",
            today: new Date().toISOString().substr(0, 10),
            name: "",
            minLevel: ((process.env.VUE_APP_HIGHEST_LEVEL)/(process.env.VUE_APP_HIGHEST_LEVEL)) * 100,
            maxLevel: process.env.VUE_APP_HIGHEST_LEVEL,
            showAddForm: false,
            btnColor: "#162059",
            loading: false,
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
            this.$http.get(`${process.env.VUE_APP_URL}/admin/categories`)
            .then(res => {
                this.categories = res.data.categories;
                let highestLevel = process.env.VUE_APP_HIGHEST_LEVEL;

                for (let i = 100; i <= highestLevel; i+=100) {
                    this.levels.push(i)
                }

                return this.$http.get(`${process.env.VUE_APP_URL}/admin/settings`)
                .then(res => {
                    this.setting = res.data.setting;
                    
                    let endTime = parseInt(new Date(res.data.setting.endDate).toISOString().substr(11,2))
                    let startTime = parseInt(new Date(res.data.setting.startDate).toISOString().substr(11,2))

                    this.startTime = startTime > 12 ? `${startTime - 12}:00` : (startTime == 0 ? `${startTime + 12}:00` : `${startTime}:00`) 
                    this.startPeriod = startTime > 12 ? "PM" : "AM"

                    this.endTime = endTime > 12 ? `${endTime - 12}:00` : (endTime == 0 ? `${endTime + 12}:00` : `${endTime}:00`) 
                    this.endPeriod = endTime > 12 ? "PM" : "AM"

                    console.log(this.endTime)


                    this.startDay = new Date(res.data.setting.startDate).toISOString().substr(0, 10)
                    this.endDay = new Date(res.data.setting.endDate).toISOString().substr(0, 10)
                    

                })
                .catch(err => {
                    if (err.status === 404) {
                        this.setting = null
                    }

                    else {
                        console.log(err)
                    }
                })
            })
            .catch(err => {
                console.log(err.response)
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

        },
        formatDate(dateString) {
            const options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" }
            return new Date(dateString).toLocaleDateString(undefined, options)
        },
        setDate(dateString) {
            return new Date(dateString).toISOString().substr(0, 10)
        },
        changeDate(type) {
            if (type == 'start') {
                this.showStart = true;
                this.showEnd = false
            }
            
            else {
                this.showStart = false;
                this.showEnd = true
            }
        }
    },
    computed: {
        
    }
}
</script>

<style scoped>

@import '../../../node_modules/vue-datetime/dist/vue-datetime.css';

</style>