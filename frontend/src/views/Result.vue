<template>
  <div>
    <h3 class="main-header mt-4" style="text-align: center;">Approved Election Results</h3>
    <hr>
    <div v-if="isLoaded && !pageText">
        <a href="#downloadResults" class="list-group-item mt-1 blueColor" @click.prevent="downloadResult()">Download with detailed analysis (PDF Format) <v-icon>mdi-download</v-icon> </a>

        <h5 class="mt-4">TOTAL VOTES - <strong>{{totalVotes}}</strong></h5>
        <hr>
        <div class="mt-5 mx-auto" :id="category.id" v-for="category in categories" v-bind:key="category.id">
            <h4 class="text-center">CATEGORY: {{category.name.toUpperCase()}}</h4>
            <hr>
            <CategoryResult class="justify-content-center mt-4" :category="category" :totalVotes="totalVotes"/>
        </div>
    </div>
    <div v-else-if="isLoaded && pageText">
        <div class="mt-5 mx-auto">
            <p>
                {{pageText}}
            </p>
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

import CategoryResult from '@/components/result/CategoryResult';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default {
    name: "Result",
    components: {
        CategoryResult
    },
    data() {
        return {
            isLoaded: false,
            categories: null,
            totalVotes: null,
            pageText: null,
            name: process.env.VUE_APP_NAME,
            maxLevel: process.env.VUE_APP_HIGHEST_LEVEL,
            levels: []
        }
    },
    methods: {
        init() {
            this.$http.get('results')
            .then(res => {
                this.categories = res.data.categories;
                this.totalVotes = res.data.totalVotes;

                for (let i = 100; i <= this.maxLevel; i+=100) {
                    this.levels.push(`${i}L VOTES`)
                }

                this.isLoaded = true
            })
            .catch(err => {
                this.pageText = err.response ? err.response.data.error : "Error processing request, please try again"
                this.isLoaded = true;
            })
        },
        downloadResult() {
            var doc = new jsPDF();
            let name = this.name.toLowerCase().split(' ').join('-')
            name = name + '-election-result.pdf'



            var header = function () {
                doc.setFontSize(15);
                doc.setFontStyle('normal');
                doc.text(`${process.env.VUE_APP_NAME.toUpperCase()} ELECTION RESULTS WITH ANALYSIS | BALLOT`, 25, 20);
            };

            this.categories.forEach(category => {

                let categoryTotal = category.candidates.reduce((acc, candidate) => {
                    return acc + candidate.voteCount
                },0)

                let undecidedVoteCount = this.totalVotes - categoryTotal

                let highestVote = (undecidedVoteCount >= category.candidates[0].voteCount) ? undecidedVoteCount : category.candidates[0].voteCount

                let categoryResults = category.candidates.map((candidate,index) => {
                    let voteCountArray;
                    if (candidate.Voters.length > 0) {
                        voteCountArray = Object.values(candidate.Voters[0])
                    }
                    else {
                        voteCountArray = new Array(this.levels.length).fill(0)
                    }
                    return [index+1,category.name,candidate.fullName, ...voteCountArray ,candidate.voteCount,(candidate.voteCount == highestVote) ? 'WINNER' : '-']
                })

                categoryResults.push([category.candidates.length + 1, category.name, "Void Votes", ...new Array(this.levels.length).fill('-'),undecidedVoteCount,'-'])

                doc.autoTable({
                    head: [['S/N', 'POST', 'CANDIDATE NAME', ...this.levels , 'TOTAL','STATUS']],
                    body: categoryResults,
                    margin: {top: 30},
                    didDrawPage: header
                })
            })

            doc.save(name)
        }
    },
    mounted() {
        this.init()
    }
}
</script>

<style>

</style>