<template>
  <div class="container">
      <h3 class="main-header" style="text-align: center;">Voting Stats By Level</h3>
      <hr>

      <div class="row mt-5 justify-content-center">
        <div class="col-lg-3 col-4 m-3 border" v-for="stat in stats" :key="stat.level">
            <div class="col-12">
                <h5>{{stat.level}} LEVEL</h5>
            </div>
            <div class="col-12">
                <span class="timer">{{stat.count}}</span>
            </div>
        </div>
      </div>
      
  </div>
</template>

<script>
export default {
    name: "Stats",
    data() {
        return {
            stats: null
        }
    },
    methods: {
        init() {
            this.$http.get('stats')
            .then(res => {
                this.stats = res.data.stats
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