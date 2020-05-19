<template>
<div class="row">
    <div class="col-md-4" v-for="candidate in category.candidates" :key="candidate.id">
        <SingleCandidate :candidate="candidate"> </SingleCandidate>
    </div>
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