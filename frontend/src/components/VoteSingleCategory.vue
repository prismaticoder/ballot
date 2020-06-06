<template>
<div v-if="category.candidates.length > 0">
    <div class="row justify-content-center">
        <div class="col-lg-4" v-for="candidate in category.candidates" :key="candidate.id">
            <VoteSingleCandidate :candidate="candidate" :selectedCandidate="selectedCandidate" v-on:selectCandidate="selectCandidate"/>
        </div>
    </div>
    <v-btn :disabled="!selectedCandidate" rounded :color="btnColor" class="mt-5 text-white col-md-4 col-6">
        VOTE
    </v-btn>
</div>

<div class="row" v-else>
    <p class="text-center">
        There are currently no approved candidates for this category
    </p>
</div>

</template>

<script>

import VoteSingleCandidate from './VoteSingleCandidate'

export default {
    name: "VoteSingleCategory",
    components: {
        VoteSingleCandidate
    },
    data() {
        return {
            btnColor: "#162059",
            selectedCandidate: null
        }
    },
    props: ["category"],
    methods: {
        selectCandidate(id) {
            this.selectedCandidate = id
        },
    },
    watch: {
        'category.id'() {
            console.log("check")
            this.selectedCandidate = null
        }
                
    }
}

</script>

<style>

</style>