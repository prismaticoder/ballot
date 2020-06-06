<template>
  <div class="container" v-if="token">
      <h3 class="main-header" style="text-align: center;">Vote Your Candidates | Ballot</h3>
      <hr>
        <div v-for="category in categories" :key="category.id">
            <VoteSingleCategory :category="category" />
        </div>
        
  </div>
  <div v-else>
      <VoterLogin v-on:updateToken="updateToken" />
  </div>
</template>

<script>

import VoterLogin from './VoterLogin'
import VoteSingleCategory from '../components/VoteSingleCategory'

export default {
    name: "Vote",
    components: {
        VoterLogin,
        VoteSingleCategory
    },
    data() {
        return {
            token: localStorage.getItem('bToken') || null,
            categories: null
        }
    },
    methods: {
        updateToken() {
            window.location.reload()
        },
        init() {
            if (this.token) {
                this.$http.get(`vote/categories`)
                .then(res => {
                    this.categories = res.data.categories
                })
                .catch(err => console.log(err.response.data.error)) 
            }
             
        }
    },
    mounted() {
        this.init()
    }
}
</script>

<style>

</style>