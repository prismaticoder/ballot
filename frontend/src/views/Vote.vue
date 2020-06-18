<template>
  <div class="container" v-if="token">
      <h3 class="main-header mt-4" style="text-align: center;">Vote Your Candidates | Ballot</h3>
      <hr>

        <div class="mt-4" v-if="isLoaded && !submitPage">
            <p class="mt-2 text-left">
                <span class="header">INSTRUCTIONS</span>
                Select the candidate you wish to vote for in that category, click the next/previous button to go to the next category. For an undecided vote, do not select any candidate. 
            </p>
            <hr>

            <h4 class="text-capitalize">Category: {{currentCategory.name.toLowerCase()}}</h4>

            <hr>
            <VoteSingleCategory :categories="categories" :category="currentCategory" @storeVote="storeVote" :currentIndex="currentIndex" />
        </div>
        <div class="mt-4" v-else-if="isLoaded && submitPage">
            <p class="mt-2 text-left">
                <span class="header">CAST VOTE</span>
                Please check through your candidate selections and click the "Cast Vote" button to cast your vote if satisfied, or the "Go Back" button to change a selection. 
            </p>
            <hr>
            <v-dialog v-model="dialog" persistent max-width="350">
                <v-card>
                    <v-card-title class="headline">Confirmation</v-card-title>
                    <v-card-text>
                    Please confirm that you have selected your preferred candidates and want to proceed to cast your vote.
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn :disabled="voteBtnLoading" color="green darken-1" text @click="dialog = false">No</v-btn>
                        <v-btn :loading="voteBtnLoading" :disabled="voteBtnLoading" color="green darken-1" text @click="castVote()">Yes</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <div class="row">
                <EachSubmission :category="category" :votes="votes" v-for="category in categories" :key="category.id" />
            </div>

            <v-dialog v-model="successDialog" persistent max-width="350">
                <v-card>
                    <v-card-title class="headline">Vote Cast Successfully</v-card-title>
                    <v-card-text>
                    {{successText}}
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="reloadPage()">OK</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <div class="col-md-2 col-5 mx-auto">
                <v-btn block tile title="Back" @click="goBack()" :color="btnColor" class="mt-5 bg-white blueColor p-3">
                    <v-icon small>
                        mdi-arrow-left
                    </v-icon> &nbsp;
                    GO BACK
                </v-btn>            
                <v-btn block tile title="Cast Vote" @click="dialog = true" :color="btnColor" class="mt-5 text-white p-3">
                    CAST VOTE &nbsp;
                    <v-icon small>
                        mdi-check
                    </v-icon>
                </v-btn>
            </div>

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
import VoteSingleCategory from '@/components/VoteSingleCategory'
import EachSubmission from '@/components/EachSubmission'

export default {
    name: "Vote",
    components: {
        VoterLogin,
        VoteSingleCategory,
        EachSubmission
    },
    data() {
        return {
            token: localStorage.getItem('bToken') || null,
            dialog: true,
            categories: null,
            currentCategory: null,
            successDialog: false,
            successText: null,
            currentIndex: 0,
            btnColor: "#162059",
            isLoaded: false,
            voteBtnLoading: false,
            submitPage: false,
            votes: JSON.parse(localStorage.getItem('votes-stored')) || []
        }
    },
    methods: {
        updateToken() {
            window.location.reload()
        },
        goBack() {
            this.submitPage = false
        },
        storeVote(type, categoryId, candidateId) {
            this.votes = this.votes.filter(vote => vote.categoryId !== categoryId)
            this.votes.push({categoryId, candidateId})
            localStorage.setItem('votes-stored', JSON.stringify(this.votes))

            if (['next','previous'].includes(type)) {

                 if (type == 'next') {
                    this.currentIndex += 1;
                    this.currentCategory = this.categories[this.currentIndex]
                }

                else {
                    this.currentIndex -= 1;
                    this.currentCategory = this.categories[this.currentIndex]
                }

                let selectedArray = this.votes.filter(vote => vote.categoryId == this.currentCategory.id)
                let selectedCandidate = selectedArray.length > 0 ? selectedArray[0].candidateId : null

                this.currentCategory.selectedCandidate = selectedCandidate;
            }
            
            else {
                this.dialog = false
                this.submitPage = true
            }
        },
        reloadPage() {
            window.location.reload()
        },
        castVote() {
            this.voteBtnLoading = true

            this.$http.post('vote', {votes: JSON.stringify(this.votes)})
            .then(res => {
                this.dialog = false;
                this.voteBtnLoading = false;
                localStorage.removeItem('bToken')
                localStorage.removeItem('votes-stored')
                this.successDialog = true;
                this.successText = res.data.message
                setTimeout(function() {window.location.reload()}, 5000)
            })
            .catch(err => {
                this.dialog = false;
                this.voteBtnLoading = false;
                alert(err.response ? err.response.data.error : "There was an error processing your request, please reload the page and try again")

                if (err.status == 403) {
                    localStorage.removeItem('bToken')
                    localStorage.removeItem('votes-stored')
                    window.location.reload()
                }
            })
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