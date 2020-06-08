<template>
  <div class="row justify-content-center">
    <div class="col-md-4" v-for="(candidate,index) in category.candidates" :key="candidate.id">
        <SingleResult :candidate="candidate" :index="index" :categoryTotal="categoryTotal" :totalVotes="totalVotes" :highestVote="highestVote"/>
    </div>
    <div class="col-md-4">
        <v-card style="text-decoration:none" class="mx-auto" width="20rem" tile>

            <v-card-title class="text-center">Undecided Voters</v-card-title>

            <v-card-text>
                <div>
                    <span class="tag mb-2">VOTES</span>
                    <span class="timer blueColor">{{undecidedVoters}}</span>

                    <span class="tag mt-4 mb-2">PERCENTAGE OF TOTAL</span>
                    <span class="timer">{{undecidedPercent}}%</span>

                </div>
            </v-card-text>
        </v-card>
    </div>
   
  </div>
</template>

<script>

import SingleResult from './SingleResult'

export default {
    name: "CategoryResult",
    components: {
        SingleResult
    },
    data() {
        return {
            categoryTotal: null
        }
    },
    props: ["category","totalVotes"],
    methods: {
        init() {
            this.category.candidates.sort((a,b) => {
                if (a.voteCount > b.voteCount) {
                    return -1
                }
                else if (a.voteCount < b.voteCount) {
                    return 1
                }
                else {
                    return 0
                }
            })

            this.categoryTotal = this.category.candidates.reduce((acc, candidate) => {
                return acc + candidate.voteCount
            },0)
        }
    },
    mounted() {
        this.init()
    },
    computed: {
        undecidedVoters() {
            return this.totalVotes - this.categoryTotal
        },
        undecidedPercent() {
            let percent = (this.undecidedVoters / this.totalVotes) * 100;
            return percent
        },
        highestVote() {
            if (this.undecidedVoters >= this.category.candidates[0].voteCount) {
                return this.undecidedVoters
            }
            return this.category.candidates[0].voteCount
        }
    }
}
</script>

<style>

</style>