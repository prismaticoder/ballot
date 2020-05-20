<template>
<div class="row" v-if="category.candidates">
    <div class="col-md-4" v-for="candidate in category.candidates" :key="candidate.id">
        <SingleCandidate :candidate="candidate"> </SingleCandidate>
    </div>
</div>
<div class="row" v-else>
    <p class="text-center">
        There are currently no approved candidates for this category
    </p>
</div>
</template>

<script>

import SingleCandidate from './SingleCandidate'

export default {
    name: "SingleCategory",
    components: {
        SingleCandidate
    },
    props: ["category"]
}
</script>

<style>

</style>