<template>
<div class="row" v-if="category.candidates.length > 0">
    <div class="col-md-4" v-for="candidate in category.candidates" :key="candidate.id">
        <VoteSingleCandidate :candidate="candidate"/>
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
    props: ["category"]
}
</script>

<style>

</style>