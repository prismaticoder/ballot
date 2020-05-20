<template>
  <div class="container">

      <h3 class="main-header" style="text-align: center;">{{appName}} ELECTION CANDIDATES</h3>
      <hr>

      <div v-if="isLoaded">
          <div class="mt-5 mx-auto" v-for="category in categories" v-bind:key="category.id">
            <h4 class="text-center"><strong>CATEGORY: {{category.name.toUpperCase()}}</strong></h4>
            <SingleCategory class="justify-content-center" :category="category"></SingleCategory>
            <hr>
          </div>
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

import SingleCategory from '../components/SingleCategory'

export default {
    name: 'Candidates',
    components: {
        SingleCategory
    },
    data() {
        return {
            appName: process.env.VUE_APP_NAME,
            categories : [],
            isLoaded: false
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.$http.get(`${process.env.VUE_APP_URL}/candidates`)
            .then(res => {
                this.isLoaded = true
                this.categories = res.data.categories
            })
            .catch(err => {
                console.log(err)
            })

        },
    },
}
</script>

<style>

</style>