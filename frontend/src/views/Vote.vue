<template>
  <div class="container" v-if="token">
      <h3 class="main-header" style="text-align: center;">Vote Your Candidates | Ballot</h3>
      <hr>
      <p class="mt-2 text-left">
          <span class="header">INSTRUCTIONS</span>
          Select the candidate you wish to vote for in that category, click the next/previous button to go to the next category. For an undecided vote, do not select any candidate. 
      </p>
      <hr>
        <div class="mt-4" v-if="isLoaded">
            <div class="row">
                <div class="col-2">
                    <v-icon v-show="currentIndex !== 0" class="icon" @click="goToPrevious()" large title="Previous Category">mdi-arrow-left</v-icon>
                </div>
                <div class="col-8">
                    <h4 class="text-capitalize">Category: {{currentCategory.name.toLowerCase()}}</h4>
                </div>
                <div class="col-2">
                    <v-icon v-show="currentIndex !== this.categories.length - 1" @click="goToNext()" class="icon" title="Next Category" large>mdi-arrow-right</v-icon>
                </div>
            </div>
            <hr>
            <VoteSingleCategory :categories="categories" :category="currentCategory" @storeVote="storeVote" :currentIndex="currentIndex" />
        </div>
        <div class="mt-4" v-else>
            <v-skeleton-loader class="mx-auto" type="heading"></v-skeleton-loader>
            <hr>
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
            categories: null,
            currentCategory: null,
            currentIndex: 0,
            isLoaded: false,
            votes: JSON.parse(localStorage.getItem('votes-stored')) || []
        }
    },
    methods: {
        updateToken() {
            window.location.reload()
        },
        storeVote(type, categoryId, candidateId) {
            this.votes = this.votes.filter(vote => vote.categoryId !== categoryId)
            this.votes.push({categoryId, candidateId})
            localStorage.setItem('votes-stored', JSON.stringify(this.votes))

            if (type == 'next') {
                this.currentIndex += 1;
                this.currentCategory = this.categories[this.currentIndex]
            }

            else if (type == 'previous') {
                this.currentIndex -= 1;
                this.currentCategory = this.categories[this.currentIndex]
            }
            
            else {
                this.isLoaded = false
            }

            let selectedArray = this.votes.filter(vote => vote.categoryId == this.currentCategory.id)
            let selectedCandidate = selectedArray.length > 0 ? selectedArray[0].candidateId : null

            this.currentCategory.selectedCandidate = selectedCandidate;
        },
        init() {
            if (this.token) {
                this.$http.get(`vote/categories`)
                .then(res => {
                    this.categories = res.data.categories
                    this.currentCategory = res.data.categories[0]

                    if (this.votes.length > 0) {
                        let selectedArray = this.votes.filter(vote => vote.categoryId == this.currentCategory.id)
                        let selectedCandidate = selectedArray.length > 0 ? selectedArray[0].candidateId : null

                        this.currentCategory.selectedCandidate = selectedCandidate;
                    }

                    this.isLoaded = true
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

<style scoped>
    .icon {
        cursor: pointer;
    }
</style>