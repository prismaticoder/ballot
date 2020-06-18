<template>
  <div class="container">
      <h3 class="main-header mt-4" style="text-align: center;">Voting Stats By Level</h3>
      <hr>

      <div class="row mt-5 justify-content-center" v-if="isLoaded">
        <v-card v-for="stat in stats" :key="stat.level" class="mx-auto mt-5" width="20rem" shaped>
            <v-card-title class="text-center">{{stat.level}} LEVEL</v-card-title>
            <v-card-text>
                <div>
                    <span class="tag mb-2">VOTES SO FAR</span>
                    <span class="voter blueColor">{{stat.count}}</span>
                </div>
            </v-card-text>
        </v-card>
      </div>
      <div class="row mt-5 justify-content-center" v-else> 
        <v-skeleton-loader type="card" class="m-3 col-lg-3 col-4"></v-skeleton-loader>
        <v-skeleton-loader type="card" class="m-3 col-lg-3 col-4"></v-skeleton-loader>
        <v-skeleton-loader type="card" class="m-3 col-lg-3 col-4"></v-skeleton-loader>
        <v-skeleton-loader type="card" class="m-3 col-lg-3 col-4"></v-skeleton-loader>
        <v-skeleton-loader type="card" class="m-3 col-lg-3 col-4"></v-skeleton-loader>
        <v-skeleton-loader type="card" class="m-3 col-lg-3 col-4"></v-skeleton-loader>
      </div>
      
  </div>
</template>

<script>
export default {
    name: "Stats",
    data() {
        return {
            stats: null,
            isLoaded: false
        }
    },
    methods: {
        init() {
            this.$http.get('stats')
            .then(res => {
                this.stats = res.data.stats
                this.isLoaded = true
            })
            .catch(err => alert(err.response ? err.response.data.error : "Error processing request"))
        }
    },
    mounted() {
        this.init()
    }
}
</script>

<style>

</style>