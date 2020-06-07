<template>
<div v-if="category.candidates.length > 0">
    <div class="row justify-content-center">
        <div class="col-lg-4" v-for="candidate in category.candidates" :key="candidate.id">
            <VoteSingleCandidate :candidate="candidate" :selectedCandidate="selectedCandidate" v-on:selectCandidate="selectCandidate"/>
        </div>
    </div>
    <div class="row justify-content-center">
            <v-btn tile v-show="currentIndex !== 0"  :color="btnColor" class="mt-5 text-white p-3 col-md-2 col-5" @click="$emit('storeVote', 'previous', category.id, selectedCandidate)">
                <v-icon small>
                    mdi-arrow-left
                </v-icon>
               &nbsp; PREV
            </v-btn>
        <div class="col-2"></div>
            <v-btn tile :color="btnColor" v-show="currentIndex !== this.categories.length - 1" class="mt-5 text-white p-3 col-md-2 col-5" @click="$emit('storeVote', 'next', category.id, selectedCandidate)">
                NEXT &nbsp;
                <v-icon small>
                    mdi-arrow-right
                </v-icon>
            </v-btn>
    </div>
    
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
            selectedCandidate: this.category.selectedCandidate || null
        }
    },
    props: ["category","currentIndex","categories"],
    methods: {
        selectCandidate(id) {
            this.selectedCandidate = id
        },
    },
    watch: {
        'category.id'() {
            this.selectedCandidate = this.category.selectedCandidate
        }
                
    }
}

</script>

<style>

</style>