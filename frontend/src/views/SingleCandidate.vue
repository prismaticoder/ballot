<template>
  <div class="container">

      <h2 class="text-center">CANDIDATE PROFILE</h2>
      <hr>

      <div class="row mt-5">
          <div class="col-md-4 p-3 d-flex align-items-center">
              <img :src="candidate.imageUrl" alt="" class="img-fluid" width="350" height="450">
          </div>
          <div class="col-md-8 border-left mt-3 pt-3 text-center">
              <span class="tag">CANDIDATE NAME</span> <span>{{candidate.fullName}}</span>
              <span class="tag mt-3">CURRENT LEVEL</span> <span>{{candidate.level}}</span>
              <span class="tag mt-3">MY PLANS FOR THIS {{appType}}</span> <p>{{candidate.manifesto}}</p>

          </div>
      </div>
  </div>
</template>

<script>
export default {
    name: 'SingleCandidate',
    data() {
        return {
            appType: process.env.VUE_APP_TYPE,
            candidate : {},
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.$http.get(`${process.env.VUE_APP_URL}/candidates/${this.$route.params.id.split('-')[2]}`)
            .then(res => {
                console.log(process.env.VUE_APP_HIGHEST_LEVEL)
                this.candidate = res.data.candidate
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