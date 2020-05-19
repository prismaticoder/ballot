<template>
  <div class="container">

      <h1 class="main-header mt-5" style="text-align: center;">{{appName}} ELECTION CANDIDATES</h1>
      <hr>

      <div class="mt-5" v-for="category in categories" v-bind:key="category.id">
          <h3 class="text-center">CATEGORY: {{category.name.toUpperCase()}}</h3>
          <SingleCategory class="justify-content-center" :category="category"></SingleCategory>
          <hr>
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
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.$http.get(`${process.env.VUE_APP_URL}/candidates`)
            .then(res => {
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