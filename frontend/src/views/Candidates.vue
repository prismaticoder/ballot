<template>
  <div class="container">

      <h3 class="main-header mt-4" style="text-align: center;">{{appName}} ELECTION CANDIDATES</h3>
      <hr>

      <div v-if="isLoaded && categories.length > 0">

            <b-form-group class="mt-3 col-md-4 mx-auto" label-for="category">
                <template v-slot:label>
                    Go To Category
                </template>
                <b-form-select id="category" @change="goToCategory()" v-model="categoryName" required>
                    <b-form-select-option :value="''">All</b-form-select-option>
                    <b-form-select-option :value="formatName(category.name)" v-for="category in categories" :key="category.id">{{category.name}}</b-form-select-option>
                </b-form-select>
            </b-form-group>

          <div class="mt-5 mx-auto" v-for="category in categories" v-bind:key="category.id">
            <span :id="formatName(category.name)" class="mt-n5">&nbsp;</span>
            <h4 class="text-center"><strong>CATEGORY: {{category.name.toUpperCase()}}</strong></h4>
            <hr>
            <SingleCategory class="justify-content-center" :category="category"></SingleCategory>
            <hr>
          </div>
      </div>

      <div v-else-if="isLoaded && categories.length == 0">
          <p class="mt-5">
              No categories have been added yet at this time. Do ensure to check back for more updates :)
          </p>
      </div>

      <div v-else>
          <v-skeleton-loader class="mx-auto mt-5" type="heading"></v-skeleton-loader>

          <div class="row justify-content-center">
              <v-skeleton-loader type="card, text" class="m-3" width="20rem"></v-skeleton-loader>
              <v-skeleton-loader type="card, text" class="m-3" width="20rem"></v-skeleton-loader>
              <v-skeleton-loader type="card, text" class="m-3" width="20rem"></v-skeleton-loader>
              <v-skeleton-loader type="card, text" class="m-3" width="20rem"></v-skeleton-loader>
              <v-skeleton-loader type="card, text" class="m-3" width="20rem"></v-skeleton-loader>
              <v-skeleton-loader type="card, text" class="m-3" width="20rem"></v-skeleton-loader>
          </div>
      </div>

                

  </div>
</template>

<script>

import SingleCategory from '@/components/SingleCategory'

export default {
    name: 'Candidates',
    components: {
        SingleCategory
    },
    data() {
        return {
            appName: process.env.VUE_APP_NAME,
            categories : [],
            isLoaded: false,
            categoryName: null
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.$http.get(`candidates`)
            .then(res => {
                this.isLoaded = true
                this.categories = res.data.categories
            })
            .catch(err => {
                console.log(err)
            })

        },
        formatName(name) {
            let newName = name.toLowerCase().split(' ').join('-')
            return newName
        },
        goToCategory() {
            window.location.hash = `#${this.categoryName}`
        }
    },
}
</script>

<style>

</style>